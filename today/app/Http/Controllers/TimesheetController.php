<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Log;
use Carbon\Carbon;
use App\Models\Project;
use App\Models\Timesheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Notifications\TimesheetStatusChanged;
use Illuminate\Support\Facades\Notification;
use App\Models\User; // Assuming User model is used to find admins
class TimesheetController extends Controller
{


    //    public function index($week)
    //    {
    //        $startDate = Carbon::parse($week)->startOfWeek();
    //        $endDate = Carbon::parse($week)->endOfWeek();
    //
    //        $timesheets = Timesheet::with(['project', 'tasks'])
    //            ->where('user_id', Auth::user()->id)
    //            ->whereBetween('date', [$startDate, $endDate])
    //            ->get();
    //
    //
    //
    //        // Group timesheets by project_id and task_id
    //        $groupedTimesheets = $timesheets->groupBy(function ($item) {
    //            return $item->project_id . '.' . $item->task_id;
    //        });
    //
    //        $result = $groupedTimesheets->map(function ($taskGroup, $projectIdTaskId) {
    //            // Ensure the key can be split into project_id and task_id
    //            $ids = explode('.', $projectIdTaskId);
    //            if (count($ids) !== 2) {
    //
    //                return null;
    //            }
    //
    //            list($project_id, $task_id) = $ids;
    //
    //            // Create entries array where keys are dates and values are time numbers
    //            $entries = $taskGroup->mapWithKeys(function ($item) {
    //                return [$item->date => $item->time_number];
    //            });
    //
    //            // Assuming status is the same across all grouped timesheets, get it from the first item
    //            $status = $taskGroup->first()->status;
    //
    //            return [
    //                'project_id' => (int) $project_id,
    //                'task_id' => (int) $task_id,
    //                'status' => $status,  // Include the status in the response
    //                'entries' => $entries
    //            ];
    //        })->filter()->values();
    //
    //
    //
    //        return response()->json($result);
    //    }
    public function index($week)
    {
        $startDate = Carbon::parse($week)->startOfWeek();
        $endDate = Carbon::parse($week)->endOfWeek();

        // Fetch timesheets for the authenticated user within the specified date range
        $timesheets = Timesheet::with(['project', 'tasks'])
            ->where('user_id', Auth::user()->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        // Group timesheets by project_id and task_id
        $groupedTimesheets = $timesheets->groupBy(function ($item) {
            return $item->project_id . '.' . $item->task_id;
        });

        // Map the grouped timesheets to the desired structure
        $result = $groupedTimesheets->map(function ($taskGroup, $projectIdTaskId) {
            // Split the project_id and task_id
            $ids = explode('.', $projectIdTaskId);
            if (count($ids) !== 2) {
                return null;
            }

            list($project_id, $task_id) = $ids;

            // Create entries array where keys are dates and values are time numbers
            $entries = $taskGroup->mapWithKeys(function ($item) {
                return [$item->date => $item->time_number];
            });

            // Assuming status is the same across all grouped timesheets, get it from the first item
            $status = $taskGroup->first()->status;
            $is_approved = $taskGroup->first()->is_approved;

            // Gather all IDs of the timesheets in this group
            $timesheetIds = $taskGroup->pluck('id');

            return [
                'project_id' => (int) $project_id,
                'task_id' => (int) $task_id,
                'status' => $status,  // Include the status in the response
                'is_approved' => $is_approved,  // Include the status in the response
                'entries' => $entries,
                'timesheet_ids' => $timesheetIds  // Include timesheet IDs in the response
            ];
        })->filter()->values();

        return response()->json($result);
    }


    public function employeeindex($week, $id)
    {
        $startDate = Carbon::parse($week)->startOfWeek();
        $endDate = Carbon::parse($week)->endOfWeek();

        $timesheets = Timesheet::with(['project', 'tasks'])
            ->where('user_id', $id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        // Group timesheets by project_id and task_id
        $groupedTimesheets = $timesheets->groupBy(function ($item) {
            return $item->project_id . '.' . $item->task_id;
        });

        $result = $groupedTimesheets->map(function ($taskGroup, $projectIdTaskId) {
            // Ensure the key can be split into project_id and task_id
            $ids = explode('.', $projectIdTaskId);
            if (count($ids) !== 2) {
                return null;
            }

            list($project_id, $task_id) = $ids;

            // Get the first timesheet entry to fetch project and task names
            $firstEntry = $taskGroup->first();

            // Create entries array where keys are dates and values are time numbers
            $entries = $taskGroup->mapWithKeys(function ($item) {
                return [$item->date => $item->time_number];
            });

            // Assuming status is the same across all grouped timesheets, get it from the first item
            $status = $firstEntry->status;
            $is_approved = $firstEntry->is_approved;

            return [
                'project_id' => (int) $project_id,
                'project_name' => $firstEntry->project->title,  // Add project name
                'task_id' => (int) $task_id,
                'task_name' => $firstEntry->tasks->task_name,  // Add task name
                'status' => $status,  // Include the status in the response
                'is_approved' => $is_approved,  // Include the status in the response
                'entries' => $entries
            ];
        })->filter()->values();

        return response()->json($result);
    }

    // public function store(Request $request)
    // {
    //     // Log the incoming request data
    //     // dd($request->all());

    //     $timesheets = $request->input('timesheets', []);

    //     foreach ($timesheets as $timesheetData) {
    //         // Log each timesheet data to ensure 'date' field is present
    //         \Log::info('Timesheet Data:', $timesheetData);

    //         // Check if 'date' field is present
    //         if (!isset($timesheetData['date'])) {
    //             \Log::error('Missing date in timesheet data:', $timesheetData);
    //             continue;
    //         }

    //         // Set default values for non-nullable fields
    //         $timesheetData['field1'] = $timesheetData['field1'] ?? '0.00';
    //         $timesheetData['field2'] = $timesheetData['field2'] ?? '0.00';
    //         $timesheetData['field3'] = !empty($timesheetData['field3']) ? $timesheetData['field3'] : null;
    //         $timesheetData['field4'] = !empty($timesheetData['field4']) ? $timesheetData['field4'] : null;
    //         $timesheetData['field5'] = !empty($timesheetData['field5']) ? $timesheetData['field5'] : null;
    //         $timesheetData['field6'] = !empty($timesheetData['field6']) ? $timesheetData['field6'] : null;
    //         $timesheetData['field7'] = !empty($timesheetData['field7']) ? $timesheetData['field7'] : null;
    //         $timesheetData['status'] = '0';
    //         // Add user_id to the data
    //         $timesheetData['user_id'] = Auth::user()->id;

    //         // Log timesheet data to ensure 'date' field is present
    //         \Log::info('Processed Timesheet Data:', $timesheetData);

    //         $existingTimesheet = Timesheet::where('project_id', $timesheetData['project_id'])
    //             ->where('task_id', $timesheetData['task_id'])
    //             ->where('date', $timesheetData['date'])
    //             ->first();

    //         if ($existingTimesheet) {
    //             $existingTimesheet->update($timesheetData);
    //         } else {
    //             Timesheet::create($timesheetData);
    //         }
    //     }
    //     // return Back();

    //     return response()->json(['message' => 'Timesheets saved successfully'], 201);
    // }
    // public function store(Request $request)
    // {
    //     // dd($request->all());


    //     $timesheets = $request->input('timesheets', []);

    //     foreach ($timesheets as $timesheetData) {
    //         $project_id = $timesheetData['project_id'] ?? null;
    //         $task_id = $timesheetData['task_id'] ?? null;
    //         $user_id = Auth::user()->id;

    //         if (!$project_id || !$task_id) {

    //             continue;
    //         }

    //         foreach ($timesheetData as $key => $value) {
    //             if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
    //                 $date = $key;
    //                 $time_number = $value;
    //                 $description = $timesheetData["description_{$date}"] ?? ''; // Get the description for the specific date

    //                 // \Log::info('Processing timesheet', [
    //                 //     'user_id' => $user_id,
    //                 //     'project_id' => $project_id,
    //                 //     'task_id' => $task_id,
    //                 //     'date' => $date,
    //                 //     'time_number' => $time_number,
    //                 //     'description' => $description,
    //                 // ]);

    //                 // Retrieve the existing timesheet for the given project, task, and date
    //                 $existingTimesheet = Timesheet::where('project_id', $project_id)
    //                     ->where('task_id', $task_id)
    //                     ->where('date', $date)
    //                     ->where('user_id', $user_id)
    //                     ->first();

    //                 if ($existingTimesheet) {
    //                     // Update the existing timesheet
    //                     $existingTimesheet->update([
    //                         'time_number' => $time_number,
    //                         'description' => $description, // Update the description
    //                     ]);
    //                 } else {
    //                     // Create a new timesheet entry
    //                     Timesheet::create([
    //                         'project_id' => $project_id,
    //                         'task_id' => $task_id,
    //                         'date' => $date,
    //                         'time_number' => $time_number,
    //                         'user_id' => $user_id,
    //                         'status' => '0', // Assuming status is needed, you can adjust accordingly
    //                         'description' => $description, // Save the description
    //                     ]);
    //                 }
    //             }
    //         }
    //     }

    //     // return response()->json(['message' => 'Timesheets saved successfully'], 201);
    //     return back();
    // }


    // public function store(Request $request)
    // {
    //     // dd($request->all());
    //     $timesheets = $request->input('timesheets', []);

    //     foreach ($timesheets as $timesheetData) {
    //         $project_id = $timesheetData['project_id'] ?? null;
    //         $task_id = $timesheetData['task_id'] ?? null;
    //         $user_id = Auth::user()->id;

    //         if (!$project_id || !$task_id) {
    //             continue;
    //         }

    //         foreach ($timesheetData as $key => $value) {
    //             if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
    //                 $date = $key;
    //                 $time_number = $value;
    //                 $description = $timesheetData["description_{$date}"] ?? ''; // Get the description for the specific date

    //                 // Retrieve the existing timesheet for the given project, task, and date
    //                 $existingTimesheet = Timesheet::where('project_id', $project_id)
    //                     ->where('task_id', $task_id)
    //                     ->where('date', $date)
    //                     ->where('user_id', $user_id)
    //                     ->first();

    //                 if ($existingTimesheet) {
    //                     // Merge the existing data with the new data to preserve fields not being updated
    //                     $updatedData = [
    //                         'time_number' => $time_number ?: $existingTimesheet->time_number,
    //                         'description' => $description ?: $existingTimesheet->description,
    //                     ];

    //                     // Update the existing timesheet with the merged data
    //                     $existingTimesheet->update($updatedData);
    //                 } else {
    //                     // Create a new timesheet entry
    //                     Timesheet::create([
    //                         'project_id' => $project_id,
    //                         'task_id' => $task_id,
    //                         'date' => $date,
    //                         'time_number' => $time_number,
    //                         'user_id' => $user_id,
    //                         'status' => '0', // Assuming status is needed, you can adjust accordingly
    //                         'description' => $description, // Save the description
    //                     ]);
    //                 }
    //             }
    //         }
    //     }

    //     return back();
    // }



    public function store(Request $request)
    {
        $timesheets = $request->input('timesheets', []);

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = Auth::user()->id;

            if (!$project_id || !$task_id) {
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;
                    $description = $timesheetData["description_{$date}"] ?? ''; // Get the description for the specific date

                    // Retrieve the existing timesheet for the given project, task, and date
                    $existingTimesheet = Timesheet::where('project_id', $project_id)
                        ->where('task_id', $task_id)
                        ->where('date', $date)
                        ->where(
                            'user_id',
                            $user_id
                        )
                        ->first();

                    if ($existingTimesheet) {
                        // Use isset() to ensure 0 values are not ignored
                        $updatedData = [
                            'time_number' => isset($time_number) ? $time_number : $existingTimesheet->time_number,
                            'description' => !empty($description) ? $description : $existingTimesheet->description,
                        ];

                        // Update the existing timesheet with the new data
                        $existingTimesheet->update($updatedData);
                    } else {
                        // Create a new timesheet entry
                        Timesheet::create([
                            'project_id' => $project_id,
                            'task_id' => $task_id,
                            'date' => $date,
                            'time_number' => $time_number,
                            'user_id' => $user_id,
                            'status' => '0', // Assuming status is needed
                            'description' => $description, // Save the description
                        ]);
                    }
                }
            }
        }

        return back();
    }


