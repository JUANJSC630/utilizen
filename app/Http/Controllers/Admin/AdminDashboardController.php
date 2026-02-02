<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\ToolUsage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // User stats
        $userStats = [
            'total' => User::count(),
            'thisMonth' => User::whereMonth('created_at', now()->month)->count(),
            'premium' => User::where('is_premium', true)->count(),
            'admins' => User::where('role', 'admin')->count(),
        ];

        // Tool stats
        $toolStats = [
            'total' => Tool::count(),
            'active' => Tool::where('is_active', true)->count(),
            'premium' => Tool::where('is_premium', true)->count(),
        ];

        // Usage stats
        $usageStats = [
            'total' => ToolUsage::count(),
            'thisMonth' => ToolUsage::whereMonth('created_at', now()->month)->count(),
            'thisWeek' => ToolUsage::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'today' => ToolUsage::whereDate('created_at', today())->count(),
        ];

        // Recent users
        $recentUsers = User::latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'role', 'is_premium', 'created_at']);

        // Popular tools
        $popularTools = ToolUsage::select('tool_id', DB::raw('count(*) as usage_count'))
            ->with('tool:id,name,slug,category')
            ->whereMonth('created_at', now()->month)
            ->groupBy('tool_id')
            ->orderByDesc('usage_count')
            ->limit(5)
            ->get();

        // Usage by day (last 7 days)
        $usageByDay = ToolUsage::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('admin/dashboard', [
            'userStats' => $userStats,
            'toolStats' => $toolStats,
            'usageStats' => $usageStats,
            'recentUsers' => $recentUsers,
            'popularTools' => $popularTools,
            'usageByDay' => $usageByDay,
        ]);
    }
}
