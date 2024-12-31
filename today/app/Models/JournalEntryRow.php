<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntryRow extends Model
{
    use HasFactory;

    protected $fillable = [
        'journal_entry_id',
        'account',
        'debit',
        'credit',
        'row_description',
        'amount',
    ];

    public function rows()
    {
        return $this->hasMany(JournalEntryRow::class, 'journal_entry_id');
    }
}
