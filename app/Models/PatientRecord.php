<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PatientRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'doctor_id',
        'visited_at',
        'chief_complaint',
        'diagnosis',
        'notes',
        'blood_pressure',
        'heart_rate',
        'temperature',
        'weight',
        'height',
        'oxygen_saturation',
        'created_by',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function medications(): HasMany
    {
        return $this->hasMany(PatientRecordMedication::class);
    }

    public function labResults(): HasMany
    {
        return $this->hasMany(PatientRecordLabResult::class);
    }

    public function testResults(): HasMany
    {
        return $this->hasMany(PatientRecordTestResult::class);
    }
}
