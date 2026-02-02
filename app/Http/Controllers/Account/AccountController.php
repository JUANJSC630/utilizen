<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\ToolUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function overview(Request $request): Response
    {
        $user = $request->user();

        $recentUsage = ToolUsage::where('user_id', $user->id)
            ->with('tool:id,name,slug,category')
            ->latest()
            ->limit(5)
            ->get();

        $usageStats = [
            'total' => ToolUsage::where('user_id', $user->id)->count(),
            'thisMonth' => ToolUsage::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        return Inertia::render('account/overview', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_premium' => $user->is_premium ?? false,
                'premium_expires_at' => $user->premium_expires_at,
                'api_calls_count' => $user->api_calls_count ?? 0,
                'api_calls_limit' => $user->api_calls_limit ?? 100,
            ],
            'recentUsage' => $recentUsage,
            'usageStats' => $usageStats,
        ]);
    }

    public function subscription(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('account/subscription', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'is_premium' => $user->is_premium ?? false,
                'premium_expires_at' => $user->premium_expires_at,
                'api_calls_count' => $user->api_calls_count ?? 0,
                'api_calls_limit' => $user->api_calls_limit ?? 100,
            ],
            'plans' => [],
        ]);
    }

    public function billing(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('account/billing', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'is_premium' => $user->is_premium ?? false,
            ],
            'paymentMethods' => [],
            'invoices' => [],
            'billingAddress' => null,
        ]);
    }

    public function usage(Request $request): Response
    {
        $user = $request->user();

        $query = ToolUsage::where('user_id', $user->id)
            ->with('tool:id,name,slug,category');

        // Apply filters
        if ($request->filled('search')) {
            $query->whereHas('tool', function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('tool', function ($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        if ($request->filled('period')) {
            $query->when($request->period === 'today', fn ($q) => $q->whereDate('created_at', today()))
                ->when($request->period === 'week', fn ($q) => $q->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]))
                ->when($request->period === 'month', fn ($q) => $q->whereMonth('created_at', now()->month));
        }

        $usage = $query->latest()->paginate(20);

        // Get stats
        $stats = [
            'total' => ToolUsage::where('user_id', $user->id)->count(),
            'thisMonth' => ToolUsage::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'thisWeek' => ToolUsage::where('user_id', $user->id)
                ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count(),
            'byCategory' => ToolUsage::where('user_id', $user->id)
                ->join('tools', 'tool_usage.tool_id', '=', 'tools.id')
                ->select('tools.category', DB::raw('count(*) as count'))
                ->groupBy('tools.category')
                ->pluck('count', 'category')
                ->toArray(),
            'byTool' => ToolUsage::where('user_id', $user->id)
                ->join('tools', 'tool_usage.tool_id', '=', 'tools.id')
                ->select('tools.name', DB::raw('count(*) as count'))
                ->groupBy('tools.name')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->toArray(),
        ];

        // Get unique categories
        $categories = ToolUsage::where('user_id', $user->id)
            ->join('tools', 'tool_usage.tool_id', '=', 'tools.id')
            ->distinct()
            ->pluck('tools.category')
            ->toArray();

        return Inertia::render('account/usage', [
            'usage' => $usage,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'period']),
            'categories' => $categories,
        ]);
    }

    public function preferences(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('account/preferences', [
            'preferences' => [
                'language' => $user->language ?? 'en',
                'timezone' => $user->timezone ?? 'UTC',
                'email_notifications' => $user->email_notifications ?? true,
                'marketing_emails' => $user->marketing_emails ?? false,
                'product_updates' => $user->product_updates ?? true,
            ],
            'timezones' => timezone_identifiers_list(),
            'languages' => [
                ['code' => 'en', 'name' => 'English'],
                ['code' => 'es', 'name' => 'Spanish'],
            ],
        ]);
    }

    public function updatePreferences(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'language' => 'required|string|in:en,es',
            'timezone' => 'required|string|timezone',
            'email_notifications' => 'boolean',
            'marketing_emails' => 'boolean',
            'product_updates' => 'boolean',
        ]);

        $request->user()->update($validated);

        return back();
    }
}
