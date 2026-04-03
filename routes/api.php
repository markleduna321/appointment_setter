<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PatientRecordController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Truly public endpoints — no session, no CSRF, no auth required
Route::get('/doctors',       [DoctorController::class, 'index']);
Route::get('/doctors/{id}',  [DoctorController::class, 'show']);
Route::get('/services',      [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Auth routes under web middleware so sessions and CSRF work for the SPA
Route::middleware('web')->group(function () {
    Route::post('/auth/login', [AuthApiController::class, 'login']);
    Route::post('/auth/register', [AuthApiController::class, 'register']);
    Route::post('/auth/logout', [AuthApiController::class, 'logout'])->middleware('auth');

    // Dashboard and protected routes
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

        // Doctors (create/update/delete remain protected)
        Route::post('/doctors',           [DoctorController::class, 'store']);
        Route::put('/doctors/{id}',       [DoctorController::class, 'update']);
        // POST alias for update — PHP only populates $_FILES on POST requests
        Route::post('/doctors/{id}/update', [DoctorController::class, 'update']);
        Route::delete('/doctors/{id}',    [DoctorController::class, 'destroy']);

        // Patients
        Route::get('/patients',        [PatientController::class, 'index']);
        Route::get('/patients/{id}',   [PatientController::class, 'show']);
        Route::post('/patients',       [PatientController::class, 'store']);
        Route::put('/patients/{id}',   [PatientController::class, 'update']);
        Route::delete('/patients/{id}',[PatientController::class, 'destroy']);

        // Patient medical records
        Route::get('/patients/{patientId}/records',         [PatientRecordController::class, 'index']);
        Route::get('/patients/{patientId}/records/latest',  [PatientRecordController::class, 'latest']);
        Route::post('/patients/{patientId}/records',        [PatientRecordController::class, 'store']);
        Route::get('/patients/{patientId}/records/{id}',    [PatientRecordController::class, 'show']);
        Route::put('/patients/{patientId}/records/{id}',    [PatientRecordController::class, 'update']);
        Route::delete('/patients/{patientId}/records/{id}', [PatientRecordController::class, 'destroy']);

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

        // Services (create/update/delete remain protected)
        Route::post('/services',              [ServiceController::class, 'store']);
        Route::put('/services/{id}',          [ServiceController::class, 'update']);
        // POST alias for update — PHP only populates $_FILES on POST requests
        Route::post('/services/{id}/update',  [ServiceController::class, 'update']);
        Route::delete('/services/{id}',       [ServiceController::class, 'destroy']);

        // User management (super-admin only)
        Route::get('/usermanagement', [UserManagementController::class, 'index']);
        Route::post('/usermanagement', [UserManagementController::class, 'store']);
        Route::get('/usermanagement/{id}', [UserManagementController::class, 'show']);
        Route::put('/usermanagement/{id}', [UserManagementController::class, 'update']);
        Route::delete('/usermanagement/{id}', [UserManagementController::class, 'destroy']);
    });
});
