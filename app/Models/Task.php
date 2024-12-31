<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;


    public function assignments()
    {
        return $this->hasMany(TaskAssign::class);
    }
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'task_assigns', 'task_id', 'employee_id')
            ->withPivot('employee_hours'); // Include the pivot field
    }
    public function taskcategories()
    {
        return $this->belongsTo(TaskCategory::class, 'task_name');
    }
    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }
    
    public function team(){
        return $this->hasMany(Team::class);
    }

    protected $fillable = ['status'];
}
