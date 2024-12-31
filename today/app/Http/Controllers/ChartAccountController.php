<?php

namespace App\Http\Controllers;

use App\Models\AccountCategory;
use App\Models\AccountType;
use App\Models\ChartAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChartAccountController extends Controller
{
    // Display the list of chart accounts
    public function index()
    {
        $chartAccounts = ChartAccount::join('account_categories', 'account_categories.id', '=', 'chart_accounts.category_id')
            ->join('account_types', 'account_types.id', '=', 'chart_accounts.type_id')
            ->select(
                'chart_accounts.id',
                'chart_accounts.code',
                'chart_accounts.name as caname',
                'account_categories.name as acname',
                'account_types.name as atname',
                'chart_accounts.status'
            )
            ->get();

        // Group accounts by category
        $accountGroups = $chartAccounts->groupBy('atname')->map(function ($accounts, $category) {
            return [
                'title' => $category,
                'accounts' => $accounts->map(function ($account) {
                    return [
                        'code' => $account->code,
                        'id' => $account->id,
                        'name' => $account->caname,
                        'type' => $account->acname,
                        'status' => $account->status ? 'Enabled' : 'Disabled', // Assuming 'status' is a boolean
                    ];
                })->toArray(),
            ];
        })->values()->toArray();

        $category = AccountCategory::all();
        $type = AccountType::all();


        return Inertia::render('accounts/chart_accounts', compact('chartAccounts', 'category', 'type', 'accountGroups'));
    }

    // Show form for creating a new chart account
    public function create()
    {
        return view('chart_accounts.create');
    }

    // Store a new chart account
    public function store(Request $request)
    {
        // dd($request->all());
        // $request->validate([
        //     'name' => 'required|string',
        //     'code' => 'required|string|unique:chart_accounts',
        //     'type_id' => 'required|integer',
        //     'category_id' => 'required|integer',
        //     'status' => 'required|integer',
        //     // 'description' => 'nullable|string'
        // ]);

        ChartAccount::create($request->all());
        return back()->with('success', 'Chart Account created successfully.');
    }

    // Show form for editing a chart account
    public function edit(ChartAccount $chartAccount)
    {
        return view('chart_accounts.edit', compact('chartAccount'));
    }

    // Update the chart account
    public function update(Request $request, ChartAccount $chartAccount)
    {
        // dd($request->all());
        // $request->validate([
        //     'name' => 'required|string',
        //     'code' => 'required|string|unique:chart_accounts,code,',
        //     'type_id' => 'required|integer',
        //     'category_id' => 'required|integer',
        //     'status' => 'required|integer',
        //     'description' => 'nullable|string'
        // ]);

        $chartAccount->update($request->all());
        return back()->with('success', 'Chart Account updated successfully.');
    }

    // Delete the chart account
    public function destroy(ChartAccount $chartAccount)
    {
        $chartAccount->delete();
        return back()->with('success', 'Chart Account deleted successfully.');
    }
}
