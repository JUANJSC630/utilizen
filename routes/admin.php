<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ToolAdminController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');

    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Tools Management
    Route::get('/tools', [ToolAdminController::class, 'index'])->name('tools.index');
    Route::get('/tools/create', [ToolAdminController::class, 'create'])->name('tools.create');
    Route::post('/tools', [ToolAdminController::class, 'store'])->name('tools.store');
    Route::get('/tools/{tool}', [ToolAdminController::class, 'edit'])->name('tools.edit');
    Route::patch('/tools/{tool}', [ToolAdminController::class, 'update'])->name('tools.update');
    Route::delete('/tools/{tool}', [ToolAdminController::class, 'destroy'])->name('tools.destroy');
});
