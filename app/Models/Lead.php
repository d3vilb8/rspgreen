<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;
    protected $fillable = [
        'client_id',
        'email_address',
        'phone_number',
        'source',
        'lead_for',
        'lead_stage',
        'comment',
        'status',
        'assign'
    ];
}
