<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Employee;
use App\Models\TaskAssign;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use App\Models\ProjectAssign;
use App\Notifications\TaskAssign as NotificationsTaskAssign;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $projects = Project::all();
        // dd($projects);
        $employees = Employee::all();
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/projects', compact('projects', 'user', 'employees', 'user_type', 'notif'));
    }

    public function proassignemployess()
    {
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('employees.phone', 'employees.address', 'employees.joinning_date', 'users.name', 'users.email', 'users.id')->get();
        // $task = Project::with(['tasks', 'users'])->get();
        $taskcategory = TaskCategory::all();
        $tasks = Project::with(['tasks.users' => function ($query) {
            $query->withPivot('employee_hours'); // Ensure employee_time is included in the query
        }])->get();
        //        dd($tasks);
        $projects = Project::all();
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/proemployee', compact('tasks', 'user', 'user_type', 'notif', 'taskcategory', 'employee', 'projects'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $employees = $employee = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('employees.phone', 'employees.address', 'employees.joinning_date', 'users.name', 'users.email', 'users.id')->get();
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/create', compact('employees', 'user_type', 'user', 'notif'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $project = new Project();
        $project->title = $request->title;
        $project->estimate_time = $request->estimate_time;
        $project->estimate_budget = $request->estimate_budget;
        $project->start_date = $request->start_date;
        $project->end_date = $request->end_date;
        $project->priority = $request->priority;
        // $project->employee_id = $request->employee_id;
        $project->save();

        // foreach ($request->employee_id as $employee_id) {
        //     $assign = new ProjectAssign();
        //     $assign->project_id = $project->id;
        //     $assign->employee_id = $employee_id;
        //     $assign->save();
        // }
        return redirect()->route('projects')->with('project', 'Project created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, $id)
    {
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $project = Project::find($id);
        $task = Task::where('project_id', $project->id)->get();
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/view', compact('project', 'user', 'task', 'user_type', 'notif'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, $id)
    {
        $project = Project::with('assignments.employee')->findOrFail($id);
        // dd($project);
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $employees = User::all(); // Assuming employees are users
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/edit', compact(
            'project',
            'employees',
            'user_type',
            'user',
            'notif'
        ));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // $request->validate([
        //     'title' => 'required|string|max:255',
        //     'estimate_time' => 'required|string|max:255',
        //     'estimate_budget' => 'required|numeric',
        //     'start_date' => 'required|date',
        //     'end_date' => 'required|date|after_or_equal:start_date',
        //     // 'employee_id' => 'required|array',
        //     'employee_id.*' => 'exists:users,id',
        // ]);

        $project = Project::findOrFail($id);
        $project->title = $request->title;
        $project->estimate_time = $request->estimate_time;
        $project->estimate_budget = $request->estimate_budget;
        $project->start_date = $request->start_date;
        $project->end_date = $request->end_date;
        $project->priority = $request->priority;
        $project->save();

        // Update assignments
        ProjectAssign::where('project_id', $id)->delete();

        foreach ($request->employee_ids as $employee_id) {
            ProjectAssign::create([
                'project_id' => $project->id,
                'employee_id' => $employee_id,
            ]);
        }

        // return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
        return back();
    }


    /**
     * Remove the specified resource from storage.
     */


    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()->route('projects')->with('success', 'Project and related assignments deleted successfully.');
    }
    public function Task()
    {
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('employees.phone', 'employees.address', 'employees.joinning_date', 'users.name', 'users.email', 'users.id')->get();
        // $task = Project::with(['tasks', 'users'])->get();
        $taskcategory = TaskCategory::all();
        // if(Auth::user()->hasRole('admin')){
            $tasks = Project::with(['tasks.users' => function ($query) {
                $query->withPivot('employee_hours');
            }])->get();
        // }else{
        //     // $tasks = 
        // }
        //        dd($tasks);
        $projects = Project::all();
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/task', compact('tasks', 'user', 'user_type', 'notif', 'taskcategory', 'employee', 'projects'));
    }
    public function taskCreate()
    {
        $projects = Project::all();
        // dd($projects);
        $taskcategory = TaskCategory::all();
        $employees = User::all();
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/task-create', compact('employees', 'projects', 'taskcategory', 'user', 'user_type', 'notif'));
    }

    public function taskStore(Request $request)
    {
                // dd($request->all());
        $project = new Task();
        $project->task_name = $request->task_name;
        $project->estimate_hours = $request->estimate_hours;
        $project->status = $request->status;
        $project->project_id = $request->project_id;
        $project->sdate = $request->sdate;
        $project->edate = $request->edate;
        $project->priority = $request->priority;
        $project->status = 0;
        // $project->employee_id = $request->employee_id;
        $project->save();
        
        Notification::send(User::whereIn('id', $request->employee_id)->get(), new NotificationsTaskAssign($project->task_name, 'New Task Assigned'));
        foreach ($request->employee_id as $employee_id) {
            $assign = new TaskAssign();
            $assign->task_id = $project->id;
            $assign->employee_id = $employee_id;
            $assign->project_id = $project->project_id;
            $assign->employee_hours = $request->employee_hours[$employee_id];
            $assign->save();
        }

        return redirect('projects-task')->with('project', 'Project created successfully');
    }
    // public function taskStore(Request $request)
    // {
    //     // Create the main task
    //     $project = new Task();
    //     $project->task_name = $request->task_name;
    //     $project->estimate_hours = $request->estimate_hours;
    //     $project->status = $request->status;
    //     $project->project_id = $request->project_id;
    //     $project->sdate = $request->sdate;
    //     $project->edate = $request->edate;
    //     $project->status = 0;
    //     $project->save();

    //     // Notify assigned employees about the new task
    //     Notification::send(User::whereIn('id', $request->employee_id)->get(), new NotificationsTaskAssign($project->task_name, 'New Task Assigned'));

    //     // Assign the main task to employees
    //     foreach ($request->employee_id as $employee_id) {
    //         $assign = new TaskAssign();
    //         $assign->task_id = $project->id;
    //         $assign->employee_id = $employee_id;
    //         $assign->project_id = $project->project_id;
    //         $assign->employee_hours = $employee_id;
    //         $assign->save();
    //     }

    //     // AUTOMATICALLY ASSIGN NON-BILLABLE TASK FROM `taskcategory`
    //     // Check if a NON-BILLABLE category exists in the taskcategory table
    //     $nonBillableCategory = TaskCategory::where('tname', 'NON-BILLABLE')->first();

    //     if ($nonBillableCategory) {
    //         // Create a NON-BILLABLE task for the project, linked to the taskcategory
    //         $nonBillableTask = new Task();
    //         $nonBillableTask->task_name = 'NON-BILLABLE';
    //         $nonBillableTask->estimate_hours = 0; // Or define a default value
    //         $nonBillableTask->status = 0;
    //         $nonBillableTask->project_id = $project->project_id;
    //         // $nonBillableTask->task_category_id = $nonBillableCategory->id; // Link the task to NON-BILLABLE category
    //         $nonBillableTask->sdate = $project->sdate; // Same start date as main task
    //         $nonBillableTask->edate = $project->edate; // Same end date as main task
    //         $nonBillableTask->save();

    //         // Assign the NON-BILLABLE task to the same employees
    //         foreach ($request->employee_id as $employee_id) {
    //             $nonBillableAssign = new TaskAssign();
    //             $nonBillableAssign->task_id = $nonBillableTask->id;
    //             $nonBillableAssign->employee_id = $employee_id;
    //             $nonBillableAssign->project_id = $nonBillableTask->project_id;
    //             $nonBillableAssign->employee_hours = 0; // No hours initially assigned
    //             $nonBillableAssign->save();
    //         }
    //     }

    //     return redirect('projects-task')->with('project', 'Project created successfully, including NON-BILLABLE task.');
    // }


    public function Taskedit(Project $project, $id)
    {
        $project = Task::with('assignments.employee')->findOrFail($id);
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $projects = Project::all();
        $employees = User::all();
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/task-edit', [
            'project' => $project,
            'employees' => $employees,
            'projects' => $projects,
            'user' => $user,
            'user_type' => $user_type,
            'notif' => $notif,
        ]);
    }

    public function Taskupdate(Request $request, $id)
    {
        // dd($request->all());
        $task = Task::findOrFail($id);

        // Update task properties
        $task->task_name = $request->task_name;
        $task->estimate_hours = $request->estimate_hours;
        $task->status = $request->status;
        // $task->project_id = $request->project_id;
        $task->sdate = $request->sdate;
        $task->edate = $request->edate;
        $task->priority = $request->priority;
        $task->save();
        Notification::send(User::whereIn('id', $request->employee_id)->get(), new NotificationsTaskAssign($task->task_name, 'New Task Assigned'));
        // Update task assignments
        // First, delete the existing assignments
        TaskAssign::where('task_id', $id)->delete();

        // Then, create new assignments based on the updated employee IDs
        foreach ($request->employee_id as $employee_id) {
            $assign = new TaskAssign();
            $assign->task_id = $task->id;
            $assign->employee_id = $employee_id;
            $assign->employee_hours = $request->employee_hours[$employee_id] ?? 0;
            $assign->save();
            //            dd($assign);
        }
        return redirect('projects-task');
    }
    public function Taskdestroy($id)
    {
        $project = Task::findOrFail($id);
        $project->delete();
        return redirect()->route('projects')->with('success', 'Task and related task assign deleted successfully.');
    }

    public function Tskcategory()
    {
        $taskcategory = TaskCategory::all();
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('projects/taskCategory', compact('taskcategory', 'user', 'user_type', 'notif'));
    }

    public function TaskcategoryStore(Request $request)
    {
        // dd($request->all());
        // dd($request->all());
        $taskcategory = new TaskCategory();
        $taskcategory->tname = $request->tname;
        $taskcategory->save();
        return back()->with('taskcategory', 'Task Category created successfully');
    }
    public function TaskcategoryEdit(TaskCategory $taskcategory, $id) {}
    public function TaskcategoryUpdate(Request $request, $id)
    {
        $taskcategory =  TaskCategory::find($id);
        $taskcategory->tname = $request->tname;
        $taskcategory->save();
        return back()->with('taskcategory', 'Task Category Updated successfully');
    }
    public function TaskcategoryDestroy($id)
    {
        $taskcategory = TaskCategory::find($id);
        $taskcategory->delete();
        return back()->with('taskcategory', 'Task Category deleted successfully');
    }

    public function Taskassign()
    {

        $userss = Auth::user();

        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $usr = Auth::user()->type;

        if (Auth::user()->can('view_assign')) {
            // If the user has permission to view all tasks, show all tasks
            $projects = Task::join('projects', 'projects.id', '=', 'tasks.project_id')
                ->join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
                ->join('users', 'users.id', '=', 'task_assigns.employee_id')
                ->select('tasks.task_name', 'projects.title', 'tasks.status', 'tasks.id', 'users.name', 'task_assigns.employee_hours')
                ->get();
        } else {
            // If the user can only view their own tasks, filter by the logged-in user's ID
            $projects = Task::join('projects', 'projects.id', '=', 'tasks.project_id')
                ->join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
                ->join('users', 'users.id', '=', 'task_assigns.employee_id')
                ->select('tasks.task_name', 'projects.title', 'tasks.status', 'tasks.id', 'users.name', 'task_assigns.employee_hours')
                ->get();
        }

        $status = TaskStatus::all();
        $notif = Auth::user()->notifications;
        // dd($projects);
        return Inertia::render('projects/taskassign', compact('projects', 'user', 'user_type', 'notif', 'status'));
    }

    public function changeStatus(Request $request, $id)
    {
        // Validate the request data
        // dd($request->all());

        // Find the task by ID
        $task = Task::find($id);

        if ($task) {
            // Assign the validated status value to the task
            $task->status = $request->status;
            $task->save();

            // Return a success response
            return back();
        } else {
            // Return an error if the task is not found
            return response()->json(['message' => 'Task not found'], 404);
        }
    }

    public function TaskStatus()
    {
        $status = TaskStatus::all();
        $userss = Auth::user();

        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $usr = Auth::user()->type;
        return Inertia::render('projects/taskStatus', compact('status', 'userss', 'user', 'user_type', 'usr'));
    }
    public function taskstatusstore(Request $request)
    {
        $request->validate([
            'status_name' => 'required|string|max:255',
        ]);

        TaskStatus::create([
            'status_name' => $request->status_name,
        ]);

        return redirect()->back()->with('success', 'Task Status created successfully.');
    }

    public function taskstatuupdate(Request $request, $id)
    {
        $request->validate([
            'status_name' => 'required|string|max:255',
        ]);

        $status = TaskStatus::findOrFail($id);
        $status->update([
            'status_name' => $request->status_name,
        ]);

        return redirect()->back()->with('success', 'Task Status updated successfully.');
    }

    public function taskstatudestroy($id)
    {
        $status = TaskStatus::findOrFail($id);
        $status->delete();

        return redirect()->back()->with('success', 'Task Status deleted successfully.');
    }

    public function getTotalTaskHours($projectId)
    {
        // Fetch the total hours for all tasks under the project
        $totalHours = Task::where('project_id', $projectId)->sum('estimate_hours');

        return response()->json([
            'total_hours' => $totalHours,
        ]);
    }

    public function taskcalendar(){
        $events = Project::join('tasks','tasks.project_id','=','projects.id')->get();
       return Inertia::render('projects/taskcalendar',[
        'events'=>$events
       ]);
    }
}
