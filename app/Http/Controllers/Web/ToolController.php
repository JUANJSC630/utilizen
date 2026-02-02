<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ToolController extends Controller
{
    public function __construct(private SeoService $seoService) {}

    public function index(): Response
    {
        $this->seoService->setToolsIndex();

        $tools = Cache::remember('tools.active', 3600, function () {
            return Tool::where('is_active', true)
                ->orderBy('usage_count', 'desc')
                ->get();
        });

        return Inertia::render('tools/Index', [
            'tools' => $tools,
        ]);
    }

    public function show(string $slug): Response
    {
        $tool = Cache::remember("tool:{$slug}", 3600, function () use ($slug) {
            return Tool::where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();
        });

        $this->seoService->setToolPage($tool);

        $tool->incrementViews();

        $popularTools = Cache::remember('tools.popular', 3600, function () {
            return Tool::where('is_active', true)
                ->orderBy('usage_count', 'desc')
                ->limit(5)
                ->get();
        });

        return Inertia::render("tools/{$tool->component_name}", [
            'tool' => $tool,
            'popularTools' => $popularTools,
        ]);
    }
}
