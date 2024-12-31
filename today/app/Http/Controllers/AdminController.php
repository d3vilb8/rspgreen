<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Holiday;
use App\Models\Project;
use App\Models\Employee;
use App\Models\Timesheet;
use Illuminate\Http\Request;
use App\Models\LeaveManagement;
use App\Models\TaskAssign;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskAssign as NotificationsTaskAssign;

class AdminController extends Controller
{
    public function index()
    {
        $user = Auth::user()->name;

        return Inertia::render('Home', compact('user'));
    }

    public function Dashboard()
    {
        if (Auth::user()->can('view_assign')) {
            // If the user has permission to view all tasks, show all tasks
            $projects = Task::join('projects', 'projects.id', '=', 'tasks.project_id')
                ->join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
                ->join('users', 'users.id', '=', 'task_assigns.employee_id')
                ->select('tasks.task_name', 'projects.title', 'tasks.status', 'tasks.id', 'users.name')
                ->get();
        } else {
            // If the user can only view their own tasks, filter by the logged-in user's ID
            $projects = Task::join('projects', 'projects.id', '=', 'tasks.project_id')
                ->join('task_assigns', 'task_assigns.task_id', '=', 'tasks.id')
                ->join('users', 'users.id', '=', 'task_assigns.employee_id')
                ->select('tasks.task_name', 'projects.title', 'tasks.status', 'tasks.id')
                ->where('task_assigns.employee_id', Auth::user()->id)
                ->get();
        }

        if (Auth::user()->id === 1) {
            $query = Timesheet::join('users', 'users.id', '=', 'timesheets.user_id')
                ->join('projects', 'projects.id', '=', 'timesheets.project_id')
                ->join('tasks', 'tasks.id', '=', 'timesheets.task_id')
                ->join('task_assigns', function ($join) {
                    $join->on('task_assigns.employee_id', '=', 'users.id')
                        ->on('task_assigns.task_id', '=', 'tasks.id');
                })
                ->select(
                    'projects.title',
                    'tasks.task_name',
                    'users.name',
                    DB::raw('SUM(timesheets.time_number) as total_time_number'), // Sum of time_number
                    'task_assigns.employee_hours'
                )
                // ->where('users.id', Auth::user()->id)
                ->groupBy('projects.title', 'tasks.task_name', 'users.name', 'task_assigns.employee_hours') // Group by project, task, and user
                ->get();
        } else {
            $query = Timesheet::join('users', 'users.id', '=', 'timesheets.user_id')
                // ->join('projects', 'projects.id', '=', 'timesheets.project_id')
                ->join('tasks', 'tasks.id', '=', 'timesheets.task_id')
                ->join('task_assigns', function ($join) {
                    $join->on('task_assigns.employee_id', '=', 'users.id')
                        ->on('task_assigns.task_id', '=', 'tasks.id');
                })
                ->select(
                    
                    'tasks.task_name',
                    'users.name',
                    DB::raw('SUM(timesheets.time_number) as total_time_number'), // Sum of time_number
                    'task_assigns.employee_hours'
                )
                ->where('users.id', Auth::user()->id)
                ->groupBy( 'tasks.task_name', 'users.name', 'task_assigns.employee_hours') // Group by project, task, and user
                ->get();
        }



        $usrrr = Auth::user()->id;
        // dd($usrrr);
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $projectsss = Project::count();
        $taskss = Task::count();
        $holidays = Holiday::count();
        $emp = Employee::count();
        $leave =
            LeaveManagement::where('employee_id', Auth::id())->count();;
        $notif = Auth::user()->notifications;
        // $assin = Project::with(['tasks.users.timesheets'])->get();
        //        $assin = Project::with(['tasks.users.timesheets'])->get();
        //        $assin->each(function ($project) {
        //            $project->tasks->each(function ($task) {
        //                // Ensure estimate_time is being set correctly
        //                $task->estimate_time = $task->estimate_time; // This should come from your database
        //                $task->users->each(function ($user) use ($task) {
        //                    $user->time_number_sum = $user->timesheets
        //                        ->where('task_id', $task->id)
        //                        ->sum('time_number');
        //                });
        //            });
        //        });
        $assin = Project::with(['tasks.users.timesheets'])->get();

        // Iterate over each project
        $assin->each(function ($project) {
            // Calculate the total estimated hours of all tasks for the project
            $totalTaskEstimateHours = $project->tasks->sum('estimate_hours');

            // Check if the total estimated hours of tasks exceed the project's estimate time
            if ($totalTaskEstimateHours > $project->estimate_time) {
                // Set a flag or an error message indicating the project's tasks exceed its estimate time
                $project->error_message = "Total task estimate hours ($totalTaskEstimateHours hours) exceed the project estimate time ($project->estimate_time hours).";
            } else {
                $project->error_message = null; // No error
            }

            // Process each task for additional logic if needed
            $project->tasks->each(function ($task) {
                // Ensure estimate_time is being retrieved from the database
                $task->estimate_time = $task->estimate_time;

                // Calculate total time logged by each user for the task
                $task->users->each(function ($user) use ($task) {
                    $user->time_number_sum = $user->timesheets
                        ->where('task_id', $task->id)
                        ->sum('time_number');
                });
            });
        });


        $emp = User::all();
        $totalAssignedHours = User::join('employees', 'users.id', '=', 'employees.user_id')
            ->join('task_assigns', 'employees.id', '=', 'task_assigns.employee_id')
            ->selectRaw('SUM(task_assigns.employee_hours) as total_time_assigned')
            ->where('task_assigns.employee_id', Auth::user()->id)
            ->groupBy('users.id', 'employees.id')
            ->first();  // Fetches the first result with the sum


        $results = $totalAssignedHours ? $totalAssignedHours->total_time_assigned : 0;  // Handle case where no result is found

        $totalWorkingHours = Timesheet::join('users', 'users.id', '=', 'timesheets.user_id')
            ->join('projects', 'projects.id', '=', 'timesheets.project_id')
            ->join('tasks', 'tasks.id', '=', 'timesheets.task_id')
            ->join('task_assigns', function ($join) {
                $join->on('task_assigns.employee_id', '=', 'users.id')
                    ->on('task_assigns.task_id', '=', 'tasks.id');
            })
            ->where('users.id', Auth::user()->id)
            ->selectRaw('SUM(timesheets.time_number) as total_working_hours')  // Summing working hours
            ->first();  // Fetch the result

        $totalHours = $totalWorkingHours ? $totalWorkingHours->total_working_hours : 0;


        $projecteach = User::join('employees', 'users.id', '=', 'employees.user_id')
            ->join('task_assigns', 'employees.id', '=', 'task_assigns.employee_id')
            ->selectRaw('SUM(task_assigns.project_id)')
            ->groupBy('users.id', 'employees.id')
            ->where('task_assigns.employee_id', Auth::user()->id)
            ->count();
        //         dd($projecteach);
        $projs = Project::where('client_id',\auth()->user()->id)->get();
        return Inertia::render('admin/dashboard', compact('projs','projects', 'query', 'usrrr', 'user', 'user_type', 'projectsss', 'taskss', 'holidays', 'emp', 'leave', 'notif', 'assin', 'emp', 'results', 'projecteach', 'totalHours'));
    }

