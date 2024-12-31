<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'quotation_no',
        'quotation_date',
        'quotation_amount',
        'customer_id',
        'mobile',
        'ref_no',
        'report',
        'name',
        'email',
        'status',
        'subject',
        'address',
        'message'
    ];
}
