<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\ToolUsage;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function __construct(private SeoService $seoService) {}

    public function index(): Response
    {
        $this->seoService->setHomePage();

        // Get featured tools (top 3 most used)
        $featuredTools = Cache::remember('homepage.featured_tools', 3600, function () {
            return Tool::where('is_active', true)
                ->orderBy('usage_count', 'desc')
                ->limit(3)
                ->get(['id', 'name', 'slug', 'description', 'usage_count', 'category']);
        });

        // Get all active tools for the grid
        $allTools = Cache::remember('homepage.all_tools', 3600, function () {
            return Tool::where('is_active', true)
                ->orderBy('usage_count', 'desc')
                ->get(['id', 'name', 'slug', 'description', 'category', 'is_premium']);
        });

        // Get stats
        $stats = Cache::remember('homepage.stats', 3600, function () {
            return [
                'total_developers' => 50000, // This would come from analytics
                'total_components_generated' => ToolUsage::where('action', 'generate')->count(),
                'satisfaction_rate' => 98,
                'total_tools' => Tool::where('is_active', true)->count(),
            ];
        });

        // Get tools by category for organized grid
        $toolsByCategory = Cache::remember('homepage.tools_by_category', 3600, function () use ($allTools) {
            return $allTools->groupBy('category');
        });

        return Inertia::render('welcome', [
            'featuredTools' => $featuredTools,
            'allTools' => $allTools,
            'toolsByCategory' => $toolsByCategory,
            'stats' => $stats,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
