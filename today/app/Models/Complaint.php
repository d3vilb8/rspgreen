<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'complaint_no',
        'date',
        'customer_id',
        'complaint_type',
        'description',
        'product_id',
        'assigned_id',
        'assigned_date',
        'status',
        'mobile_no',
        'email',
        'address',
    ];
}
