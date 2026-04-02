<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMobile extends Model
{
    use HasFactory;

    protected $table = 'user_mobiles';

    protected $fillable = [
        'user_id',
        'mobile',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
