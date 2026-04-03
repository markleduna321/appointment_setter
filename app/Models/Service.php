<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'duration',
        'price',
        'status',
        'image',
    ];

    protected $casts = [
        'price'    => 'decimal:2',
        'duration' => 'integer',
    ];
}
