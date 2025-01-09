<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Holiday;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\User;

class EmpolyeeSetupController extends Controller
{
    // Display the branches with employee counts
    public function index()
    {
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')
            ->get();
            $holiday = DB::table('locations_holiday')->get(); 
    //    dd($holiday);
        $branches = Branch::all()->map(function ($branch) {
            $branch->empCount = Employee::where('branch_id', $branch->id)->count();
            return $branch;
        });

        return Inertia::render('employee/employeesetup', [
            'branchesa' => $branches,
            'employees' => $employees,
            'holiday' =>$holiday
        ]);
    }

    // Create a new branch
    public function store(Request $request)

    {
        // dd($request->all());
  
        $request->validate([
            'b_name' => 'required|string|max:255', 
            'location_id' => 'required', 
        ]);
    
      
        Branch::create([
            'name' => $request->b_name,     
            'location_id' => $request->location_id,  
        ]);
    
        // Redirect back with a success message
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
            'employee_id' => 'required|exists:employees,user_id',
        ]);
    
        $targetBranchId = $request->input('transfer_to');
        $employeeId = $request->input('employee_id');
    
        $employee = Employee::where('user_id', $employeeId)->first();
    
        if (!$employee) {
            return response()->json(['error' => 'Employee not found.'], 400);
        }
    
        // Check if the employee is already in the target branch
        if ($employee->branch_id == $targetBranchId) {
            return response()->json(['error' => 'Employee is already in the target branch.'], 400);
        }
    
        // Update the branch_id for the selected employee
        $employee->update(['branch_id' => $targetBranchId]);
    
        return response()->json([
            'success' => 'Employee transferred successfully!',
            'employee' => $employee,
        ]);
    }
    

    
    
}




