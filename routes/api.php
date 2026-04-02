<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Auth routes under web middleware so sessions and CSRF work for the SPA
Route::middleware('web')->group(function () {
    Route::post('/auth/login', [AuthApiController::class, 'login']);
    Route::post('/auth/register', [AuthApiController::class, 'register']);
    Route::post('/auth/logout', [AuthApiController::class, 'logout'])->middleware('auth');

    // Dashboard
    Route::middleware('auth')->group(function () {
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/availability',                [AppointmentController::class, 'availability']);
        // Appointments
        Route::get('/appointments',              [AppointmentController::class, 'index']);
        Route::post('/appointments',             [AppointmentController::class, 'store']);
        Route::get('/appointments/{id}',         [AppointmentController::class, 'show']);
        Route::put('/appointments/{id}',         [AppointmentController::class, 'update']);
        Route::patch('/appointments/{id}/cancel',[AppointmentController::class, 'cancel']);
        Route::delete('/appointments/{id}',      [AppointmentController::class, 'destroy']);

        // Doctors
        Route::get('/doctors',        [DoctorController::class, 'index']);
        Route::post('/doctors',       [DoctorController::class, 'store']);
        Route::get('/doctors/{id}',   [DoctorController::class, 'show']);
        Route::put('/doctors/{id}',   [DoctorController::class, 'update']);
        Route::delete('/doctors/{id}',[DoctorController::class, 'destroy']);

        // Patients
        Route::get('/patients',        [PatientController::class, 'index']);
        Route::get('/patients/{id}',   [PatientController::class, 'show']);

        // Reports
        Route::get('/reports/appointments-summary', [ReportController::class, 'appointmentsSummary']);

        // Profile API (current authenticated user)
        Route::get('/profile', [\App\Http\Controllers\Api\ProfileApiController::class, 'show']);
        Route::patch('/profile', [\App\Http\Controllers\Api\ProfileApiController::class, 'update']);
        Route::put('/profile/password', [\App\Http\Controllers\Api\ProfileApiController::class, 'updatePassword']);
        Route::delete('/profile', [\App\Http\Controllers\Api\ProfileApiController::class, 'destroy']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

        // Services
        Route::get('/services',         [ServiceController::class, 'index']);
        Route::post('/services',        [ServiceController::class, 'store']);
        Route::get('/services/{id}',    [ServiceController::class, 'show']);
        Route::put('/services/{id}',    [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

        // User management (super-admin only)
        Route::get('/usermanagement', [UserManagementController::class, 'index']);
        Route::post('/usermanagement', [UserManagementController::class, 'store']);
        Route::get('/usermanagement/{id}', [UserManagementController::class, 'show']);
        Route::put('/usermanagement/{id}', [UserManagementController::class, 'update']);
        Route::delete('/usermanagement/{id}', [UserManagementController::class, 'destroy']);
    });
});
