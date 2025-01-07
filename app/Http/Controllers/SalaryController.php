<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Salary;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Employee; // Assuming Employee model is defined

class SalaryController extends Controller
{

    public function index()
    {
        $salary = Salary::select(
            'salary_name',
            DB::raw('MAX(generate_date) as generate_date'),
            DB::raw('MAX(generate_by) as generate_by'),
            DB::raw('MAX(status) as status'),
            DB::raw('MAX(approved_date) as approved_date'),
            DB::raw('MAX(approved_by) as approved_by')
        )
            ->groupBy('salary_name')
            ->get();
            // dd($salary);
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')
            ->get();
        // dd($employees);

        return Inertia::render('salary/salary', compact('salary', 'employees'));
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
    public function show()
    {
        // Retrieve individual salary records
        $salary = Salary::select(
            'id', // Add 'id' for updates
            'employee_id', // Add 'employee_id' to link salaries with employees
            'salary_name',
            'generate_date',
            'generate_by',
            'status',
            'approved_date',
            'approved_by',
            'total_amount',
            'allowance' // Include allowance in the select query
        )->get();
    
        // Get employee data
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')
            ->get();
    
        // Get attendance records (assumed that the late status is determined from out_time being after a certain threshold, like 9 AM)
        $attendanceRecords = Attendance::select('employee_id', 'date', 'in_time', 'out_time')
            ->whereMonth('date', '=', now()->month)
            ->get();
    
        // Calculate late days for each employee
        $lateCount = [];
        foreach ($attendanceRecords as $attendance) {
            // Assuming the time format is 'HH:MM:SS' and you want to count if the employee is late after 9 AM
            $lateThreshold = '09:00:00';
            if (strtotime($attendance->in_time) > strtotime($lateThreshold)) {
                if (!isset($lateCount[$attendance->employee_id])) {
                    $lateCount[$attendance->employee_id] = 0;
                }
                $lateCount[$attendance->employee_id]++;
            }
        }
    
        foreach ($salary as $sal) {
            $basicSalary = $sal->total_amount; // Assuming total_amount is the basic salary
    
            // Calculate DA (Dearness Allowance)
            $allowance = $basicSalary * 0.20; // DA is 20% of basic salary
            $sal->allowance = $allowance;
    
            // Deduction for late days
            $deduction = 0;
            if (isset($lateCount[$sal->employee_id]) && $lateCount[$sal->employee_id] >= 3) {
                // Apply deduction (e.g., 1 day's salary deduction)
                $daysInMonth = now()->daysInMonth;
                $perDaySalary = $basicSalary / $daysInMonth;
                $deduction = $perDaySalary;
            }
    
            // Update the total salary amount after applying deductions
            $sal->total_amount = $basicSalary - $deduction;
    
            // Save the updated salary with allowance and total amount
            $sal->save();
        }
    
        // Render the data in the view
        return Inertia::render('salary/salaryAll', compact('salary', 'employees'));
    }
    
    
    
}
