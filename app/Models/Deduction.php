<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deduction extends Model
{
    //
    use HasFactory;

    protected $fillable = ['employee_id', 'title', 'amount'];
}
