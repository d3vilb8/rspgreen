<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmpolyeeSetupController extends Controller
{
    public function index()
    {
        $branches = Branch::all();
        //seach the employee total count

        $branches = $branches->map(function ($branch) {
            $branch->empCount = Employee::where('branch_id', $branch->id)->count();
            return $branch;
        });
        // dd($searchEmpCount);



        return Inertia::render('employee/employeesetup', [
            'branchesa' => $branches,

        ]);
    }


    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate(['b_name' => 'required|string|max:255']);
        Branch::create([
            'name' => $request->b_name
        ]);
        return back()->with('success', 'Branch created successfully!');
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        // dd($branch);
        // $request->validate(['b_name' => 'required|string|max:255']);
        $branch->update(['name' => $request->input('b_name'),]);
        return redirect()->back()->with('success', 'Branch updated successfully!');
    }

    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return redirect()->back()->with('success', 'Branch deleted successfully!');
    }

    public function transfer($id)
    {

        $branches = Branch::all();


        foreach ($branches as $branch) {

            $empCount = Employee::where('branch_id', $branch->id)->get();
            // dd($empCount);
  

            $branch->empCount = $empCount;


            if ($branch->id == $id && $empCount == 0) {
                return redirect()->back()->with('error', 'No employees found in this branch.');
            }
        }


        return redirect()->back()->with('success', 'Branch Transfer successfully!');
    }
}
