<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeTime extends Model
{
    protected $fillable = [
        'employee_id',
        'office_start_time',
        'office_end_time',
    ];
}