    public function uploadDoc(){
       return Inertia::render('admin/uploaddoc');
   }

   public function upld($id,Request $request){
    $file = $request->file('image');
    $name = Carbon::now().$file->getClientOriginalExtension();
    $file->move('/uploads/docs/',$name);
    DB::table('documents')->insert(['project_id'=>$id,'name'=>$name,'path'=>'/uploads/docs/']);
   }

    public function countProject()
    {
        $projects = Project::count();
        dd($projects);
        return response()->json($projects);
    }

    public function notif()
    {
        return Auth::user()->notifications;
    }
    // use Illuminate\Support\Facades\Auth;

    public function getUserNotificationsWithProject()
    {
        $user = Auth::user();

        $notifications = $user->notifications->map(function ($notification) {
            $data = $notification->data;
            $projectIds = [];
            $projects = Project::whereIn('id', $projectIds)->pluck('title', 'id');
            dd($projects);
            // Check if 'projectid' exists in the data array
            // $projectName = 'Project Not Found';
            if (isset($data['projectid'])) {
                $project = Project::find($data['projectid']);
                $projectName = $project ? $project->name : 'Project Not Found';
            }

            return [
                'id' => $notification->id,
                'message' => $data['message'] ?? 'No message available', // Handle missing message
                'project_name' => $projectName,
                'created_at' => $notification->created_at,
                'read_at' => $notification->read_at,
            ];
        });

        return response()->json($notifications);
    }


    public function markAsRead($notificationId)
    {
        $notification = Auth::user()->notifications()->find($notificationId);

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notification marked as read']);
    }
    public function updateEstimateHours(Request $request)
    {


        $task = Task::find($request['id']);

        // if (!$task) {
        //     \Log::error('Task not found:', ['id' => $request['id']]);
        //     return response()->json(['message' => 'Task not found!'], 404);
        // }

        $task->estimate_hours = $request['estimateHours'];
        $task->save();

        // \Log::info('Task updated:', $task);

        return back();
    }


    public function TaskAssignUpdate(Request $request, $id)
    {
        // dd($request->all());
        // Find the task by ID, or fail if not found
        $task = Task::findOrFail($id);

        // Send a notification to the users who are being assigned to the task
        Notification::send(
            User::whereIn('id', $request->employee_id)->get(),
            new NotificationsTaskAssign($task->task_name, 'New Task Assigned')
        );

        // Update task assignments
        // First, delete the existing assignments for this task
        TaskAssign::where('task_id', $id)->delete();

        // Assign the new set of employees to the task
        foreach ($request->employee_id as $employee_id) {
            $assign = new TaskAssign();
            $assign->task_id = $task->id;
            $assign->employee_id = $employee_id;
            $assign->save();
        }

        // Redirect back to the tasks page or wherever appropriate
        return redirect('dashboard')->with('success', 'Task assignments updated successfully.');
    }
    public function TotalTime()
    {
        $results = User::join('employees', 'users.id', '=', 'employees.user_id')
            ->join('task_assigns', 'employees.id', '=', 'task_assigns.employee_id')
            ->selectRaw('SUM(task_assigns.employee_hours) as total_time_assigned')
            ->groupBy('users.id', 'employees.id')
            ->where('task_assigns.employee_id', Auth::user()->id)
            ->first();
        dd($results);
    }
}
