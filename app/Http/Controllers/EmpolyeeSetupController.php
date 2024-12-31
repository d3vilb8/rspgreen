<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpolyeeSetupController extends Controller
{
    public function index()
    {
        $branches = Branch::all();
        return Inertia::render('employee/employeesetup', ['branchesa' => $branches]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate(['b_name' => 'required|string|max:255']);
        Branch::create([
            'name'=>$request->b_name
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
}
