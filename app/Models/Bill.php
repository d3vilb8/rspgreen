<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'category',
        'bill_date',
        'due_date',
        'bill_number',
        'order_number'
    ];

    public function billingforms()
    {
        return $this->hasMany(BillForm::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
