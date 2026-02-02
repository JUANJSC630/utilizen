<?php

namespace App\Http\Middleware;

use App\Services\SeoService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoIndexAuthPages
{
    public function __construct(private SeoService $seoService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authRoutes = [
            'login',
            'register',
            'password.',
            'verification.',
            'two-factor.',
            'dashboard',
            'settings.',
            'account.',
            'admin.',
        ];

        foreach ($authRoutes as $route) {
            if ($request->routeIs($route.'*')) {
                $this->seoService->setNoIndex();
                break;
            }
        }

        return $next($request);
    }
}
