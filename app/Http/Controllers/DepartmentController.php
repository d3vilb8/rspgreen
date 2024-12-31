<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    // Show all departments
    public function index()
    {
        $departments = Department::all();
        return Inertia::render('employee/department', compact('departments'));
    }

    // Show create form
    public function create()
    {
        return view('departments.create');
    }

    // Store new department
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'd_name' => 'required|string|max:255|unique:departments,name',
        ]);

        Department::create(
            ['name' =>$request->d_name]
        );
        return back()->with('success', 'Department created successfully.');
    }

    // Show edit form
    public function edit(Department $department)
    {
        return view('departments.edit', compact('department'));
    }

    // Update department
    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        // $request->validate([
        //     'd_name' => 'required|string|max:255|unique:departments,name,' . $id,
        // ]);
    
        // Find the department by ID
        $department = Department::findOrFail($id);
    
        // Update the department with the request data
        $department->update([
            'name' => $request->input('d_name'),
        ]);
    
        // Redirect with a success message
        return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    }
    

    // Delete department
    public function destroy(Department $department)
    {
        $department->delete();
        return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
    }
}
