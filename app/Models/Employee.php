<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Employee extends Model
{
    use HasFactory, Notifiable;

    // Add branch_id to the fillable array
    protected $fillable = [
        // 'name', // other fillable fields
        // 'email', // other fillable fields
        'branch_id', // <-- Add this line
    ];
}
