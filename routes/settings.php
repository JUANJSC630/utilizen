<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Redirect old settings GET routes to new account routes
    Route::redirect('settings', '/account/profile')->name('settings.redirect');
    Route::redirect('settings/profile', '/account/profile')->name('profile.edit');
    Route::redirect('settings/password', '/account/security')->name('user-password.edit');
    Route::redirect('settings/two-factor', '/account/security')->name('two-factor.show');
    Route::redirect('settings/appearance', '/account/preferences')->name('appearance.edit');

    // Keep POST/PATCH/DELETE routes for backwards compatibility with existing forms
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');
});
