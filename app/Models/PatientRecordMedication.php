<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientRecordMedication extends Model
{
    protected $fillable = [
        'patient_record_id',
        'name',
        'dosage',
        'frequency',
        'duration',
        'instructions',
    ];

    public function record(): BelongsTo
    {
        return $this->belongsTo(PatientRecord::class, 'patient_record_id');
    }
}
