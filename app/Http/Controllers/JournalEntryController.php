<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use App\Models\JournalEntryRow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalEntryController extends Controller
{

    public function index()
    {
        $journal = JournalEntry::withSum('rows', 'debit')
            ->withSum('rows', 'credit')
            ->get();
        // dd($journal);
        return Inertia::render('accounts/journalindex', compact('journal'));
    }
    public function store(Request $request)
    {
        // Generate the next journal number based on the latest entry
        $lastJournal = JournalEntry::latest('id')->first();
        $newJournalNumber = '#JUR' . str_pad(optional($lastJournal)->id + 1, 5, '0', STR_PAD_LEFT);

        // Validate incoming data
        $validatedData = $request->validate([
            'transaction_date' => 'required|date',
            'reference' => 'nullable|string',
            'description' => 'nullable|string',
            'rows' => 'required|array',
            'rows.*.account' => 'required|string',
            'rows.*.debit' => 'nullable|numeric',
            'rows.*.credit' => 'nullable|numeric',
            'rows.*.row_description' => 'nullable|string',
            'rows.*.amount' => 'nullable|numeric',
        ]);

        // Create the journal entry with auto-generated journal_number
        $journalEntry = JournalEntry::create([
            'journal_number' => $newJournalNumber,
            'transaction_date' => $validatedData['transaction_date'],
            'reference' => $validatedData['reference'],
            'description' => $validatedData['description'],
        ]);

        // Save each row associated with this journal entry
        foreach ($validatedData['rows'] as $row) {
            $journalEntry->rows()->create($row);
        }

        return back()->with('Journal Entry created successfully');
    }

    public function create()
    {
        $lastJournal = JournalEntry::latest('id')->first();
        $nextId = optional($lastJournal)->id + 1;
        $nextJournalNumber = '#JUR' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        return Inertia::render('accounts/journal', compact('nextJournalNumber'));
    }
}
