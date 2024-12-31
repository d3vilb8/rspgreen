<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_first_login'=>'boolean',
            'is_web_login'=>'boolean',
            'is_exe_login'=>'boolean'
        ];
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'task_assigns', 'employee_id', 'task_id');
    }
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_assigns', 'employee_id', 'task_id')
            ->withPivot('employee_hours'); // Include the pivot field
    }

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class, 'user_id', 'id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    
    public function getJWTCustomClaims()
    {
        return [];
    }

    // public function isFirstLogin(){
    //     return $this->is_first_login;
    // }

    public function isExeLogin(){
        return $this->is_exe_login;
    }
}
