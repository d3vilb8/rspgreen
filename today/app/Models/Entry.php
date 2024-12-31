<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location_id',
        'type',
        'entry_at'
    ];

    public function loaction(){
        return $this->belongsTo(Location::class);
    }
}
