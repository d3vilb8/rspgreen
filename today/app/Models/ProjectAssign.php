<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAssign extends Model
{
    use HasFactory;
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    protected $fillable = [
        'project_id',
        'employee_id',
    ];
}
