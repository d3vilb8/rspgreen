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

        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id', 'employees.basic_salary')
            ->get();

        $combinedData = DB::table('branches')
            ->join('holidays', 'branches.id', '=', 'holidays.id')
            ->join('employees', 'employees.branch_id', '=', 'branches.id')
            ->join('locations_holiday', 'branches.location_id', '=', 'locations_holiday.id')
            ->join('users', 'employees.user_id', '=', 'users.id')
            ->join('leave_management', 'leave_management.employee_id', '=', 'employees.user_id')
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

        $combinedData = $combinedData->map(function ($item) {
            $leaveStart = Carbon::parse($item->leave_start_date);
            $leaveEnd = Carbon::parse($item->leave_end_date);
            $holidayStart = Carbon::parse($item->holiday_start_date);
            $holidayEnd = Carbon::parse($item->holiday_end_date);

            $item->total_holiday_days = $holidayStart->diffInDays($holidayEnd) + 1;

            $overlapStart = $leaveStart->max($holidayStart);
            $overlapEnd = $leaveEnd->min($holidayEnd);
            $item->overlapping_days = $overlapStart <= $overlapEnd 
                ? $overlapStart->diffInDays($overlapEnd) + 1 
                : 0;

            $totalLeaveDays = $leaveStart->diffInDays($leaveEnd) + 1;
            $weekendDays = $leaveStart->diffInDaysFiltered(fn($date) => $date->isWeekend(), $leaveEnd);

            $adjustedLeaveDays = $totalLeaveDays - $weekendDays;

            $salaryDeductionDays = $adjustedLeaveDays >= 3 ? $adjustedLeaveDays : 0;
            $perDaySalary = $item->basic_salary / 30;
            $salaryDeductionAmount = $perDaySalary * $salaryDeductionDays;

            $item->adjusted_leave_days = $adjustedLeaveDays;
            $item->salary_deduction_days = $salaryDeductionDays;
            $item->per_day_salary = round($perDaySalary, 2);
            $item->salary_deduction_amount = round($salaryDeductionAmount, 2);

            return $item;

        });
        // dd($combinedData);

        $attendanceRecords = Attendance::select('employee_id', 'date', 'in_time', 'out_time')
            ->whereMonth('date', '=', now()->month)
            ->get();

        $deductions = Deduction::all();

        foreach ($salary as $sal) {
            $basicSalary = $sal->total_amount;

            $allowance = $basicSalary * 0.20;
            $sal->allowance = $allowance;

            $deduction = 0;

            if (isset($lateCount[$sal->employee_id]) && $lateCount[$sal->employee_id] >= 3) {
                $perDaySalary = $basicSalary / now()->daysInMonth;
                $deduction = $perDaySalary;
            }

            $updatedSalary = $basicSalary - $deduction;

            $sal->total_amount = $updatedSalary;
            $sal->save();

            // Update basic salary in the employees table
            Employee::where('id', $sal->employee_id)->update(['basic_salary' => $updatedSalary]);
        }

        return Inertia::render('salary/salaryAll', compact('salary', 'employees', 'deductions', 'combinedData'));
    }
}
