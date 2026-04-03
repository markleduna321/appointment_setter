<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_name',
        'service',
        'doctor_name',
        'date',
        'time',
        'notes',
        'status',
        'visit_type',
        'source',
        'updated_by',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    /** The patient who owns this appointment. */
    public function patient()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** The staff member who last updated the status (nullable). */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Returns true if the appointment is still more than $hours hours away.
     */
    public function isMoreThanHoursAway(int $hours = 3): bool
    {
        $scheduled = \Carbon\Carbon::parse($this->date->toDateString() . ' ' . $this->time);
        return $scheduled->diffInSeconds(now(), false) < -($hours * 3600);
    }
}
