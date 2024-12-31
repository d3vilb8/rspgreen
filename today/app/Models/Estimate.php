<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estimate extends Model
{
    use HasFactory;
    protected $fillable = ['customer_id', 'account_id', 'proposal_number', 'issue_date', 'subtotal', 'discount', 'tax', 'total'];
    // public function customer()
    // {
    //     return $this->belongsTo(Customer::class);
    // }

    // public function category()
    // {
    //     return $this->belongsTo(Category::class);
    // }

    // public function items()
    // {
    //     return $this->hasMany(ProposalItem::class);
    // }
}
