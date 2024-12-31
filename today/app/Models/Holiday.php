<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'location'
    ];
    public function assignedEmployees()
    {
        return $this->belongsToMany(User::class, 'holiday_assigns', 'holiday_id', 'employee_id','location');
    }
}
