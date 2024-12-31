<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstimateItem extends Model
{
    use HasFactory;
    protected $fillable = ['proposal_id', 'item_name', 'quantity', 'price', 'discount', 'tax', 'amount'];
}
