<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::all();
        return Inertia::render('employee/document', [
            'documents' => $documents,
        ]);
    }

    // Show the form to create a new document
    public function create()
    {
        return Inertia::render('Documents/Create');
    }

    // Store a new document in the database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Document::create($request->all());

        return redirect()->route('documents.index')->with('success', 'Document created successfully.');
    }

    // Show the form to edit an existing document
    public function edit(Document $document)
    {
        return Inertia::render('Documents/Edit', [
            'document' => $document,
        ]);
    }

    // Update an existing document in the database
    public function update(Request $request, Document $document)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $document->update($request->all());

        return redirect()->route('documents.index')->with('success', 'Document updated successfully.');
    }

    // Delete a document from the database
    public function destroy(Document $document)
    {
        $document->delete();

        return redirect()->route('documents.index')->with('success', 'Document deleted successfully.');
    }
}
