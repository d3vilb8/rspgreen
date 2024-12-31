<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
  use App\Models\Employee; // Assuming Employee model is defined
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalaryController extends Controller
{

public function index()
{
    $salary = Salary::select('salary_name', 
                               DB::raw('MAX(generate_date) as generate_date'),
                               DB::raw('MAX(generate_by) as generate_by'),
                               DB::raw('MAX(status) as status'),
                               DB::raw('MAX(approved_date) as approved_date'),
                               DB::raw('MAX(approved_by) as approved_by'))
                      ->groupBy('salary_name')
                      ->get();

    return Inertia::render('salary/salary', compact('salary'));
}



 

public function generateForAll(Request $request)
{
    // dd($request->all());
    $request->validate([
        'salary_month' => 'required|date_format:Y-m',
    ]);

    $employees = Employee::all(); // Get all employees

    foreach ($employees as $employee) {
        Salary::create([
            'employee_id' => $employee->id,
            'salary_name' => $request->salary_month,
            'generate_date' => now(),
            'generate_by' => auth()->user()->name, // Assuming authenticated user is generating
            'status' => 'Pending',  // This could be dynamic based on approval flow
            'approved_date' => now(),
            'approved_by' => auth()->user()->name,
        ]);
    }

    return back();
}

}
