<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ToolUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $recentUsage = ToolUsage::where('user_id', $user->id)
            ->with('tool:id,name,slug')
            ->latest()
            ->limit(10)
            ->get();

        $usageStats = [
            'total_usage' => ToolUsage::where('user_id', $user->id)->count(),
            'this_month' => ToolUsage::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'favorite_tool' => ToolUsage::where('user_id', $user->id)
                ->selectRaw('tool_id, COUNT(*) as count')
                ->groupBy('tool_id')
                ->orderByDesc('count')
                ->with('tool:id,name,slug')
                ->first(),
        ];

        return Inertia::render('dashboard/Index', [
            'recentUsage' => $recentUsage,
            'usageStats' => $usageStats,
            'isPremium' => $user->isPremium(),
            'subscription' => $user->subscriptions()->latest()->first(),
        ]);
    }
}