    public function Statuschange(Request $request)
    {
        $timesheets = $request->input('timesheets', []);

        // Fetch all admin users
        $admins = User::where('id', 1)->get();

        // Get the authenticated user's name
        $authUserName = Auth::user()->name;

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = Auth::user()->id;

            if (
                !$project_id || !$task_id
            ) {
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;

                    // Retrieve the existing timesheet
                    $existingTimesheet = Timesheet::where('project_id', $project_id)
                        ->where('task_id', $task_id)
                        ->where('date', $date)
                        ->where('user_id', $user_id)
                        ->first();

                    if ($existingTimesheet) {
                        // Update the existing timesheet
                        $existingTimesheet->update([
                            'time_number' => $time_number,
                            'status' => '1',
                            'is_approved' => '3',
                        ]);

                        // Send a notification to all admin users
                        Notification::send($admins, new TimesheetStatusChanged($existingTimesheet, $authUserName));
                    } else {
                        // Create a new timesheet entry
                        $newTimesheet = Timesheet::create([
                            'project_id' => $project_id,
                            'task_id' => $task_id,
                            'date' => $date,
                            'time_number' => $time_number,
                            'user_id' => $user_id,
                            'status' => '1',
                            'is_approved' => '3',
                        ]);

                        // Send a notification to all admin users
                        Notification::send($admins, new TimesheetStatusChanged($newTimesheet, $authUserName));
                    }
                }
            }
        }

        return back();
    }


    public function show(Timesheet $timesheet)
    {
        return response()->json($timesheet);
    }

    public function update(Request $request, Timesheet $timesheet)
    {
        $data = $request->validate([
            'field1' => 'nullable|numeric',
            'field2' => 'nullable|numeric',
            'field3' => 'nullable|numeric',
            'field4' => 'nullable|numeric',
            'field5' => 'nullable|numeric',
            'field6' => 'nullable|numeric',
            'field7' => 'nullable|numeric',
        ]);

        $timesheet->update($data);

        return response()->json($timesheet);
    }

    public function destroy(Timesheet $timesheet)
    {
        $timesheet->delete();

        return response()->json(null, 204);
    }

    public function Holidayindex()
    {
        $holiday = Holiday::all();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('holiday/holiday', compact('holiday', 'user', 'user_type', 'notif'));
    }

    public function Holiday(Request $request)
    {
        Holiday::create($request->all());
        return back();
    }
    public function HolidayUpdate(Request $request, $id)
    {
        // Find the Holiday record by its ID
        $holiday = Holiday::find($id);

        // Update the Holiday record with the data from the request
        $holiday->update($request->all());

        // Redirect back
        return back();
    }
    public function DeleteHoliday($id)
    {
        // Find the Holiday record by its ID
        $holiday = Holiday::find($id);

        // Delete the Holiday record
        $holiday->delete();

        // Redirect back
        return back();
    }

    public function Holidayfetch()
    {
        return Holiday::with('assignedEmployees')->get();
    }


    // public function TaskwiseChange(){
    //     $data
    // }

    public function destroyTime($id)
    {
        try {
            // Find the timesheet by ID
            $timesheet = Timesheet::findOrFail($id);

            // Delete the timesheet
            $timesheet->delete();

            return response()->json(['message' => 'Timesheet deleted successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error message
            \Log::error('Error deleting timesheet: ' . $e->getMessage());

            return response()->json(['error' => 'Failed to delete timesheet.'], 500);
        }
    }



    public function ApproveStatuschange(Request $request)
    {
        // Log the incoming request data
        dd($request->all());



        $timesheets = $request->input('timesheets', []);

        foreach ($timesheets as $timesheetData) {
            $project_id = $timesheetData['project_id'] ?? null;
            $task_id = $timesheetData['task_id'] ?? null;
            $user_id = Auth::user()->id;

            if (!$project_id || !$task_id) {
                // \Log::warning('Missing project_id or task_id', $timesheetData);
                continue;
            }

            foreach ($timesheetData as $key => $value) {
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $key)) {
                    $date = $key;
                    $time_number = $value;

                    // \Log::info('Processing timesheet', [
                    //     'user_id' => $user_id,
                    //     'project_id' => $project_id,
                    //     'task_id' => $task_id,
                    //     'date' => $date,
                    //     'time_number' => $time_number,
                    // ]);

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
                            'status' => '1',
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
}
