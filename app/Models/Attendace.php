<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendace extends Model
{
    use HasFactory;
    protected $fillable = ['employee_id', 'date', 'in_time', 'out_time','total_time'];
}
