<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialty',
        'email',
        'phone',
        'bio',
        'photo',
        'status',
        'schedule_start',
        'schedule_end',
        'schedule_days',
    ];

    protected $casts = [
        'schedule_days' => 'array',
    ];

    // -------------------------------------------------------------------------
    // Relationships (extend once appointments stores doctor_id FK)
    // -------------------------------------------------------------------------

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_name', 'name');
    }
}
