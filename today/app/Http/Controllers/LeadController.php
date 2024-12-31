<?php
namespace App\Http\Controllers;
use App\Models\Lead;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        $leads=Lead::get();
        $leads = $leads->map(function($ld){
            $ld->client_name = User::findOrFail($ld->client_id)->name;
            return $ld;
        });

        return Inertia::render('lead/index',['leads'=>$leads]);
    }

    public function create()
    {
       $clients = User::join('clients','clients.user_id','=','users.id')->select('users.id','users.name')->get();
        return Inertia::render('lead/create',['clients'=>$clients]);
    }

    // Store a new lead
    public function store(Request $request)
    {
        $validated = $request->validate([
            "client_id" => "required",
            "email_address" => "required|email|unique:leads,email_address",
            "phone_number" => "required|min:10",
            "source" => "required",
            'lead_for' => "required",
            'lead_stage' => "required",
            'comment' => "required"
        ]);

        Lead::create([
            'client_id' => $validated['client_id'],
            'email_address' => $validated['email_address'],
            'phone_number' => $validated['phone_number'],
            'source' => $validated['source'],
            'lead_for' => $validated['lead_for'],
            'lead_stage' => $validated['lead_stage'],
            'comment' => $validated['comment']
        ]);
        return redirect()->route('lead.index');   
    }
    public function destroy($id)
    {
        // dd($id);
        Lead::findOrFail($id)->delete();
        return redirect()->route('lead.index');
        
    }

    public function edit($id)
    {
        $clients = User::join('clients','clients.user_id','=','users.id')->select('users.id','users.name')->get();
        $lead = Lead::findOrFail($id);
        return Inertia::render('lead/edit', [
            'lead' => $lead,'clients'=>$clients
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "client_id" => "required",
            "email_address" => "required|email|unique:leads,email_address," . $id,
            "phone_number" => "required|min:10",
            "source" => "required",
            'lead_for' => "required",
            'lead_stage' => "required",
            'comment' => "required"
        ]);

        $lead = Lead::findOrFail($id);
        $lead->update([
            "client_id" => $validated['client_id'],
            "email_address" => $validated['email_address'],
            "phone_number" => $validated['phone_number'],
            "source" => $validated['source'],
            "lead_for" => $validated['lead_for'],
            "lead_stage" => $validated['lead_stage'],
            "comment" => $validated['comment']
        ]);

        return redirect()->route('lead.index');
    }
}
