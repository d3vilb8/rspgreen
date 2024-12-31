<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;
    protected $fillable = [
        'contractor_name',
        'email_address',
        'phone_number',
        'contractor_type',
        'contract_value',
        'start_date',
        'end_date',
        'description'
    ];
}
