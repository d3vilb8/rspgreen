<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillForm extends Model
{
    use HasFactory;
    protected $table = 'bill_forms';
    protected $fillable = [
        'bill_id',
        'product_id',
        'quantity',
        'price',
        'discount',
        'tax',
        'amount'
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function product()
    {
        return $this->belongsTo(ProductService::class);
    }
}
