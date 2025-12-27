<?php

use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ToolController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Tools routes
Route::prefix('tools')->name('tools.')->group(function () {
    Route::get('/', [ToolController::class, 'index'])->name('index');
    Route::get('/{slug}', [ToolController::class, 'show'])->name('show');
});

// Dashboard routes (authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Static pages
Route::get('/pricing', function () {
    return Inertia::render('static/pricing');
})->name('pricing');

Route::get('/blog', function () {
    return Inertia::render('static/coming-soon', [
        'title' => 'Blog Coming Soon',
        'description' => 'We\'re working on our blog. Stay tuned for tutorials, tips, and React development insights.',
    ]);
})->name('blog');

Route::get('/docs', function () {
    return Inertia::render('static/coming-soon', [
        'title' => 'Documentation Coming Soon',
        'description' => 'Comprehensive documentation for all our tools is on the way. Check back soon!',
    ]);
})->name('docs');

Route::get('/about', function () {
    return Inertia::render('static/coming-soon', [
        'title' => 'About Us',
        'description' => 'Learn more about our mission to empower React developers with powerful, free tools.',
    ]);
})->name('about');

Route::get('/privacy', function () {
    return Inertia::render('static/coming-soon', [
        'title' => 'Privacy Policy',
        'description' => 'Our privacy policy is being finalized. Your data privacy is our top priority.',
    ]);
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('static/coming-soon', [
        'title' => 'Terms of Service',
        'description' => 'Our terms of service are being prepared. We value transparency and fairness.',
    ]);
})->name('terms');

require __DIR__.'/settings.php';
