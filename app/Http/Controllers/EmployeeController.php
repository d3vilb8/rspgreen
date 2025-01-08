<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use ZipArchive;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Entry;
use App\Models\Holiday;
use App\Models\Employee;
use App\Models\Timesheet;
use App\Models\Screenshot;
use Illuminate\Http\Request;
use App\Models\holidayAssign;
use App\Models\LeaveManagement;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Notifications\TimesheetUnlockedNotification;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EmployeeController extends Controller
{
    public function index()
    {
        $user = Auth::user()->name;
        // $employee = User::with('employees')->where('type', 2)->get();
        $users = User::role('Employee')->with(['employees', 'roles'])->get();
        // dd($users);// Returns only users with the role 'writer'
        $employee = User::with(['employees', 'roles'])->where('type', 2)->get();




        $user = Auth::user()->name;
        // $user_type = Auth::user()->id;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('employee/Employee', compact('user', 'employee', 'user', 'user_type', 'notif'));
    }

    public function create()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $roles = Role::all();
        $notif = Auth::user()->notifications;
        $branches = Branch::all();
        $department = Department::all();
        $designation = Designation::all();
        return Inertia::render('employee/create', compact('user', 'user_type', 'roles', 'notif', 'branches', 'department', 'designation'));
    }
    protected function generateEmployeeId()
    {
        // Retrieve the latest employee based on the ID
        $latestEmployee = Employee::orderBy('id', 'desc')->first();

        if ($latestEmployee) {
            // Extract the numeric part of the latest employee ID (e.g., from #EMP0000006, extract 6)
            $lastEmployeeNumber = (int) filter_var($latestEmployee->employee_id, FILTER_SANITIZE_NUMBER_INT);

            // Increment the number by 1
            $newEmployeeNumber = $lastEmployeeNumber + 1;
        } else {
            // If no employees exist, start from 1
            $newEmployeeNumber = 1;
        }

        // Format the new employee ID (e.g., #EMP0000007)
        return '#EMP' . sprintf('%07d', $newEmployeeNumber);
    }

    public function store(Request $request)
    {
        // Define validation rules

        // dd($request->all());
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string',
            'dob' => 'required',
            'gender' => 'required',
            'joinning_date' => 'required',
            'branch_id' => 'required',
            'department_id' => 'required',
            'designation_id' => 'required',
            'company_doj' => 'required',
            'account_holder_name' => 'required',
            'account_number' => 'required',
            'bank_name' => 'required',
            'bank_identifier_code' => 'required',
            'branch_location' => 'required',
            'roleemployee' => 'required',
            'net_salary' => 'required',
            'basic_salary' => 'required',
            'ifsc_code' => 'required',
            'apc_no' => 'required',
            'ptax_no' => 'required',
            'pf_no' => 'required',
            'esi_no' => 'required',
            // 'd_name' => 'required',
            // 'b_name' => 'required',
            // 'ds_name' => 'required',
            'pan_no' => 'required',
            'aadhar_no' => 'required',
            'department_id' => 'required',
            'branch_id' => 'required',
            'designation_id' => 'required',
            'cv' => 'required',
            'can_cheque' => 'required',
            'declaration' => 'required',
            'employee' => 'required',
            'phone' => 'required',
        ]);


        $cvPath = $request->file('cv')->store('uploads/cv', 'public');
        $chequePath = $request->file('can_cheque')->store('uploads/cheques', 'public');
        $declarationPath = $request->file('declaration')->store('uploads/declarations', 'public');
        $employeePath = $request->file('employee')->store('uploads/employee', 'public');
        // Create and save the new user
        $user = new User();
        $user->name = $request['name'];
        $user->email = $validatedData['email'];
        $user->type = 2;
        $user->password = bcrypt($request['password']);
        $user->save();

        // Assign the role to the user
        $user->assignRole($request['roleemployee']);

        // Create and save the employee record
        $employee = new Employee();
        $employee->user_id = $user->id;
        $employee->dob = $request['dob'];
        $employee->gender = $request['gender'];
        $employee->phone = $validatedData['phone'];
        $employee->address = $request['address'];

        $employee->employee_id = $this->generateEmployeeId();

        $employee->branch_id = $request['branch_id'];
        $employee->basic_salary = $request['basic_salary'];
        $employee->net_salary = $request['net_salary'];
        // $employee->department_id = $request['d_name'];
        // $employee->designation_id = $request['ds_name'];
        // $employee->company_doj = $request['company_doj'];

        $employee->department_id = $request['department_id'];
        $employee->designation_id = $request['designation_id'];
        $employee->company_doj = $request['company_doj'];


        $employee->documents = json_encode($request['documents']);;
        $employee->account_holder_name = $request['account_holder_name'];
        $employee->account_number = $request['account_number'];
        $employee->bank_name = $request['bank_name'];
        $employee->bank_identifier_code = $request['bank_identifier_code'];
        $employee->branch_location = $request['branch_location'];
        $employee->tax_payer_id = $request['tax_payer_id'];
        $employee->apc_no = $request['apc_no'];
        $employee->ifsc_code = $request['ifsc_code'];
        $employee->ptax_no = $request['ptax_no'];
        $employee->pf_no = $request['pf_no'];
        $employee->esi_no = $request['esi_no'];
        $employee->pan_no = $request['pan_no'];
        $employee->aadhar_no = $request['aadhar_no'];

        $employee->created_by = Auth::user()->id;
        $employee->joinning_date = $validatedData['joinning_date'];
        $employee->cv = $cvPath;
        $employee->can_cheque = $chequePath;
        $employee->declaration = $declarationPath;
        $employee->employee = $employeePath;

        $employee->save();


        // Redirect with a success message
        return redirect()->route('employees')->with('success', 'Employee created successfully.');
    }

    public function screenshot(Request $request)
    {
        $empi = $request->employee_id ?? '';
        $sd = null;
        $ed = null;
        $query = Screenshot::query();

        // Check if 'images' parameter exists for bulk deletion
        if ($request->filled('images')) {
            // Flatten the array to extract only the IDs
            $imagesToDelete = $request->images; // Assuming images is an array of objects
            $imageIds = array_map(function ($image) {
                return $image['id'];
            }, $imagesToDelete);

            // Perform the bulk delete using the image IDs
            Screenshot::whereIn('id', $imageIds)->delete();

            return response()->json(['message' => 'Images deleted successfully'], 200);
        }

        if ($request->filled('downloaded')) {
            // Handle individual screenshot download and deletion
            $screenshot = Screenshot::where('id', $request->screenshot_id)->first();

            if ($screenshot && !$screenshot->downloaded_at) {
                $screenshot->downloaded_at = now(); // Set the downloaded timestamp
                $screenshot->save();

                // Delete the screenshot after it's downloaded
                $screenshot->delete();
            }
        }

        // Apply other filters
        if ($request->filled('employee_id')) {
            $query->where('user_id', $request->employee_id);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
            $sd = $request->start_date;
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
            $ed = $request->end_date;
        }

        // Get the images
        $imgs = $query->get()->groupBy(function ($item) {
            return Carbon::parse($item->created_at)->format('Y-m-d');
        });

        $groupedImgsWithUniqueDownload = $imgs->map(function ($group) {
            return [
                'date' => $group->first()->created_at->format('Y-m-d'), // The date for the group
                'is_download' => $group->unique('is_download')->pluck('is_download')->contains(1) ? 1 : 0, // Unique 'is_download' values
                'images' => $group->map(function ($item) {
                    return [
                        'created_at' => $item->created_at, // Include 'created_at'
                        'other_field' => $item->other_field // Include any other fields you need
                    ];
                })
            ];
        });

        // dd($groupedImgsWithUniqueDownload);

        $emp = User::where('id', '!=', '1')->get();

        return Inertia::render('employee/screenshot', compact('emp', 'imgs', 'empi', 'sd', 'ed', 'groupedImgsWithUniqueDownload'));
    }

    public function workhours(Request $request)
    {
        $employeeId = $request->input('employee_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Entry::query();

        if ($employeeId) {
            $query->where('user_id', $employeeId);
        }

        if ($startDate) {
            $query->whereDate('entry_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('entry_at', '<=', $endDate);
        }

        // Group Entries
        $entries = $query->get()->groupBy(function ($entry) {
            return $entry->user_id . '_' . Carbon::parse($entry->entry_at)->toDateString();
        });

        $hoursByUserAndDate = $entries->map(function ($userEntries, $groupKey) {
            $totalSeconds = 0;
            $logs = [];
            $sortedEntries = $userEntries->sortBy('entry_at')->values();
            [$userId, $date] = explode('_', $groupKey);

            for ($i = 0; $i < $sortedEntries->count(); $i++) {
                $entry = $sortedEntries[$i];

                $logs[] = [
                    'type' => $entry->type,
                    'address' => \App\Models\Location::find($entry->location_id) ? \App\Models\Location::find($entry->location_id)->address : '',
                    'timestamp' => Carbon::parse($entry->entry_at)
                ];

                if (
                    $entry->type === 'logout' &&
                    $i > 0 &&
                    $sortedEntries[$i - 1]->type === 'loggedin'
                ) {
                    $logoutTime = Carbon::parse($entry->entry_at);
                    $loginTime = Carbon::parse($sortedEntries[$i - 1]->entry_at);

                    if ($logoutTime->greaterThan($loginTime)) {
                        $totalSeconds += $loginTime->diffInSeconds($logoutTime);
                    } else {
                        Log::warning("Invalid logout-login pair detected", [
                            'user_id' => $entry->user_id,
                            'login_time' => $loginTime,
                            'logout_time' => $logoutTime,
                        ]);
                    }
                }
            }

            $hours = intdiv($totalSeconds, 3600);
            $minutes = intdiv($totalSeconds % 3600, 60);
            $seconds = $totalSeconds % 60;

            // Total seconds in a standard workday (e.g., 8 hours)
            $expectedWorkSeconds = 28800; // 8 hours * 3600 seconds

            // Remaining time
            $remainingSeconds = max(0, $expectedWorkSeconds - $totalSeconds);
            $remainingHours = intdiv($remainingSeconds, 3600);
            $remainingMinutes = intdiv($remainingSeconds % 3600, 60);
            $remainingSeconds = $remainingSeconds % 60;

            return [
                'name' => User::findOrFail($userId)->name,
                'date' => $date,
                'total_time' => sprintf('%02dh %02dm %02ds', $hours, $minutes, $seconds),
                'remaining_time' => sprintf('%02dh %02dm %02ds', $remainingHours, $remainingMinutes, $remainingSeconds),
                'logs' => $logs
            ];
        });

        // Get the current page from the request
        $page = request()->get('page', 1);
        $perPage = 10;

        // Paginate the results
        $paginatedData = new LengthAwarePaginator(
            $hoursByUserAndDate->forPage($page, $perPage),
            $hoursByUserAndDate->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        $emp = User::where('id', '!=', '1')->get();
        return Inertia::render('employee/workhours', ['emp' => $emp, 'hoursByUserAndDate' => $paginatedData, 'empi' => $employeeId ?? '', 'sd' => $startDate ?? '', 'ed' => $endDate ?? '']);
    }

    public function downloadImages(Request $request)
    {
        $images = $request->input('images');

        $zipFileName = 'screenshot.zip';
        $zipFilePath = 'public/' . $zipFileName;

        // Create a new ZIP archive
        $zip = new ZipArchive;
        $localZipPath = Storage::path($zipFilePath);

        if ($zip->open($localZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            foreach ($images as $image) {
                if (isset($image['path'])) {
                    $filePath = 'public/' . $image['path'];

                    if (Storage::exists($filePath)) {
                        $fileContent = Storage::get($filePath);
                        $zip->addFromString(basename($filePath), $fileContent);
                    }
                }
            }
            $zip->close();

            // Update the 'is_download' column in the screenshots table
            $imageIds = collect($images)->pluck('id');
            DB::table('screenshots')
                ->whereIn('id', $imageIds)
                ->update(['is_download' => 1]);
        } else {
            return response()->json(['error' => 'Unable to create ZIP file'], 500);
        }

        return redirect()->route('download.file', $zipFileName);
    }



    public function downloadFile($fileName)
    {
        return Storage::disk('public')->download($fileName);
    }


    public function show($id)
    {
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')->join('departments', 'employees.department_id', '=', 'departments.id')
            ->join('designations', 'employees.designation_id', '=', 'designations.id')
            ->join('branches', 'branches.id', '=', 'employees.branch_id')
            ->select(
                'employees.phone',
                'employees.address',
                'employees.joinning_date',
                'employees.dob',
                'users.name',
                'users.email',
                'users.id',
                'users.password',
                'departments.name as d_name',
                'designations.name as desig_name',
                'employees.account_number',
                'employees.bank_name',
                'employees.bank_identifier_code',
                'employees.branch_location',
                'employees.salary_type',
                'employees.salary',
                'employees.is_active',
                'employees.created_by',
                'employees.branch_id',
                'employees.department_id',
                'employees.designation_id',
                'employees.company_doj',
                'employees.documents',
                'employees.dob',
                'employees.gender',
                'employees.basic_salary',
                'employees.net_salary',
                'employees.apc_no',
                'employees.ifsc_code',
                'employees.ptax_no',
                'employees.pf_no',
                'employees.esi_no',
                'employees.pan_no',
                'employees.aadhar_no',
                'employees.cv',
                'employees.declaration',
                'employees.can_cheque',
                'employees.employee',
                'branches.name as b_name'
            )->where('users.id', $id)->first();


        return Inertia::render('employee/show', compact('employee'));
    }


    public function edit($id)
    {
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')->join('departments', 'employees.department_id', '=', 'departments.id')
            ->join('designations', 'employees.designation_id', '=', 'designations.id')
            ->join('branches', 'branches.id', '=', 'employees.branch_id')
            ->select(
                'employees.phone',
                'employees.address',
                'employees.joinning_date',
                'employees.dob',
                'users.name',
                'users.email',
                'users.id',
                'users.password',
                'departments.name as d_name',
                'designations.name as desig_name',
                'employees.account_number',
                'employees.bank_name',
                'employees.bank_identifier_code',
                'employees.branch_location',
                'employees.salary_type',
                'employees.salary',
                'employees.is_active',
                'employees.created_by',
                'employees.branch_id',
                'employees.department_id',
                'employees.designation_id',
                'employees.company_doj',
                'employees.documents',
                'employees.dob',
                'employees.gender',
                'employees.basic_salary',
                'employees.net_salary',
                'employees.apc_no',
                'employees.ifsc_code',
                'employees.ptax_no',
                'employees.pf_no',
                'employees.esi_no',
                'employees.pan_no',
                'employees.aadhar_no',
                'employees.cv',
                'employees.declaration',
                'employees.can_cheque',
                // 'employees.account_holder_name  ',

                'branches.name as b_name'
            )->where('users.id', $id)->first();

        // dd($employee);
        $userss = Auth::user();
        $user = Auth::user()->name;
        $branches = Branch::all();
        $department = Department::all();
        $designation = Designation::all();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $roles = Role::all();
        // $employeeRole = $employee->roles()->pluck('name')->first();
        $employeeRole = $employee->getRoleNames()->first();
        $notif = Auth::user()->notifications;
        return Inertia::render('employee/edit', compact('employee', 'user_type', 'roles', 'employeeRole', 'user', 'notif', 'branches', 'department', 'designation'));
    }
    public function update(Request $request, $id)
    {
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')->join('departments', 'employees.department_id', '=', 'departments.id')
            ->join('designations', 'employees.designation_id', '=', 'designations.id')
            ->join('branches', 'branches.id', '=', 'employees.branch_id')
            ->select(
                'employees.phone',
                'employees.address',
                'employees.joinning_date',
                'employees.dob',
                'users.name',
                'users.email',
                'users.id',
                'users.password',
                'departments.name as d_name',
                'designations.name as desig_name',
                'employees.account_number',
                'employees.bank_name',
                'employees.bank_identifier_code',
                'employees.branch_location',
                'employees.salary_type',
                'employees.salary',
                'employees.is_active',
                'employees.created_by',
                'employees.branch_id',
                'employees.department_id',
                'employees.designation_id',
                'employees.company_doj',
                'employees.documents',
                'employees.dob',
                'employees.gender',
                'employees.basic_salary',
                'employees.net_salary',
                'employees.apc_no',
                'employees.ifsc_code',
                'employees.ptax_no',
                'employees.pf_no',
                'employees.esi_no',
                'employees.pan_no',
                'employees.aadhar_no',
                'employees.cv',
                'employees.declaration',
                'employees.can_cheque',
                // 'employees.account_holder_name  ',

                'branches.name as b_name'
            )->where('users.id', $id)->first();
        // dd($employee);
        // Validate the incoming request
        $validatedData = $request->validate([
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:10',
            'joinning_date' => 'required|date',
            'documents.*.name' => 'required|string|max:255', // Validate each document's name
            'documents.*.type' => 'required|in:image,document', // Validate each document's type
            'documents.*.file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // Validate uploaded files
        ]);
        $cvPath = $request->hasFile('cv')
            ? $request->file('cv')->store('uploads/cv', 'public')
            : $employee->cv; // Retain existing path if no file uploaded

        $chequePath = $request->hasFile('can_cheque')
            ? $request->file('can_cheque')->store('uploads/cheques', 'public')
            : $employee->can_cheque;

        $declarationPath = $request->hasFile('declaration')
            ? $request->file('declaration')->store('uploads/declarations', 'public')
            : $employee->declaration;


        $employeePath = $request->hasFile('employee')
            ? $request->file('employee')->store('uploads/employee', 'public')
            : $employee->employee;

        // Update user
        $user = User::findOrFail($id);
        $user->name = $request->input('name');
        $user->email = $validatedData['email'];
        $user->password = $request->input('password') ? bcrypt($request->input('password')) : $user->password;
        $user->save();
        $user->syncRoles($request->input('roleemployee'));

        // Update employee details
        $employee = Employee::where('user_id', $id)->first();
        $employee->dob = $request->input('dob');
        $employee->gender = $request->input('gender');
        $employee->phone = $validatedData['phone'];
        $employee->address = $request->input('address');
        $employee->branch_id = $request->input('branch_id');
        $employee->basic_salary = $request->input('basic_salary');
        $employee->net_salary = $request->input('net_salary');
        $employee->department_id = $request->input('department_id');
        $employee->designation_id = $request->input('designation_id');
        $employee->company_doj = $request->input('company_doj');
        $employee->account_holder_name = $request->input('account_holder_name');
        $employee->account_number = $request->input('account_number');
        $employee->bank_name = $request->input('bank_name');
        $employee->bank_identifier_code = $request->input('bank_identifier_code');
        $employee->branch_location = $request->input('branch_location');
        $employee->tax_payer_id = $request->input('tax_payer_id');
        $employee->cv = $cvPath;
        $employee->can_cheque = $chequePath;
        $employee->declaration = $declarationPath;
        $employee->employee = $employeePath;
        $employee->joinning_date = $validatedData['joinning_date'];

        // Handle document uploads
        $documents = [];
        if ($request->has('documents')) {
            foreach ($request->file('documents', []) as $index => $file) {
                $name = $request->input("documents.$index.name", '');
                $type = $request->input("documents.$index.type", '');

                if ($file && $file->isValid()) {
                    // Store file
                    $filePath = $file->store('documents', 'public');
                    $documents[] = [
                        'name' => $name,
                        'type' => $type,
                        'file' => $filePath,
                    ];
                } else {
                    // Handle cases where the file is not updated
                    $existingFile = $employee->documents[$index]['file'] ?? null;
                    if ($existingFile) {
                        $documents[] = [
                            'name' => $name,
                            'type' => $type,
                            'file' => $existingFile,
                        ];
                    }
                }
            }
        }

        $employee->documents = json_encode($documents); // Encode the documents array as JSON
        $employee->save();

        return redirect()->route('employees')->with('success', 'Employee updated successfully.');
    }



    public function destroy($id)
    {
        // dd($id);
        $user = User::find($id);
        if (!$user) {
            return redirect()->route('employees')->with('error', 'User not found.');
        }

        // Delete the associated employee(s)
        $employee = Employee::where('user_id', $id)->first();
        if ($employee) {
            $employee->delete();
        }

        // Delete the user
        $user->delete();
        return redirect()->route('employees')->with('success', 'Employee deleted successfully.');
    }

    public function EmployeeIdtime($week, $id)
    {
        // Parse the start date of the week
        $startDate = Carbon::parse($week)->startOfWeek();
        $endDate = Carbon::parse($week)->endOfWeek();

        // Fetch timesheets for the employee in the given date range
        $timesheets = Timesheet::with(['project', 'tasks'])
            ->where('user_id', $id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        // Group timesheets by project_id and task_id
        $groupedTimesheets = $timesheets->groupBy(function ($item) {
            return $item->project_id . '.' . $item->task_id;
        });

        // Format the grouped timesheets
        $result = $groupedTimesheets->map(function ($taskGroup, $projectIdTaskId) {
            $ids = explode('.', $projectIdTaskId);
            if (count($ids) !== 2) {
                \Log::error('Invalid key format', ['key' => $projectIdTaskId]);
                return null;
            }

            list($project_id, $task_id) = $ids;

            // Create entries array where keys are dates and values are time numbers
            $entries = $taskGroup->mapWithKeys(function ($item) {
                return [$item->date => $item->time_number];
            });
            $status = $taskGroup->first()->status;
            return [
                'project_id' => (int) $project_id,
                'task_id' => (int) $task_id,
                'entries' => $entries,
                'status' => $status
            ];
        })->filter()->values();

        // Return the result as JSON
        return response()->json($result);
    }

    public function fetchidwithemployee($id)
    {
        $employee = User::where('id', $id)->first();
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
                'leave_management.id'
            )->first();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('dailystatus/employeetime', compact('employee', 'leave', 'user', 'user_type', 'notif'));
    }

    public function Statuschange(Request $request, $id)
    {
        $timesheets = $request->input('timesheets', []);

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = $id;

            if (!$project_id || !$task_id) {
                \Log::warning('Missing project_id or task_id', $timesheetData);
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;

                    \Log::info('Processing timesheet', [
                        'user_id' => $user_id,
                        'project_id' => $project_id,
                        'task_id' => $task_id,
                        'date' => $date,
                        'time_number' => $time_number,
                    ]);

                    // Retrieve the existing timesheet for the given project, task, and date
                    $existingTimesheet = Timesheet::where('project_id', $project_id)
                        ->where('task_id', $task_id)
                        ->where('date', $date)
                        ->where('user_id', $user_id)
                        ->first();

                    if ($existingTimesheet) {
                        // Update the existing timesheet
                        $existingTimesheet->update([
                            'time_number' => $time_number,
                            'status' => '0', // Unlocked
                            'is_approved' => '3',
                        ]);

                        // Send notification to the user about the timesheet unlock
                        $user = User::find($user_id); // Assuming you want to notify the user
                        $userName = Auth::user()->name; // Get the name of the user who made the changes
                        $user->notify(new TimesheetUnlockedNotification($existingTimesheet, $userName));
                    } else {
                        // Create a new timesheet entry
                        $newTimesheet = Timesheet::create([
                            'project_id' => $project_id,
                            'task_id' => $task_id,
                            'date' => $date,
                            'time_number' => $time_number,
                            'user_id' => $user_id,
                            'status' => '1', // Assuming status is needed
                            'is_approved' => '3', // Assuming status is needed
                        ]);
                    }
                }
            }
        }

        return back();
    }




    public function ApproveStatuschange(Request $request, $id)
    {
        // Log the incoming request data
        // dd($request->all());



        $timesheets = $request->input('timesheets', []);

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = $id;

            if (!$project_id || !$task_id) {
                \Log::warning('Missing project_id or task_id', $timesheetData);
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;

                    \Log::info('Processing timesheet', [
                        'user_id' => $user_id,
                        'project_id' => $project_id,
                        'task_id' => $task_id,
                        'date' => $date,
                        'time_number' => $time_number,
                    ]);

                    // Retrieve the existing timesheet for the given project, task, and date
                    $existingTimesheet = Timesheet::where('project_id', $project_id)
                        ->where('task_id', $task_id)
                        ->where('date', $date)
                        ->where('user_id', $user_id)
                        ->first();

                    if ($existingTimesheet) {
                        // Update the existing timesheet
                        $existingTimesheet->update([
                            'time_number' => $time_number,
                            'is_approved' => '1',
                        ]);
                    } else {
                        // Create a new timesheet entry
                        Timesheet::create([
                            'project_id' => $project_id,
                            'task_id' => $task_id,
                            'date' => $date,
                            'time_number' => $time_number,
                            'user_id' => $user_id,
                            'is_approved' => '1', // Assuming status is needed, you can adjust accordingly
                        ]);
                    }
                }
            }
        }

        return back();
    }
    public function deleteImage(Request $request)
    {
        // Log the incoming data to see what is being sent
        Log::info('Delete Request Data:', $request->all());

        // Get the list of image IDs from the request
        $imageIds = $request->input('images');

        // Validate the incoming data to make sure images is an array of valid integers
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'integer|exists:screenshots,id', // Ensure that each image ID exists in the database
        ]);

        // Log the validated IDs
        Log::info('Validated Image IDs:', $imageIds);

        try {
            // Attempt to delete the screenshots from the database
            $deletedCount = Screenshot::whereIn('id', $imageIds)->delete();

            if ($deletedCount > 0) {
                return response()->json(['message' => 'Images deleted successfully.']);
            } else {
                return response()->json(['error' => 'No images found for deletion.'], 404);
            }
        } catch (\Exception $e) {
            // Log any exceptions that occur
            Log::error('Error during deletion:', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while deleting the images.'], 500);
        }
    }


    public function RejectStatuschange(Request $request, $id)
    {
        // Log the incoming request data
        // dd($request->all());



        $timesheets = $request->input('timesheets', []);

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = $id;

            if (!$project_id || !$task_id) {
                \Log::warning('Missing project_id or task_id', $timesheetData);
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;

                    \Log::info('Processing timesheet', [
                        'user_id' => $user_id,
                        'project_id' => $project_id,
                        'task_id' => $task_id,
                        'date' => $date,
                        'time_number' => $time_number,
                    ]);

                    // Retrieve the existing timesheet for the given project, task, and date
                    $existingTimesheet = Timesheet::where('project_id', $project_id)
                        ->where('task_id', $task_id)
                        ->where('date', $date)
                        ->where('user_id', $user_id)
                        ->first();

                    if ($existingTimesheet) {
                        // Update the existing timesheet
                        $existingTimesheet->update([
                            'time_number' => $time_number,
                            'is_approved' => '0',
                        ]);
                    } else {
                        // Create a new timesheet entry
                        Timesheet::create([
                            'project_id' => $project_id,
                            'task_id' => $task_id,
                            'date' => $date,
                            'time_number' => $time_number,
                            'user_id' => $user_id,
                            'is_approved' => '0', // Assuming status is needed, you can adjust accordingly
                        ]);
                    }
                }
            }
        }

        return back();
    }



    public function holidayAssignd($id)
    {
        $empl = User::join('employees', 'employees.user_id', '=', 'users.id')->select('users.id', 'users.name')->where('users.id', $id)->first();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;

        $holidays = Holiday::all();
        $assignments = holidayAssign::join('users', 'users.id', '=', 'holiday_assigns.employee_id')
            ->join('holidays', 'holidays.id', '=', 'holiday_assigns.holiday_id')

            ->select('users.name', 'holiday_assigns.id', 'holidays.name as title')->where('holiday_assigns.employee_id', $id)->get();
        return Inertia::render('holiday/assignEmployee', compact('empl', 'userss', 'notif', 'user', 'holidays', 'assignments', 'user_type'));
    }


    public function EmployeeAssignallocate() {}

    public function employeesetip()
    {

        return Inertia::render('employee/employeesetup');
    }
}
