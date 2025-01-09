<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Salary;
use App\Models\Deduction;
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
    
        // Add the combinedData section
        $combinedData = DB::table('branches')
            ->join('holidays', 'branches.id', '=', 'holidays.id') // Joining holidays with branches
            ->join('employees', 'employees.branch_id', '=', 'branches.id') // Joining employees with branches
            ->join('locations_holiday', 'branches.location_id', '=', 'locations_holiday.id') // Joining locations_holiday with branches
            ->join('users', 'employees.user_id', '=', 'users.id') // Joining users with employees
            ->join('leave_management', 'leave_management.employee_id', '=', 'employees.user_id') // Joining leave_management with employees
            ->select(
                'holidays.name as holiday_name', 
                'holidays.start_date as holiday_start_date',
                'holidays.end_date as holiday_end_date',
                'branches.*', 
                'locations_holiday.name as location_holiday_name', 
                'employees.*', 
                'users.name as employee_name',
                'employees.basic_salary',
                'leave_management.sdate as leave_start_date', 
                'leave_management.edate as leave_end_date'
            )
            ->get();
    
        // Process each record to add calculations
        $combinedData = $combinedData->map(function ($item) {
            $leaveStart = Carbon::parse($item->leave_start_date);
            $leaveEnd = Carbon::parse($item->leave_end_date);
            $holidayStart = Carbon::parse($item->holiday_start_date);
            $holidayEnd = Carbon::parse($item->holiday_end_date);
    
            // Calculate total holiday days
            $item->total_holiday_days = $holidayStart->diffInDays($holidayEnd) + 1;
    
            // Calculate overlapping leave and holiday days
            $overlapStart = $leaveStart->max($holidayStart);
            $overlapEnd = $leaveEnd->min($holidayEnd);
            $item->overlapping_days = $overlapStart <= $overlapEnd 
                ? $overlapStart->diffInDays($overlapEnd) + 1 
                : 0;
    
            // Adjust leave days by excluding weekends if applicable
            $totalLeaveDays = $leaveStart->diffInDays($leaveEnd) + 1;
            $weekendDays = ($leaveStart->isFriday() && $leaveEnd->isMonday())
                ? $leaveStart->diffInDaysFiltered(function ($date) {
                    return $date->isSaturday() || $date->isSunday();
                }, $leaveEnd) 
                : 0;
    
            $adjustedLeaveDays = $totalLeaveDays - $weekendDays;
    
            // Salary deduction calculations
            $salaryDeductionDays = $adjustedLeaveDays >= 3 ? $adjustedLeaveDays : 0;
            $perDaySalary = $item->basic_salary / 30;
            $salaryDeductionAmount = $perDaySalary * $salaryDeductionDays;
    
            // Add calculated values
            $item->adjusted_leave_days = $adjustedLeaveDays;
            $item->salary_deduction_days = $salaryDeductionDays;
            $item->per_day_salary = round($perDaySalary, 2);
            $item->salary_deduction_amount = round($salaryDeductionAmount, 2);
    
            return $item;
        });
    
        // Get attendance records (assumed that the late status is determined from out_time being after a certain threshold, like 9 AM)
        $attendanceRecords = Attendance::select('employee_id', 'date', 'in_time', 'out_time')
            ->whereMonth('date', '=', now()->month)
            ->get();
    
        $deductionsss = Deduction::all();
    
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
        return Inertia::render('salary/salaryAll', compact('salary', 'employees', 'deductionsss', 'combinedData'));
    }
    
    
    
    
}
