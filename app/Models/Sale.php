<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_no',
        'customer_id',
        'date',
        'billing_address',
        'status',
        'amc_type',
        'mobile_no',
        'email',
        'sales_details',
        'account_tax',
        'invoice_type'
    ];

    protected $casts = [
        'sales_details' => 'json',
        'account_tax' => 'json'
    ];
}
