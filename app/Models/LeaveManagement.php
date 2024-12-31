<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveManagement extends Model
{
    use HasFactory;
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'sdate',
        'edate',
        'reason',
        'remark',
        'hours',
        'status',
        'is_unpaid',
        'documents',
        'admin_reject'
    ];
}
