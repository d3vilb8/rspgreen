<?php

namespace App\Http\Controllers;

use App\Models\Title;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TitleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $titles = Title::all();

        // Returning an Inertia response to the 'Titles/Index' page
        return Inertia::render('salary/title', [
            'titles' => $titles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Returning an Inertia response to the 'Titles/Create' page
        return Inertia::render('salary/title');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Title::create($validated);

        return redirect()->route('salary/title')->with('success', 'Title created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $title = Title::findOrFail($id);

        // Returning an Inertia response to the 'Titles/Show' page
        return Inertia::render('salary/title', [
            'title' => $title,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $title = Title::findOrFail($id);

        // Returning an Inertia response to the 'Titles/Edit' page
        return Inertia::render('salary/title', [
            'title' => $title,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $title = Title::findOrFail($id);
        $title->update($validated);

        return redirect()->route('salary/title')->with('success', 'Title updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $title = Title::findOrFail($id);
        $title->delete();

        return redirect()->route('salary/title')->with('success', 'Title deleted successfully.');
    }
}
