<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;

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


    public function transferEmployees(Request $request, $branchId)
    {
        $request->validate([
            'transfer_to' => 'required|exists:branches,id',
            'quantity' => 'required',
        ]);
    
        $targetBranchId = $request->input('transfer_to');
        $quantity = $request->input('quantity'); 
    
       
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')  
            ->where('employees.branch_id', $branchId)
            ->limit($quantity)
            ->get();
            // dd($employees);
    
        if ($employees->isEmpty()) {
            return response()->json([
                'error' => 'Not enough employees to transfer.'
            ], 400); 
        }
    
       
        foreach ($employees as $employee) {
            Employee::where('user_id', $employee->id)  
                ->update(['branch_id' => $targetBranchId]);
        }
    
        return response()->json([
            'success' => 'Employees transferred successfully!',
            'employees' => $employees  
        ]);
    }
    
}