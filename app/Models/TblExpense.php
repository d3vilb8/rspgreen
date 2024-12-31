<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblExpense extends Model
{
    use HasFactory;


    protected $fillable = [
        'customer_id',
        'status',
        'date',
        'main_label',
        'amount',
        'label',
        'income_entries',
    ];
}
