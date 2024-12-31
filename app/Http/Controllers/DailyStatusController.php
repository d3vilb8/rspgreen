<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Holiday;
use App\Models\Project;
use App\Models\Timesheet;
use App\Models\DailyStatus;
use Illuminate\Http\Request;
use App\Models\LeaveManagement;
use App\Models\TaskCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class DailyStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Auth::user()->id);
        $initialProjects = User::join('task_assigns', 'task_assigns.employee_id', '=', 'users.id')
            ->join('tasks', 'tasks.id', '=', 'task_assigns.task_id')
            ->join('projects', 'projects.id', '=', 'tasks.project_id')
            ->join('employees', 'users.id', '=', 'employees.user_id')
            ->select('projects.title', 'tasks.task_name', 'users.id')
            ->where('task_assigns.employee_id', Auth::user()->id)->get();
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
            )->where('leave_management.employee_id', Auth::user()->id)->first();
        // dd($leave);
        $taskMappings = Task::join('task_assigns','task_assigns.task_id','=','tasks.id')
                            ->where('task_assigns.employee_id',Auth::user()->id)
                            ->select('tasks.id','tasks.task_name as tname')
                            ->get();
        $holidays = Holiday::all(['start_date', 'end_date']);
        $user = Auth::user()->name;
        $userid = Auth::user()->id;
        // dd($userid);
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $permissions = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }

        $taskwithdisabled = Task::join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
            ->join('users', 'users.id', '=', 'task_assigns.employee_id')
            ->select('tasks.estimate_hours', 'tasks.task_name')->where('task_assigns.employee_id', Auth::user()->id)->get();
        // dd($taskwithdisabled);
        $notif = Auth::user()->notifications;
        return Inertia::render('dailystatus/index', compact('initialProjects', 'taskMappings', 'leave', 'taskwithdisabled', 'permissions', 'user', 'notif', 'userid'));
    }

    public function getProjectTasks()
    {


        // $tasks = User::join('task_assigns', 'task_assigns.employee_id', '=', 'users.id')
        //     ->join('tasks', 'tasks.id', '=', 'task_assigns.task_id')
        //     ->join('projects', 'projects.id', '=', 'tasks.project_id')
        //     ->select(
        //         'projects.id as project_id',
        //         'projects.title as project_name',
        //         'tasks.id as task_id',
        //         'tasks.task_name as task_name'
        //     )
        //     ->where('task_assigns.employee_id', Auth::user()->id)
        //     ->get();

        // // Grouping tasks by project
        // $taskMapping = [];
        // foreach ($tasks as $task) {
        //     if (!isset($taskMapping[$task->project_id])) {
        //         $taskMapping[$task->project_id] = [
        //             'project_name' => $task->project_name,
        //             'tasks' => []
        //         ];
        //     }
        //     $taskMapping[$task->project_id]['tasks'][] = [
        //         'task_id' => $task->task_id,
        //         'task_name' => $task->task_name
        //     ];
        // }

        $tasks = User::join('task_assigns', 'task_assigns.employee_id', '=', 'users.id')
            ->join('tasks', 'tasks.id', '=', 'task_assigns.task_id')
            ->select(
                'tasks.id as task_id',
                'tasks.task_name as task_name'
            )
            ->where('task_assigns.employee_id', Auth::user()->id)
            ->get();


        // Grouping tasks by project
        $taskMapping = [];
        foreach ($tasks as $task) {
            // if (!isset($taskMapping[$task->project_id])) {
            //     $taskMapping[$task->project_id] = [
            //         'project_name' => $task->project_name,
            //         'tasks' => []
            //     ];
            // }
            $taskMapping['tasks'][] = [
                'task_id' => $task->task_id,
                'task_name' => $task->task_name
            ];
        }

        return response()->json($tasks);
    }


    public function getProjectTasksEmployess($id)
    {
        $tasks = User::join('task_assigns', 'task_assigns.employee_id', '=', 'users.id')
            ->join('tasks', 'tasks.id', '=', 'task_assigns.task_id')
            ->join('projects', 'projects.id', '=', 'tasks.project_id')
            ->select(
                'projects.id as project_id',
                'projects.title as project_name',
                'tasks.id as task_id',
                'tasks.task_name as task_name'
            )
            ->where('task_assigns.employee_id', $id)
            ->get();

        $taskMapping = [];
        foreach ($tasks as $task) {
            if (!isset($taskMapping[$task->project_id])) {
                $taskMapping[$task->project_id] = [
                    'project_name' => $task->project_name,
                    'tasks' => []
                ];
            }
            $taskMapping[$task->project_id]['tasks'][] = [
                'task_id' => $task->task_id,
                'task_name' => $task->task_name
            ];
        }

        // Output the data to check the structure
        return response()->json($taskMapping);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DailyStatus $dailyStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DailyStatus $dailyStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DailyStatus $dailyStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function tasktime(DailyStatus $dailyStatus)
    {
        // Get the logged-in user's ID
        $loggedInUserId = Auth::id();

        // Query to get tasks with timesheets for the logged-in user
        $tasksWithTimesheets = Timesheet::join('tasks', 'tasks.id', '=', 'timesheets.task_id')
            ->join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
            ->where('task_assigns.employee_id', $loggedInUserId)  // Filter task assignments by the logged-in user
            ->where('timesheets.user_id', $loggedInUserId)  // Filter timesheets by the logged-in user
            ->select(
                'task_assigns.task_id',
                'tasks.task_name',
                'task_assigns.employee_id',
                'task_assigns.employee_hours as estimate_hours',  // Employee-specific estimate hours
                DB::raw('SUM(timesheets.time_number) as total_time_worked')  // Sum of time worked for each task
            )
            ->groupBy('task_assigns.task_id', 'tasks.task_name', 'task_assigns.employee_hours', 'task_assigns.employee_id')  // Group by task and employee estimate hours
            ->get();

        // Log to check the structure of the returned tasks with timesheets
        \Log::info($tasksWithTimesheets);

        // Return the JSON response with the tasks and their timesheets data
        return response()->json($tasksWithTimesheets);
    }




    public function employeetasktime(DailyStatus $dailyStatus, $id)
    {
        $tasksWithTimesheets = Timesheet::join('tasks', 'tasks.id', '=', 'timesheets.task_id')
            ->where('timesheets.user_id', $id)
            ->select(
                'tasks.id as task_id',
                'tasks.task_name',
                'tasks.estimate_hours',
                DB::raw('SUM(timesheets.time_number) as total_time_worked')
            )
            ->groupBy('tasks.id', 'tasks.task_name', 'tasks.estimate_hours')
            ->get();

        return response()->json($tasksWithTimesheets);




        // return Task::join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
        //     ->join('timesheets', 'timesheets.task_id', '=', 'tasks.id')
        //     ->where('task_assigns.employee_id', Auth::user()->id)
        //     ->select('tasks.id as task_id', 'tasks.estimate_hours', 'tasks.task_name', 'timesheets.time_number')
        //     ->get();
        // return Task::join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
        //     ->where('tasks.id', $taskId)
        //     ->select('tasks.estimate_hours')
        //     ->first();
    }
}
