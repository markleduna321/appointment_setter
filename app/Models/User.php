<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'source',
    ];

    /**
     * Append computed attributes to model array/json.
     * `phone` will be resolved from the related `user_mobiles` row.
     */
    protected $appends = ['phone'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    /** All appointments belonging to this patient. */
    public function appointments()
    {
        return $this->hasMany(\App\Models\Appointment::class, 'user_id');
    }

    /** The doctor profile linked to this user (when role = doctor). */
    public function doctor()
    {
        return $this->hasOne(\App\Models\Doctor::class, 'user_id');
    }

    /** All patient records for this user (when role = patient). */
    public function patientRecords()
    {
        return $this->hasMany(\App\Models\PatientRecord::class, 'patient_id');
    }

    /** The one mobile record for this user. */
    public function mobile()
    {
        return $this->hasOne(\App\Models\UserMobile::class, 'user_id');
    }

    /**
     * Provide a `phone` attribute that proxies to the related UserMobile.
     */
    public function getPhoneAttribute()
    {
        return $this->mobile?->mobile ?? null;
    }
}
