<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientRecordTestResult extends Model
{
    protected $fillable = [
        'patient_record_id',
        'type',
        'description',
        'findings',
        'file_path',
        'conducted_at',
    ];

    protected $casts = [
        'conducted_at' => 'date',
    ];

    public function record(): BelongsTo
    {
        return $this->belongsTo(PatientRecord::class, 'patient_record_id');
    }
}
