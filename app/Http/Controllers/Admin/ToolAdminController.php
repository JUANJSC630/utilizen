<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\ToolUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ToolAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tool::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        // Filter by premium
        if ($request->filled('is_premium')) {
            $query->where('is_premium', $request->is_premium === 'true');
        }

        $tools = $query->withCount('toolUsages')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Get all unique categories
        $categories = Tool::distinct()->pluck('category')->filter()->values();

        return Inertia::render('admin/tools/index', [
            'tools' => $tools,
            'filters' => $request->only(['search', 'category', 'is_active', 'is_premium']),
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $categories = Tool::distinct()->pluck('category')->filter()->values();

        return Inertia::render('admin/tools/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tools,slug',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'icon' => 'nullable|string|max:50',
            'component_name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'is_premium' => 'boolean',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'nullable|string|max:500',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Tool::create($validated);

        return redirect()->route('admin.tools.index')
            ->with('success', 'Tool created successfully.');
    }

    public function edit(Tool $tool): Response
    {
        $categories = Tool::distinct()->pluck('category')->filter()->values();

        // Get usage stats
        $usageStats = [
            'total' => ToolUsage::where('tool_id', $tool->id)->count(),
            'thisMonth' => ToolUsage::where('tool_id', $tool->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'byDay' => ToolUsage::where('tool_id', $tool->id)
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        return Inertia::render('admin/tools/edit', [
            'tool' => $tool,
            'categories' => $categories,
            'usageStats' => $usageStats,
        ]);
    }

    public function update(Request $request, Tool $tool): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:tools,slug,'.$tool->id,
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:255',
            'category' => 'sometimes|string|max:100',
            'icon' => 'nullable|string|max:50',
            'component_name' => 'sometimes|string|max:255',
            'is_active' => 'boolean',
            'is_premium' => 'boolean',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'nullable|string|max:500',
        ]);

        $tool->update($validated);

        return back()->with('success', 'Tool updated successfully.');
    }

    public function destroy(Tool $tool): RedirectResponse
    {
        $tool->delete();

        return redirect()->route('admin.tools.index')
            ->with('success', 'Tool deleted successfully.');
    }
}
