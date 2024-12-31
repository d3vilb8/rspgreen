<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use App\Models\LeaveManagement;
use App\Models\User;
use App\Notifications\LeaveNotif;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LeaveManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function leavType()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }

        $leaveTypes = LeaveType::join('users', 'users.id', '=', 'leave_types.employee_id')
            ->select('users.name', 'leave_types.days', 'leave_types.type_name', 'leave_types.id')
            ->get();
        $employees = User::where('id', '!=', 1)->get();

        $notif = Auth::user()->notifications;
        return Inertia::render('leave/leaveType', compact('leaveTypes', 'user', 'user_type', 'notif', 'employees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function leaveStore(Request $request)
    {
        $data = new LeaveType();
        $data->type_name = $request->type_name;
        $data->employee_id = $request->employee_id;
        $data->days = $request->days;
        $data->save();
        return redirect()->back()->with('success', 'Data saved successfully');
    }

    /**
     * Display the specified resource.
     */
    public function leaveUpdate(Request $request, $id)
    {
        $data =  LeaveType::find($id);
        $data->type_name = $request->type_name;
        $data->days = $request->days;
        $data->save();
        // dd($data);
        return redirect()->back()->with('success', 'Data Update successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function leaveDelete(Request $request, $id)


    {
        $data = LeaveType::find($id);
        $data->delete();
        return redirect()->back()->with('success', 'Data Delete successfully');
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function leave(Request $request, LeaveManagement $leaveManagement)
    {
        try {
            // Join tables and fetch leave data
            if (Auth::user()->hasRole('admin')) {
                $leave = LeaveManagement::join('users', 'users.id', '=', 'leave_management.employee_id')
                    ->join('leave_types', 'leave_types.id', '=', 'leave_management.leave_type_id')
                    ->select(
                        'users.name',
                        'leave_management.sdate',
                        'leave_management.reason',
                        'leave_management.remark',
                        'leave_management.edate',
                        'leave_management.status',
                        'leave_types.type_name',
                        'leave_management.created_at',
                        'leave_management.id',
                        'leave_management.is_unpaid',
                        // 'leave_management.document',
                    )
                    ->get();
            } else {
                $leave = LeaveManagement::join('users', 'users.id', '=', 'leave_management.employee_id')
                    ->join('leave_types', 'leave_types.id', '=', 'leave_management.leave_type_id')
                    ->select(
                        'users.name',
                        'leave_management.sdate',
                        'leave_management.reason',
                        'leave_management.remark',
                        'leave_management.edate',
                        'leave_management.status',
                        'leave_types.type_name',
                        'leave_management.created_at',
                        'leave_management.id',
                        'leave_management.is_unpaid',
                        // 'leave_management.document',
                    )->where('leave_management.employee_id', Auth::user()->id)
                    ->get();
            }


            // Fetch authenticated user and permissions
            $user = Auth::user()->name;
            $userss = Auth::user();
            $user_type = [];
            if ($userss) {
                // Ensure permissions are assigned and fetched correctly
                $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            }

            // Fetch notifications
            $notif = Auth::user()->notifications;

            // Return the Inertia view with data
            return Inertia::render('leave/index', compact('leave', 'user', 'user_type', 'notif'));
        } catch (\Exception $e) {
            // Log the error message
            Log::error('Error fetching leave data: ' . $e->getMessage());

            // Optionally, return an error response or view
            return Inertia::render('Error', [
                'message' => 'An error occurred while fetching leave data.'
            ]);
        }
    }


    public function show(Request $request, $id)
    {
        if (Auth::user()->hasRole('admin')) {
            // Fetch leave record for admin by ID
            $leave = LeaveManagement::join('users', 'users.id', '=', 'leave_management.employee_id')
                ->join('leave_types', 'leave_types.id', '=', 'leave_management.leave_type_id')
                ->select(
                    'users.name',
                    'leave_management.sdate',
                    'leave_management.reason',
                    'leave_management.remark',
                    'leave_management.edate',
                    'leave_management.status',
                    'leave_types.type_name',
                    'leave_management.created_at',
                    'leave_management.id',
                    'leave_management.is_unpaid',
                    'leave_management.documents',
                    'leave_management.admin_reject'
                )
                ->where('leave_management.id', $id) // Filter by the specific leave ID
                ->first();
        } else {
            // Fetch leave record for employee by ID and their ownership
            $leave = LeaveManagement::join('users', 'users.id', '=', 'leave_management.employee_id')
                ->join('leave_types', 'leave_types.id', '=', 'leave_management.leave_type_id')
                ->select(
                    'users.name',
                    'leave_management.sdate',
                    'leave_management.reason',
                    'leave_management.remark',
                    'leave_management.edate',
                    'leave_management.status',
                    'leave_types.type_name',
                    'leave_management.created_at',
                    'leave_management.id',
                    'leave_management.is_unpaid',
                    'leave_management.documents',
                    'leave_management.admin_reject'
                )
                ->where('leave_management.id', $id) // Filter by the specific leave ID
                ->where('leave_management.employee_id', Auth::user()->id) // Restrict to the logged-in employee
                ->first();
        }
    
        // Decode documents if stored as a string representing a JSON array
        if ($leave && $leave->documents) {
            // Decode the documents string into an array
            $leave->documents = json_decode($leave->documents, true); // 'true' converts it into an array
        }
    
        // Return the data to the frontend
        return Inertia::render('leave/show', compact('leave'));
    }
    



    /**
     * Remove the specified resource from storage.
     */
    public function leavecreate()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $empdataloyee = Employee::join('users', 'users.id', '=', 'employees.user_id')
            ->select('users.id', 'users.name')->where('type', 2)->get();
        $type = LeaveType::where('employee_id', Auth::user()->id)->get();
        $notif = Auth::user()->notifications;
        return Inertia::render('leave/create', compact('empdataloyee', 'type', 'user', 'user_type', 'notif'));
    }
    // public function leavestoredata(Request $request)
    // {

    //     $startDate = Carbon::parse($request->sdate)->startOfDay();
    //     $endDate = Carbon::parse($request->edate)->endOfDay();

    //     // Calculate the requested days
    //     $requestedDays = (int) $endDate->diffInDays($startDate) + 1;

    //     // Fetch the allowed days for the selected leave type
    //     $leaveType = LeaveType::find($request->leave_type_id);

    //     if (!$leaveType) {
    //         return redirect()->back()->withErrors(['message' => 'Invalid leave type.']);
    //     }

    //     // Fetch total leave days already taken by the employee for this leave type
    //     $existingLeaveDays = LeaveManagement::where('employee_id', Auth::user()->id)
    //         ->where('leave_type_id', $request->leave_type_id)
    //         ->sum(DB::raw('DATEDIFF(edate, sdate) + 1'));

    //     // Log to verify what is being calculated
    //     \Log::info('Requested Days: ' . $requestedDays);
    //     \Log::info('Existing Leave Days: ' . $existingLeaveDays);

    //     // Calculate total leave days including the current request
    //     $totalLeaveDays = $existingLeaveDays + $requestedDays;

    //     \Log::info('Total Leave Days: ' . $totalLeaveDays);
    //     \Log::info('Leave Limit: ' . $leaveType->days);

    //     // Determine if the leave request exceeds the allowed limit
    //     $exceedsLimit = $totalLeaveDays > $leaveType->days;

    //     // Redirect back with errors if the limit is exceeded and checkbox is not checked
    //     if ($exceedsLimit && !$request->checkbox_checked) {
    //         return redirect()->back()->withErrors(['message' => "The requested leave exceeds the allowed limit of {$leaveType->days} days for the leave type {$leaveType->type_name}. Please confirm by checking the checkbox."]);
    //     }

    //     // Save the leave request if validation passes
    //     $data = new LeaveManagement();
    //     $data->employee_id = Auth::user()->id;
    //     $data->leave_type_id = $request->leave_type_id;
    //     $data->sdate = $request->sdate;
    //     $data->edate = $request->edate;
    //     $data->reason = $request->reason;
    //     $data->remark = $request->remark;
    //     $data->status = 0;
    //     $data->checkbox_checked = $request->checkbox_checked;
    //     $data->save();

    //     return redirect('leave-index')->with('success', 'Leave request submitted successfully.');
    // }

    public function leavestoredata(Request $request)
    {
        $startDate = Carbon::parse($request->sdate)->startOfDay();
        $endDate = Carbon::parse($request->edate)->endOfDay();

        // Calculate the requested days
        $requestedDays = floor(abs($endDate->diffInDays($startDate))) + 1;
        // dd($requestedDays);

        // Fetch the leave type
        $leaveType = LeaveType::where('employee_id', Auth::user()->id)->find($request->leave_type_id);

        if (!$leaveType) {
            return redirect()->back()->withErrors(['message' => 'Invalid leave type.']);
        }

        // Fetch total leave days already taken by the employee for this leave type
        $existingLeaveDays = LeaveManagement::where('employee_id', Auth::user()->id)
            ->where('leave_type_id', $request->leave_type_id)
            ->sum(DB::raw('DATEDIFF(edate, sdate) + 1'));

        // Calculate total leave days including the current request
        $totalLeaveDays = $existingLeaveDays + $requestedDays;

        // Determine if the leave request exceeds the allowed limit
        $exceedsLimit = $totalLeaveDays > $leaveType->days;

        // Check if the selected leave type is "Unpaid"
        $isUnpaidLeaveType = strtolower($leaveType->type_name) === 'unpaid';

        // If the leave type is unpaid, skip the checkbox check and process it as unpaid leave
        if ($isUnpaidLeaveType) {
            $isUnpaidLeave = true;  // Automatically mark as unpaid
        } else {
            // Check if the unpaid leave checkbox is checked (for non-unpaid leave types)
            $isUnpaidLeave = $request->has('unpaid_checkbox');
        }

        // If the leave exceeds the allowed limit and is not unpaid, return an error
        if ($exceedsLimit && !$isUnpaidLeaveType && !$isUnpaidLeave) {
            return redirect()->back()->withErrors(['message' => "The requested leave exceeds the allowed limit of {$leaveType->days} days for the leave type {$leaveType->type_name}. If you want unpaid leave, please select Unpaid leave."]);
        }
        $uploadedFiles = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $filePath = $file->store('documents/leave_uploads', 'public'); // Store file
                $uploadedFiles[] = [
                    'original_name' => $file->getClientOriginalName(),
                    'file_path' => $filePath,
                ];
            }
        }
        // Save the leave request
        $data = new LeaveManagement();
        $data->employee_id = Auth::user()->id;
        $data->leave_type_id = $request->leave_type_id;
        $data->sdate = $request->sdate;
        $data->edate = $request->edate;
        $data->reason = $request->reason;
        $data->remark = $request->remark;
        $data->documents= json_encode($uploadedFiles);
        $data->status = 2; // Default status
        $data->is_unpaid = $request->is_unpaid; // Set unpaid leave flag
        $data->save();
        $leaveType->days = $leaveType->days - $requestedDays;
        $leaveType->save();

        // Prepare leave data for notification
        $leaveData = [
            'employee_id' => Auth::user()->name,
            'leave_type' => $leaveType->type_name,
            'sdate' => $request->sdate,
            'edate' => $request->edate,
            'reason' => $request->reason,
            'message' => $isUnpaidLeaveType ? "Unpaid Leave Request Sent" : "Leave Request Sent",
        ];

        // Send notification to admin
        $adminUser = User::where('type', '1')->first(); // Adjust this to fetch the correct admin user
        if ($adminUser) {
            $adminUser->notify(new LeaveNotif($leaveData));
        }

        return redirect('leave-index')->with('success', 'Leave request submitted successfully.');
    }



    public function leaveEdit($id)
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $empdataloyee = Employee::join('users', 'users.id', '=', 'employees.user_id')
            ->select('users.id', 'users.name')->where('type', 2)->get();
        $type = LeaveType::all();
        $leave = LeaveManagement::find($id);
        $notif = Auth::user()->notifications;
        return Inertia::render('leave/edit', compact('leave', 'empdataloyee', 'type', 'user', 'user_type', 'notif'));
    }
    public function leaveUpdatePost(Request $request, $id)
    {
       
        // Save the leave request
        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'sdate' => 'required|date',
            'edate' => 'required|date',
            'reason' => 'required|string',
            'remark' => 'nullable|string',
            'documents' => 'nullable|array',
            // 'documents.*' => 'file|mimes:jpg,png,pdf,docx|max:2048'  // Customize file types and max size
        ]);
    
        // Find the leave request by ID
        $data = LeaveManagement::find($id);
    
        // Check if the leave record exists
        if (!$data) {
            return redirect('leave-index')->withErrors('Leave request not found.');
        }
    
        // Handle file uploads if they exist
        $uploadedFiles = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                // Store the file and get the path
                $path = $document->store('documents', 'public'); // Save file to public disk
                $uploadedFiles[] = $path; // Add the file path to the array
            }
        }
    
        // Update the leave record
        $data->employee_id = Auth::user()->id;  // Use authenticated user's ID
        $data->leave_type_id = $request->leave_type_id;
        $data->sdate = $request->sdate;
        $data->edate = $request->edate;
        $data->reason = $request->reason;
        $data->remark = $request->remark;
        
        // Only save documents if they exist
        if (!empty($uploadedFiles)) {
            $data->documents = json_encode($uploadedFiles);  // Store file paths as JSON
        }
    
        $data->status = 2; // Default status (pending/approved, etc.)
        $data->is_unpaid = $request->is_unpaid; // Whether leave is unpaid or not
        $data->save(); // Save the updated data
        return redirect('leave-index');
    }
    public function leaveDeletes($id)
    {
        $leave = LeaveManagement::find($id);
        $leaveType = LeaveType::find($leave->leave_type_id);
        $requestedDays = floor(abs(Carbon::parse($leave->edate)->diffInDays(Carbon::parse($leave->sdate)))) + 1;

        $leave->delete();

        // Add back the deleted leave days to the leave type
        $leaveType->days = $leaveType->days + $requestedDays;
        $leaveType->save();

        return redirect('leave-index');
    }

    public function leaveStatusApprove(Request $request, $id)
    {
        $leave = LeaveManagement::find($id);

        // Update the leave status to approved (assuming 0 means approved)
        $leave->status = 0;
        $leave->save();

        // Log the status update
        Log::info('Leave status updated', ['id' => $id, 'status' => $leave->status]);

        // Fetch the user who requested the leave
        $user = User::find($leave->employee_id);  // Assuming `user_id` is the foreign key in `LeaveManagement`

        // Prepare the leave data for notification
        $leaveData = [
            'employee_id' => $user->name,
            'leave_type' => $leave->leave_type,
            'sdate' => $leave->start_date,
            'edate' => $leave->end_date,
            'reason' => $leave->reason,
            'message' => 'Your leave request has been rejected.',
        ];

        // Send the notification
        $user->notify(new LeaveNotif($leaveData));

        // Redirect back to the leave index page
        return redirect('leave-index');
    }

    public function leaveStatusReject(Request $request, $id)
    {
        // Find the leave request
        $leave = LeaveManagement::find($id);
        if (!$leave) {
            return redirect('leave-index')->with('error', 'Leave request not found.');
        }
    
        
        $leave->status = 1;
        $leave->admin_reject = $request->input('reason'); 
        $leave->save();
    
   
        $user = User::find($leave->employee_id);  
        if (!$user) {
            return redirect('leave-index')->with('error', 'Employee not found.');
        }
    
        // Prepare the leave data for notification
        $leaveData = [
            'employee_id' => $user->name,
            'leave_type' => $leave->leave_type,
            'sdate' => $leave->start_date,
            'edate' => $leave->end_date,
            'reason' => $leave->reason,
            'message' => 'Your leave request has been rejected. Reason: ' . $leave->admin_reject,
        ];
    
        // Send the notification
        $user->notify(new LeaveNotif($leaveData));
    
        return redirect('leave-index')->with('success', 'Leave request rejected and notification sent.');
    }
    
}
