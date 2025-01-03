<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmpolyeeSetupController extends Controller
{
    // Display the branches with employee counts
    public function index()
    {
        $branches = Branch::all()->map(function ($branch) {
            $branch->empCount = Employee::where('branch_id', $branch->id)->count();
            return $branch;
        });

        return Inertia::render('employee/employeesetup', [
            'branchesa' => $branches,
        ]);
    }

    // Create a new branch
    public function store(Request $request)
    {
        $request->validate(['b_name' => 'required|string|max:255']);
        Branch::create(['name' => $request->b_name]);

        return back()->with('success', 'Branch created successfully!');
    }

    // Update branch details
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        $request->validate(['b_name' => 'required|string|max:255']);
        $branch->update(['name' => $request->input('b_name')]);

        return redirect()->back()->with('success', 'Branch updated successfully!');
    }

    // Delete a branch and optionally transfer employees
    public function destroy(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        $employeeCount = Employee::where('branch_id', $id)->count();

        if ($employeeCount > 0) {
            $request->validate(['transfer_to' => 'required|exists:branches,id']);
            $targetBranchId = $request->input('transfer_to');

            // Transfer employees to the target branch
            Employee::where('branch_id', $id)->update(['branch_id' => $targetBranchId]);
        }

        $branch->delete();

        return response()->json(['message' => 'Branch deleted successfully!']);
    }

    // Transfer employees between branches
    public function transferEmployees(Request $request, $branchId)
    {
        $request->validate([
            'transfer_to' => 'required|exists:branches,id',
            'quantity' => 'required', 
        ]);
    
        $targetBranchId = $request->input('transfer_to');
        $quantity = $request->input('quantity'); 
    
       
        $employees = Employee::where('branch_id', $branchId)->limit($quantity)->get();
    
        if ($employees->isEmpty()) {
            return redirect()->back()->with('error', 'Not enough employees to transfer.');
        }
    
        // Update the branch_id for the selected employees
        foreach ($employees as $employee) {
            $employee->update(['branch_id' => $targetBranchId]);
        }
    
        return redirect()->back()->with('success', 'Employees transferred successfully!');
    }
    
}
