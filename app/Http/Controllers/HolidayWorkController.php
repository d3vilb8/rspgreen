<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Holiday;
use Illuminate\Http\Request;
use App\Models\holidayAssign;
use Illuminate\Support\Facades\Auth;
use App\Notifications\HolidayAssignedNotification;

class HolidayWorkController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'holiday_id' => 'required|exists:holidays,id',
        ]);

        // Create the holiday assignment
        $holidayAssignment = holidayAssign::create($validated);

        // Fetch the employee who is assigned the holiday
        $employee = User::find($validated['employee_id']);

        // Prepare the data for notification
        $notificationData = [
            'employee_id' => $employee->name,
            'holiday_id' => $holidayAssignment->holiday_id,
        ];

        // Define the custom message
        $customMessage = 'You have been assigned a holiday.';

        // Send the notification to the employee
        $employee->notify(new HolidayAssignedNotification($notificationData, $customMessage));

        // Redirect back with success message
        return back()->with('success', 'Holiday assigned and notification sent.');
    }


    public function update(Request $request, $id)
    {
        $assignment = holidayAssign::findOrFail($id);
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'holiday_id' => 'required|exists:holidays,id',
        ]);

        $assignment->update($validated);

        return response()->json(['success' => 'Holiday work updated successfully.']);
    }

    public function destroy($id)
    {
        $assignment = holidayAssign::findOrFail($id);
        $assignment->delete();


        return back();
    }

    public function HolidayAssign()
    {

        $holiday = holidayAssign::join('holidays', 'holidays.id', 'holiday_assigns.holiday_id')
            ->join('users', 'users.id', 'holiday_assigns.employee_id')->select('holidays.name', 'users.name as uname')
            ->where('holiday_assigns.employee_id', Auth::user()->id)->get();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('holiday/holidayassign', compact('holiday', 'user', 'userss', 'user_type', 'notif'));
    }
    public function holidayLocation()
    {
        return Inertia::render('location/index'); 
    }
}
