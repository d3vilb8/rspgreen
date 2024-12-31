<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timesheet extends Model
{
    use HasFactory;


    protected $fillable = [
        'user_id',
        'project_id',
        'task_id',
        'date',
        'field1',
        'field2',
        'field3',
        'field4',
        'field5',
        'field6',
        'field7',
        'status',
        'time_number',
        'description',
        'is_approved'
    ];
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    // Define the relationship with the Task model
    public function tasks()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
