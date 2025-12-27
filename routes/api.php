<?php

use App\Http\Controllers\Api\UsageTrackingController;
use Illuminate\Support\Facades\Route;

// Public API routes (no authentication required)
// Using 'web' middleware to enable sessions and capture authenticated user
Route::post('/usage/track', [UsageTrackingController::class, 'track'])
    ->middleware('web')
    ->name('api.usage.track');

// API V1 routes (will be used for premium features later)
Route::prefix('v1')->name('api.v1.')->group(function () {
    // Premium API routes (Sanctum authentication will be added in Phase 4)
    Route::middleware('auth:sanctum')->group(function () {
        // TODO: Add premium API endpoints
    });
});
