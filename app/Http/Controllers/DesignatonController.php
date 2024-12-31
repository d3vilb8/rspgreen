<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignatonController extends Controller
{
    public function index()
    {
        $designations = Designation::all();
        return Inertia::render('employee/designation', [
            'designations' => $designations,
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Designations/Create');
    }

    // Store new designation
    public function store(Request $request)
    {
        $request->validate([
            'ds_name' => 'required|string|max:255|unique:designations,name',
        ]);

        Designation::create([
            'name'=>$request->ds_name
        ]);
        return back()->with('success', 'Designation created successfully.');
    }

    // Show edit form
    public function edit(Designation $designation)
    {
        return Inertia::render('Designations/Edit', [
            'designation' => $designation,
        ]);
    }

    // Update designation
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        // $request->validate([
        //     'ds_name' => 'required|string|max:255|unique:designations,ds_name,' . $id,
        // ]);
    
        // Find the designation by ID
        $designation = Designation::findOrFail($id);
    
        // Update the designation
        $designation->update([
            'name' => $request->input('ds_name'),
        ]);
    
        return back();
    }
    
    

    // Delete designation
    public function destroy(Designation $designation)
    {
        $designation->delete();
        return redirect()->route('designations.index')->with('success', 'Designation deleted successfully.');
    }
}
