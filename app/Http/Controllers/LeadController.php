<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Employee;
use App\Models\LeadStage;
use App\Models\LeadSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeadController extends Controller
{
    public function index()
    {
        // Fetch the leads
        $leads = Lead::get();
        $taskNames = DB::table('tasks')->select('task_name', 'rate')->get();
        // dd($taskNames);
        // Get the assignEmp data outside the map
        $assignEmp = User::join('employees', 'employees.user_id', '=', 'users.id')
            ->select('users.id', 'users.name')
            ->get();

            // $tasks = Project::with(['tasks.users' => function ($query) {
            //     $query->withPivot('employee_hours');
            // }])->get();
        // }else{
        //     // $tasks = 
        // }
            //    dd($tasks);
        $projects = Project::all();
        // dd($projects);

    
        // Update each lead with the client_name
        $leads = $leads->map(function ($ld) {
            $ld->client_name = User::findOrFail($ld->client_id)->name;
            return $ld;
        });
    
        // Return the view with the leads and assignEmp data
        return Inertia::render('lead/index', ['leads' => $leads, 'assignEmp' => $assignEmp,'projects' => $projects]);
    }
    
    public function create()
    {
        $clients = User::join('clients', 'clients.user_id', '=', 'users.id')
            ->select('users.id', 'users.name')
            ->get();
          
         $assignEmp = User::join('employees', 'employees.user_id', '=', 'users.id')
         
        ->select('users.id', 'users.name') 
        ->get();
        // dd($assignEmp);
        $leadSources = LeadSource::all();
        $projects = Project::all();
        $taskNames = DB::table('tasks')->select('task_name', 'rate')->get();
        // dd($taskNames);
        $leadStage = LeadStage::all();
        return Inertia::render('lead/create', ['clients' => $clients,'leadSources' =>$leadSources,'leadStage' =>$leadStage,'taskNames' =>$taskNames]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "client_id" => "required",
            "email_address" => "required|email|unique:leads,email_address",
            "phone_number" => "required|min:10",
            "source" => "required",
            "status" => "required", 
            'lead_stage' => "required",
            'comment' => "required",
            // 'assign' => "required",
        ]);

        Lead::create([
            'client_id' => $validated['client_id'],
            'email_address' => $validated['email_address'],
            'phone_number' => $validated['phone_number'],
            'source' => $validated['source'],
            'status' => $validated['status'], 
            'lead_stage' => $validated['lead_stage'],
            'comment' => $validated['comment'],
            // 'assign' => $validated['assign'],
        ]);

        return redirect()->route('lead.index');
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();
        return redirect()->route('lead.index');
    }

    public function edit($id)
    {
        $clients = User::join('clients', 'clients.user_id', '=', 'users.id')
            ->select('users.id', 'users.name')
            ->get();
        //       $assignEmp = User::join('employees', 'employees.user_id', '=', 'users.id')
        // ->select('users.id', 'users.name', 'employees.id as employee_id', 'employees.position') 
        // ->get();
        // dd($assignEmp);
        $lead = Lead::findOrFail($id);
        return Inertia::render('lead/edit', [
            'lead' => $lead,
            'clients' => $clients
        ]);
    }

    public function viewDetails($id)
    {
        $clients = User::join('clients', 'clients.user_id', '=', 'users.id')
        ->select('users.id', 'users.name')
        ->get();
          $assignEmp = User::join('employees', 'employees.user_id', '=', 'users.id')
    ->select('users.id', 'users.name') 
    ->get();
    // dd($assignEmp);
    $lead = Lead::findOrFail($id);
    return Inertia::render('lead/view', [
        'lead' => $lead,
        'clients' => $clients,
        'assignEmp' => $assignEmp
    ]);

    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "client_id" => "required",
            "email_address" => "required|email|unique:leads,email_address," . $id,
            "phone_number" => "required|min:10",
            "source" => "required",
            "status" => "required", 
            'lead_stage' => "required",
            'comment' => "required",
            // 'assign' => "required"
        ]);

        $lead = Lead::findOrFail($id);
        $lead->update([
            "client_id" => $validated['client_id'],
            "email_address" => $validated['email_address'],
            "phone_number" => $validated['phone_number'],
            "source" => $validated['source'],
            "status" => $validated['status'], 
            "lead_stage" => $validated['lead_stage'],
            "comment" => $validated['comment'],
            // "assign" => $validated['assign'],
        ]);

        return redirect()->route('lead.index');
    }
    public function assign(Request $request)
{
    
    $validated = $request->validate([
        'leadId' => 'required',
        'empId' => 'required',
    ]);

    $lead = Lead::findOrFail($validated['leadId']);

  
    $lead->update([
        'assigned_emp_id' => $validated['empId'], 
    ]);

    return response()->json([
        'message' => 'Employee assigned successfully',
        'lead' => $lead,
    ], 200);
}

}
