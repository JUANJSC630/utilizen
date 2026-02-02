<?php

use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::middleware(['auth', 'verified'])->prefix('account')->name('account.')->group(function () {
    Route::redirect('/', '/account/overview');

    Route::get('/overview', [AccountController::class, 'overview'])->name('overview');

    // Profile (migrated from settings)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Security (password + 2FA)
    Route::get('/security', function (Request $request) {
        return Inertia::render('account/security', [
            'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    })->name('security');
    Route::put('/security/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('security.password');

    // Subscription
    Route::get('/subscription', [AccountController::class, 'subscription'])->name('subscription');

    // Billing
    Route::get('/billing', [AccountController::class, 'billing'])->name('billing');

    // Usage history
    Route::get('/usage', [AccountController::class, 'usage'])->name('usage');

    // Preferences
    Route::get('/preferences', [AccountController::class, 'preferences'])->name('preferences');
    Route::patch('/preferences', [AccountController::class, 'updatePreferences'])->name('preferences.update');
});
