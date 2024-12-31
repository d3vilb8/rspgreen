<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\TblExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incomes = Income::join('users', 'users.id', '=', 'incomes.customer_id')
            ->select('users.name', 'incomes.status', 'incomes.id', 'incomes.date', 'incomes.main_label')->get();
        return Inertia::render('Income/incomeindex', compact('incomes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = \DB::table('users')->join('clients', 'users.id', '=', 'clients.user_id')->select('users.name', 'users.id')->get();
        // dd($customers);
        return Inertia::render('Income/index', compact('customers'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // Validate the incoming request data
        $validatedData = $request->validate([
            'customer_id' => 'required|integer',
            'status' => 'required|string',
            'date' => 'required|date',
            'main_label' => 'required|string',
            'income_entries' => 'required|array',
            'income_entries.*.amount' => 'required|numeric',
            'income_entries.*.label' => 'required|string',
        ]);

        // Prepare the data for storage
        $dataToStore = [
            'customer_id' => $validatedData['customer_id'],
            'status' => $validatedData['status'],
            'date' => $validatedData['date'],
            'main_label' => $validatedData['main_label'],
            'income_entries' => json_encode($validatedData['income_entries']), // Convert to JSON
        ];

        // Store the data in the database
        Income::create($dataToStore);

        // Redirect or return response as needed
        return redirect('income')->with('success', 'Income entries stored successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $income = Income::findOrFail($id);
        $customers = \DB::table('users')->join('clients', 'users.id', '=', 'clients.user_id')->select('users.name', 'users.id')->get();
        // Decode the JSON stored in income_entries for easier handling in the frontend
        $initialData = $income->toArray();
        $initialData['income_entries'] = json_decode($initialData['income_entries'], true);

        return inertia('Income/index', [
            'initialData' => $initialData,
            'customers' => $customers,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the income entry by id
        $income = Income::findOrFail($id);

        // Delete the income entry
        $income->delete();

        // Redirect or return response as needed
        return redirect('income')->with('success', 'Income entry deleted successfully.');
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'customer_id' => 'required|integer',
            'status' => 'required|string',
            'date' => 'required|date',
            'main_label' => 'required|string',
            'income_entries' => 'required|array',
            'income_entries.*.amount' => 'required|numeric',
            'income_entries.*.label' => 'required|string',
        ]);

        // Find the income entry by id
        $income = Income::findOrFail($id);

        // Update the data
        $income->update([
            'customer_id' => $validatedData['customer_id'],
            'status' => $validatedData['status'],
            'date' => $validatedData['date'],
            'main_label' => $validatedData['main_label'],
            'income_entries' => json_encode($validatedData['income_entries']), // Convert to JSON
        ]);

        // Redirect or return response as needed
        return redirect('income')->with('success', 'Income entry updated successfully.');
    }



    public function tblexpensecreate()
    {
        $customers = \DB::table('users')->join('clients', 'users.id', '=', 'clients.user_id')->select('users.name', 'users.id')->get();
        // dd($customers);
        return Inertia::render('Income/expensecreate', compact('customers'));
    }

    public function tblexpensestore(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            // 'customer_id' => 'required|integer',
            'status' => 'required|string',
            'date' => 'required|date',
            'main_label' => 'required|string',
            'income_entries' => 'required|array',
            'income_entries.*.amount' => 'required|numeric',
            'income_entries.*.label' => 'required|string',
        ]);

        // Prepare the data for storage
        $dataToStore = [
            // 'customer_id' => $validatedData['customer_id'],
            'status' => $validatedData['status'],
            'date' => $validatedData['date'],
            'main_label' => $validatedData['main_label'],
            'income_entries' => json_encode($validatedData['income_entries']), // Convert to JSON
        ];

        // Store the data in the database
        TblExpense::create($dataToStore);

        // Redirect or return response as needed
        return redirect('amc-expense-index')->with('success', 'Income entries stored successfully.');
    }



    public function tblexpenseedit($id)
    {
        $income = TblExpense::findOrFail($id);
        $customers = \DB::table('users')->join('clients', 'users.id', '=', 'clients.user_id')->select('users.name', 'users.id')->get();
        // Decode the JSON stored in income_entries for easier handling in the frontend
        $initialData = $income->toArray();
        $initialData['income_entries'] = json_decode($initialData['income_entries'], true);

        return inertia('Income/expensecreate', [
            'initialData' => $initialData,
            'customers' => $customers,
        ]);
    }

    public function tblexpenseupdate(Request $request, $id)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            // 'customer_id' => 'required|integer',
            'status' => 'required|string',
            'date' => 'required|date',
            'main_label' => 'required|string',
            'income_entries' => 'required|array',
            'income_entries.*.amount' => 'required|numeric',
            'income_entries.*.label' => 'required|string',
        ]);

        // Find the income entry by id
        $income = TblExpense::findOrFail($id);

        // Update the data
        $income->update([
            // 'customer_id' => $validatedData['customer_id'],
            'status' => $validatedData['status'],
            'date' => $validatedData['date'],
            'main_label' => $validatedData['main_label'],
            'income_entries' => json_encode($validatedData['income_entries']), // Convert to JSON
        ]);

        // Redirect or return response as needed
        return redirect('amc-expense-index')->with('success', 'Income entry updated successfully.');
    }

    public function tblindex()
    {
        $incomes = TblExpense::all();
        return Inertia::render('Income/expensetld', compact('incomes'));
    }

    public function tblexpensedelete($id)
    {
        // Find the income entry by id
        $income = TblExpense::findOrFail($id);

        // Delete the income entry
        $income->delete();

        // Redirect or return response as needed
        return redirect('amc-expense-index')->with('success', 'Expense entry deleted successfully.');
    }
}
