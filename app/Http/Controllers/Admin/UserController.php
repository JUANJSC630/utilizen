<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ToolUsage;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by premium status
        if ($request->filled('is_premium')) {
            $query->where('is_premium', $request->is_premium === 'true');
        }

        $users = $query->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'is_premium']),
        ]);
    }

    public function show(User $user): Response
    {
        $recentUsage = ToolUsage::where('user_id', $user->id)
            ->with('tool:id,name,slug,category')
            ->latest()
            ->limit(10)
            ->get();

        $usageStats = [
            'total' => ToolUsage::where('user_id', $user->id)->count(),
            'thisMonth' => ToolUsage::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'recentUsage' => $recentUsage,
            'usageStats' => $usageStats,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,'.$user->id,
            'role' => 'sometimes|string|in:user,admin',
            'is_premium' => 'sometimes|boolean',
            'api_calls_limit' => 'sometimes|integer|min:0',
        ]);

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
