<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing_page/page');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/page');
    })->name('dashboard');

    Route::get('/appointments', function () {
        return Inertia::render('appointments/page');
    })->name('appointments');

    Route::get('/appointments/new', function () {
        return Inertia::render('book_now/page');
    })->name('appointments.book');

    Route::get('/user-management', function () {
        return Inertia::render('user_management/page');
    })->name('user.management');

    Route::get('/doctors', function () {
        return Inertia::render('doctors/page');
    })->name('doctors');

    Route::get('/services', function () {
        return Inertia::render('services/page');
    })->name('services');

    Route::get('/schedule', function () {
        return Inertia::render('schedule/page');
    })->name('schedule');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
