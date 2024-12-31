<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductService extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'purchase_price',
        'unit_id',
        'description',
        'image',
        'sku',
    ];
}
