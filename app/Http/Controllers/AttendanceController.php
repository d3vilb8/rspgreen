<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Attendace;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')->get();
            // dd($employees);
        $attendances = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->join('attendances', 'attendances.employee_id', '=', 'users.id')
            ->select('users.name', 'attendances.id', 'attendances.date', 'attendances.in_time', 'attendances.out_time')->get();
        return Inertia::render('attendance/index', compact('user', 'userss', 'user_type', 'employees', 'attendances'));
    }

    public function create()
    {
        $employees = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name', 'users.id')->get();
        return Inertia::render('attendance/create', [
            'employees' => $employees,
        ]);
    }

    // Store a new attendance record
    public function store(Request $request)
    {
        // Validate the request if needed
        // $request->validate([
        //     'employee_id' => 'required|exists:employees,id',
        //     'date' => 'required|date',
        //     'in_time' => 'nullable|date_format:H:i',
        //     'out_time' => 'nullable|date_format:H:i|after:in_time',
        // ]);
        
        // Create the attendance record
        $attendance = Attendance::create($request->all());
        
        // Get the in_time and out_time from the created record
        $inTime = Carbon::createFromFormat('H:i', $attendance->in_time);
        $outTime = Carbon::createFromFormat('H:i', $attendance->out_time);
        
        // Calculate the difference between out_time and in_time
        $totalTime = $outTime->diff($inTime);
        
        // Format the total time difference as hours and minutes
        $totalTimeFormatted = $totalTime->format('%H:%I'); // Example: "10:59" hours and minutes
    
        // Update the attendance record with the calculated total time worked
        $attendance->total_time = $totalTimeFormatted; // Save to the total_time field
        $attendance->save();
        
        // Dump the attendance record and the total time worked (for debugging)
        // dd($attendance, 'Total Time Worked: ' . $totalTimeFormatted);
        
        return redirect()->route('attendances.index')->with('success', 'Attendance recorded successfully.');
    }
    public function show($id){
        $attd = Attendance::findOrFail($id);
        return \response()->json($attd);
    }

    // Show the form to edit an existing attendance record
    public function edit(Attendance $attendance)
    {
        $employees = Employee::all();
        return Inertia::render('Attendances/Edit', [
            'attendance' => $attendance,
            'employees' => $employees,
        ]);
    }

    // Update an existing attendance record
    public function update(Request $request, $attendance)
    {
        // $request->validate([
        //     'employee_id' => 'required',
        //     'date' => 'required|date',
        //     'in_time' => 'nullable|date_format:H:i',
        //     'out_time' => 'nullable|date_format:H:i|after:in_time',
        // ]);

        Attendance::findOrFail($attendance)->update($request->all());

        return redirect()->route('attendances.index');
    }

    // Delete an attendance record
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->route('attendances.index')->with('success', 'Attendance deleted successfully.');
    }
}
