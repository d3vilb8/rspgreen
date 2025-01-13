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
use App\Models\Employee;

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

        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id', 'employees.basic_salary')
            ->get();

        return Inertia::render('salary/salary', compact('salary', 'employees'));
    }

    public function generateForAll(Request $request)
    {
        $request->validate([
            'salary_month' => 'required|date_format:Y-m',
        ]);

        $employees = Employee::all();

        foreach ($employees as $employee) {
            Salary::create([
                'employee_id' => $employee->id,
                'salary_name' => $request->salary_month,
                'generate_date' => now(),
                'generate_by' => auth()->user()->name,
                'status' => 'Pending',
                'approved_date' => now(),
                'approved_by' => auth()->user()->name,
                'total_amount' => $employee->basic_salary, // Use basic salary from employees table
            ]);
        }

        return back();
    }
    public function show()
    {
        // Fetch salary details
        $salary = Salary::select(
            'id',
            'employee_id',
            'salary_name',
            'generate_date',
            'generate_by',
            'status',
            'approved_date',
            'approved_by',
            'total_amount',
            'allowance'
        )->get();
    
        // Fetch employees and their basic salary
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id', 'employees.basic_salary')
            ->get();
    
        // Fetch combined data for employees, attendance, leave, and holidays
        $combinedData = DB::table('branches')
            ->join('holidays', 'branches.id', '=', 'holidays.id')
            ->join('employees', 'employees.branch_id', '=', 'branches.id')
            ->join('locations_holiday', 'branches.location_id', '=', 'locations_holiday.id')
            ->join('users', 'employees.user_id', '=', 'users.id')
            ->join('leave_management', 'leave_management.employee_id', '=', 'employees.user_id')
            ->leftJoin('attendances', 'attendances.employee_id', '=', 'users.id') // Join attendances
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
                'leave_management.edate as leave_end_date',
                DB::raw('COALESCE(SUM(TIME_TO_SEC(attendances.total_time)) / 3600, 0) as total_time'),
                DB::raw('COUNT(attendances.id) as total_working_days'), // Total working days
                DB::raw('SUM(CASE WHEN TIME_TO_SEC(attendances.total_time) / 3600 < 9 THEN 1 ELSE 0 END) as late_days') // Late days count
            )
            ->groupBy(
                'employees.id',
                'holidays.id',
                'branches.id',
                'locations_holiday.id',
                'users.id',
                'leave_management.id'
            )
            ->get();
    
        // Process the combined data to calculate adjusted leave days, late deductions, and salary adjustments
        $combinedData = $combinedData->map(function ($item) {
            $leaveStart = Carbon::parse($item->leave_start_date);
            $leaveEnd = Carbon::parse($item->leave_end_date);
            $holidayStart = Carbon::parse($item->holiday_start_date);
            $holidayEnd = Carbon::parse($item->holiday_end_date);
        
            // Calculate total leave days (inclusive)
            $totalLeaveDays = $leaveStart->diffInDays($leaveEnd) + 1;
        
            // Adjust for holidays within the leave period
            $overlapStart = $leaveStart->max($holidayStart);
            $overlapEnd = $leaveEnd->min($holidayEnd);
            $holidayInLeavePeriod = $overlapStart <= $overlapEnd ? $overlapStart->diffInDays($overlapEnd) + 1 : 0;
        
            // If holiday is within the leave period, count it only once
            $adjustedLeaveDays = $totalLeaveDays;
        
            // Don't add an extra day if the holiday is on the same date as the leave's start or end
            if ($holidayStart->between($leaveStart, $leaveEnd) || $holidayEnd->between($leaveStart, $leaveEnd)) {
                // Only add the holiday day if it falls within the leave period
                $adjustedLeaveDays = $totalLeaveDays;
            }
        
            $perDaySalary = $item->basic_salary / 30; // Assuming 30 days in a month
            $leaveDeductionAmount = $perDaySalary * $adjustedLeaveDays;
        
            // Calculate late day deduction (1 day's salary for every 3 late days)
            $lateDeductionDays = intdiv($item->late_days, 3);
            $lateDeductionAmount = $perDaySalary * $lateDeductionDays;
        
            // Add calculated fields to the item
            $item->adjusted_leave_days = $adjustedLeaveDays;
            $item->leave_deduction_amount = round($leaveDeductionAmount, 2);
            $item->late_deduction_days = $lateDeductionDays;
            $item->late_deduction_amount = round($lateDeductionAmount, 2);
        
            return $item;
        });
        
    
        // Fetch all deductions
        $deductions = Deduction::all();
    
        // Update each salary record based on deductions and allowances
        foreach ($salary as $sal) {
            $basicSalary = $sal->total_amount;
    
            // Calculate allowance (20% of basic salary)
            $allowance = $basicSalary * 0.20;
            $sal->allowance = $allowance;
    
            // Fetch individual employee data for deductions
            $employeeData = $combinedData->firstWhere('employee_id', $sal->employee_id);
    
            $leaveDeduction = $employeeData->leave_deduction_amount ?? 0;
            $lateDeduction = $employeeData->late_deduction_amount ?? 0;
    
            // Update the total salary after deductions
            $updatedSalary = $basicSalary - $leaveDeduction - $lateDeduction;
    
            // Save updated salary in the database
            $sal->total_amount = $updatedSalary;
            $sal->save();
    
            // Update basic salary in the employees table
            Employee::where('id', $sal->employee_id)->update(['basic_salary' => $updatedSalary]);
        }
    
        // Return the view with processed data
        return Inertia::render('salary/salaryAll', compact('salary', 'employees', 'deductions', 'combinedData'));
    }
    
    

  

    // Method to save additional deductions
    public function saveSalaryData(Request $request)
    {
        $request->validate([
            'salaryData' => 'required|array',
        ]);

        foreach ($request->salaryData as $salary) {
            // Find the salary record by employee ID
            $salaryRecord = Salary::where('employee_id', $salary['employee_id'])->first();
            
            if ($salaryRecord) {
                // Update the additional deduction
                $salaryRecord->additional_deduction = $salary['additional_deduction	'];
                $salaryRecord->total_amount += $salary['additional_deduction']; // Update total amount with additional deduction
                $salaryRecord->save();
            }
        }

        return response()->json(['message' => 'Salary data saved successfully']);
    }
}
