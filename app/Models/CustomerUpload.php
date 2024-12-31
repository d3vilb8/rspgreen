<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'uploaded_file',
        'customer_id',
        'project_id',
    ];
    //
}

