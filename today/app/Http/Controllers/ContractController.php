<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    // Display all contracts
    public function index()
    {
        $contracts = Contract::all(); // Retrieve all contracts
        return Inertia::render('Contract/index', ['contracts' => $contracts]);
    }

    // Show form to create a new contract
    public function create()
    {
        return Inertia::render('Contract/create');
    }

    // Store a new contract
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            "contractor_name" => "required",
            "email_address" => "required|email|unique:contracts,email_address",
            "phone_number" => "required|min:10",
            "contractor_type" => "required",
            "contract_value" => "required|numeric",
            "start_date" => "required|date",
            "end_date" => "required|date",
            "description" => "nullable|string"
        ]);

        // Create a new contract record
        Contract::create([
            'contractor_name' => $validated['contractor_name'],
            'email_address' => $validated['email_address'],
            'phone_number' => $validated['phone_number'],
            'contractor_type' => $validated['contractor_type'],
            'contract_value' => $validated['contract_value'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'description' => $validated['description'] ?? null
        ]);

        return redirect()->route('contract.index');
    }

    // Show form to edit an existing contract
    public function edit($id)
    {
        $contract = Contract::findOrFail($id); // Find the contract by ID
        return Inertia::render('Contract/edit', ['contract' => $contract]);
    }

   
    public function update(Request $request, $id)
    {
        
        $validated = $request->validate([
            "contractor_name" => "required",
            "email_address" => "required|email|unique:contracts,email_address," . $id,
            "phone_number" => "required|min:10",
            "contractor_type" => "required",
            "contract_value" => "required|numeric",
            "start_date" => "required|date",
            "end_date" => "required|date",
            "description" => "nullable|string"
        ]);

        
        $contract = Contract::findOrFail($id);
        $contract->update([
            'contractor_name' => $validated['contractor_name'],
            'email_address' => $validated['email_address'],
            'phone_number' => $validated['phone_number'],
            'contractor_type' => $validated['contractor_type'],
            'contract_value' => $validated['contract_value'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'description' => $validated['description'] ?? null
        ]);

        return redirect()->route('contract.index');
    }


    public function destroy($id)
    {
        Contract::findOrFail($id)->delete();
        return redirect()->route('contract.index');
    }
}
