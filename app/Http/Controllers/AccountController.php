<?php

namespace App\Http\Controllers;

use App\Models\AccountCategory;
use App\Models\AccountType;
use App\Models\Tax;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function tax()
    {

        $tax = Tax::all();
        return Inertia::render('accounts/tax', compact('tax'));
    }



    // Show the form for creating a new tax
    // public function create()
    // {
    //     return view('taxes.create');
    // }

    // Store a newly created tax in the database
    public function taxstore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'percent' => 'required|numeric',
        ]);

        Tax::create($request->all());

        return back()->with('success', 'Tax created successfully.');
    }

    // Show the form for editing an existing tax


    // Update the tax in the database
    public function taxupdate(Request $request, Tax $tax)
    {
        // dd($request->route('tax'));
        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'amount' => 'required|numeric',
        // ]);

        $tax->update($request->only(['name', 'amount']));

        return back()->with('success', 'Tax updated successfully.');
    }


    // Delete a tax from the database
    public function taxdestroy(Tax $tax)
    {
        $tax->delete();

        return back()->with('success', 'Tax deleted successfully.');
    }

    public function AccountCategory()
    {
        $category = AccountCategory::join('account_types', 'account_types.id', '=', 'account_categories.type_id')
            ->select('account_categories.name as cname', 'account_types.name as tname', 'account_categories.id')->get();
        $type = AccountType::all();
        return Inertia::render('accounts/category', compact('category', 'type'));
    }

    public function Accountstore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        AccountCategory::create($request->all());

        return back()
            ->with('success', 'Account Category created successfully.');
    }

    public function Accountdestroy(AccountCategory $accountCategory)
    {
        $accountCategory->delete();

        return back()
            ->with('success', 'Account Category deleted successfully.');
    }

    public function Accountupdate(Request $request, AccountCategory $accountCategory)
    {
        // dd($accountCategory);
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $accountCategory->update($request->all());

        return back()
            ->with('success', 'Account Category updated successfully.');
    }

    public function unit()
    {
        $unit = Unit::all();
        return Inertia::render('accounts/unit', compact('unit'));
    }
    public function unitstore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Unit::create($request->only('name'));

        return back()
            ->with('success', 'Unit created successfully.');
    }


    public function unitupdate(Request $request, Unit $unit)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $unit->update($request->only('name'));

        return back()
            ->with('success', 'Unit updated successfully.');
    }

    // Delete a unit
    public function unitdestroy(Unit $unit)
    {
        $unit->delete();

        return back()
            ->with('success', 'Unit deleted successfully.');
    }

    public function accountType()
    {
        $accountTypes = AccountType::all();
        return Inertia::render('accounts/accountTypes', compact('accountTypes'));
    }


    // public function index()
    // {
    //     $accountTypes = AccountType::all();
    //     return view('account_types.index', compact('accountTypes'));
    // }

    // Show the form for creating a new account type


    // Store a newly created account type in the database
    public function accountTypesstore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        AccountType::create($request->only('name'));

        return back()
            ->with('success', 'Account Type created successfully.');
    }

    // Show the form for editing the specified account type

    // Update the specified account type in the database
    public function accountTypesupdate(Request $request, AccountType $accountType)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $accountType->update($request->only('name'));

        return back()
            ->with('success', 'Account Type updated successfully.');
    }

    // Delete the specified account type from the database
    public function accountTypesdestroy(AccountType $accountType)
    {
        $accountType->delete();

        return back()
            ->with('success', 'Account Type deleted successfully.');
    }
}
