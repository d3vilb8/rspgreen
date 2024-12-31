<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Branch;
use App\Models\Payslip;
use App\Models\Project;
use App\Models\Employee;
use App\Models\Timesheet;
use App\Models\Department;
use App\Exports\ExcelExport;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Get query parameters
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $projectTitle = $request->query('projectTitle');
        $employeeName = $request->query('employeeName');
        $taskName = $request->query('taskName'); // Get task name from query parameters
        // Set default date range to today if not provided
        if (!$startDate || !$endDate) {
            $startDate = now()->startOfDay()->toDateString(); // Start of today
            $endDate = now()->endOfDay()->toDateString(); // End of today
        }

        // Build the query
        $query = Timesheet::join('users', 'users.id', '=', 'timesheets.user_id')
            ->join('projects', 'projects.id', '=', 'timesheets.project_id')
            ->join('tasks', 'tasks.id', '=', 'timesheets.task_id')
            ->join('task_assigns', 'tasks.id', '=', 'task_assigns.task_id')
            ->select(
                'tasks.task_name',
                'projects.title',
                'timesheets.date',
                'timesheets.time_number',
                'timesheets.description',
                'users.name',
                'task_assigns.employee_hours'
            )
            ->whereBetween('timesheets.date', [$startDate, $endDate]);

        // Apply project title filter if provided
        if ($projectTitle) {
            $query->where('projects.title', 'like', '%' . $projectTitle . '%');
        }

        // Apply employee name filter if provided
        if ($employeeName) {
            $query->where('users.name', 'like', '%' . $employeeName . '%');
        }
        if ($taskName) {
            $query->where('tasks.task_name', 'like', '%' . $taskName . '%');
        }
        // Execute the query and get the results
        $timesheets = $query->distinct()->get();

        // Return the results as JSON
        return response()->json($timesheets);
    }

    public function reportView()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $usrrr = Auth::user()->id;
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name')->get();
        $project = Project::all();
        $notif = Auth::user()->notifications;
        $tasks = Task::select('task_name')
            ->groupBy('task_name')
            ->get();
        //dd($tasks);
        return Inertia::render('reports/index', compact('employee', 'project', 'user', 'user_type', 'usrrr', 'notif', 'tasks'));
    }
    public function export(Request $request)
    {
        $sheets = new ExcelExport(json_decode($request->timesheets));
        return Excel::download($sheets, 'report.xlsx');
    }

    public function AssignEmployee()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $usrrr = Auth::user()->id;
        $employee = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.name')->get();
        $project = Project::all();
        $notif = Auth::user()->notifications;
        $tasks = Task::select('task_name')
            ->groupBy('task_name')
            ->get();
        return Inertia::render('reports/employeehours', compact('project', 'user', 'user_type', 'usrrr', 'employee', 'tasks', 'notif'));
    }

    public function payroll()
    {
        $employees = Salary::join('employees', 'employees.id', '=', 'salaries.employee_id')->join('users', 'users.id', '=', 'employees.user_id')->select('employees.id', 'users.name', 'employees.salary', 'employees.salary_type', 'salaries.status')->get();

        return Inertia::render('reports/payroll', [
            'employees' => $employees,
        ]);
    }

    public function payrollStore($id){
       $up = Salary::where('employee_id',$id)->first();
    //    dd($up);
       $up->status = "Approved";
       $up->save();
       return \redirect()->back();
    }
}
