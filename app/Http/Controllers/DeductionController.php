<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Deduction;
use Inertia\Inertia;

class DeductionController extends Controller
{
    // Render the single page for all operations
    public function index()
    {
        $deductions = Deduction::all();
        return Inertia::render('salary/deduction', [
            'deductions' => $deductions
        ]);
    }

    // Store a new deduction
    public function store(Request $request)
    {
        // Validation for title and amount
        $request->validate([
            'title' => 'required|string|max:255',  // Changed 'name' to 'title'
            'amount' => 'required|numeric|min:0',
        ]);

        // Create a new deduction record
        Deduction::create($request->only('title', 'amount'));  // Changed 'name' to 'title'

        return redirect()->back()->with('success', 'Deduction created successfully.');
    }

    // Update a deduction
    public function update(Request $request, $id)
    {
        $deduction = Deduction::findOrFail($id);  // Ensure the deduction exists

        // Validation for title and amount
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        // Update the deduction record
        $deduction->update($request->only('title', 'amount'));

        return redirect()->back()->with('success', 'Deduction updated successfully.');
    }

    // Delete a deduction
    public function destroy(Request $request, $id)
    {
        $deduction = Deduction::findOrFail($id);  // Ensure the deduction exists
        $deduction->delete();

        return redirect()->back()->with('success', 'Deduction deleted successfully.');
    }
}
