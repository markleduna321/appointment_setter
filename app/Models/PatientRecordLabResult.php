<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientRecordLabResult extends Model
{
    protected $fillable = [
        'patient_record_id',
        'test_name',
        'result',
        'unit',
        'reference_range',
        'status',
        'remarks',
        'tested_at',
    ];

    protected $casts = [
        'tested_at' => 'date',
    ];

    public function record(): BelongsTo
    {
        return $this->belongsTo(PatientRecord::class, 'patient_record_id');
    }
}
