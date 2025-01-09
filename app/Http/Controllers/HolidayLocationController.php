<?php
// app/Http/Controllers/HolidayLocationController.php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Holiday;
use App\Models\Employee;
use App\Models\locationList;
use Illuminate\Http\Request;
use App\Models\location_list;
use App\Models\LeaveManagement;

class HolidayLocationController extends Controller
{
    // Index method to display the list of vacations
    public function index()
    {
        // Fetch the list of vacations from the database
        $vacations = DB::table('locations_holiday')->pluck('name');
    
        // Fetch combined data
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
            $item->total_holiday_days = $holidayStart->diffInDays($holidayEnd) + 1; // Inclusive
    
            // Calculate overlapping days
            $overlapStart = $leaveStart->max($holidayStart); // Later of the two start dates
            $overlapEnd = $leaveEnd->min($holidayEnd); // Earlier of the two end dates
            if ($overlapStart <= $overlapEnd) {
                $item->overlapping_days = $overlapStart->diffInDays($overlapEnd) + 1;
            } else {
                $item->overlapping_days = 0; // No overlap
            }
    
            // Exclude weekends if leave includes Friday and Monday
            $totalLeaveDays = $leaveStart->diffInDays($leaveEnd) + 1; // Total leave days
            $weekendDays = 0;
    
            // Check for Friday and Monday leave pattern
            if ($leaveStart->isFriday() && $leaveEnd->isMonday()) {
                for ($date = $leaveStart->copy(); $date <= $leaveEnd; $date->addDay()) {
                    if ($date->isSaturday() || $date->isSunday()) {
                        $weekendDays++;
                    }
                }
            }
    
            // Subtract weekend days if applicable
            $adjustedLeaveDays = $totalLeaveDays - $weekendDays;
    
            // Calculate salary deduction
            $salaryDeductionDays = 0;
            if ($adjustedLeaveDays >= 3) {
                $salaryDeductionDays = $adjustedLeaveDays; // Deduct full leave days if 3 or more
            }
    
            // Calculate per-day salary and total deduction
            $perDaySalary = $item->basic_salary / 30; // Assuming 30 days in a month
            $salaryDeductionAmount = $perDaySalary * $salaryDeductionDays;
    
            // Add calculated values to the record
            $item->adjusted_leave_days = $adjustedLeaveDays;
            $item->salary_deduction_days = $salaryDeductionDays;
            $item->per_day_salary = round($perDaySalary, 2); // Rounded to 2 decimal places
            $item->salary_deduction_amount = round($salaryDeductionAmount, 2); // Rounded to 2 decimal places
    
            return $item;
        });
    
        // Debugging output
        // dd($combinedData);
    
        // Return the 'location/holidayList' Inertia page with the fetched vacations
        return Inertia::render('location/holidayList', [
            'vacations' => $vacations,
        ]);
    }
    

    // Show method to display a specific vacation location
    public function show($id)
    {
        // Fetch the vacation by ID
        $vacation = DB::table('locations_holiday')->find($id);

        // If the vacation doesn't exist, abort with 404
        if (!$vacation) {
            abort(404);
        }

        // Return the specific vacation location view
        return Inertia::render('HolidayLocation/Show', [
            'vacation' => $vacation->name
        ]);
    }

    // Update method to handle editing a vacation location
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Update the vacation location in the database
        DB::table('locations_holiday')
            ->where('id', $id)
            ->update([
                'name' => $validated['name'],
            ]);

        // Redirect back to the vacation locations list
        return redirect()->route('holiday-locationswise.index');
    }

    // Destroy method to handle deleting a vacation location
    public function destroy($id)
    {
        // Delete the vacation location from the database
        DB::table('locations_holiday')->where('id', $id)->delete();

        // Redirect back to the vacation locations list
        return redirect()->route('holiday-locationswise.index');
    }
}
