<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    use HasFactory;
    // use HasFactory;

    protected $fillable = [
        'journal_number',
        'transaction_date',
        'reference',
        'description',
    ];

    public function rows()
    {
        return $this->hasMany(JournalEntryRow::class, 'journal_entry_id');
    }
}
