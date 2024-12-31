<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function supplier()
    {
        $suppliers = Supplier::all();
        return Inertia::render('accounts/supplier/index', compact('suppliers'));
    }




    // Store a newly created supplier
    public function supplierstore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email',
            'address' => 'required|string',
            'phone' => 'required|string',
        ]);

        Supplier::create($request->all());

        return back()->with('success', 'Supplier created successfully.');
    }

    // Show the form for editing a supplier
    public function edit(Supplier $supplier)
    {
        return view('suppliers.edit', compact('supplier'));
    }

    // Update an existing supplier
    public function supplierupdate(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email,' . $supplier->id,
            'address' => 'required|string',
            'phone' => 'required|string',
        ]);

        $supplier->update($request->all());

        return back()->with('success', 'Supplier updated successfully.');
    }

    // Delete a supplier
    public function supplierdestroy(Supplier $supplier)
    {
        $supplier->delete();

        return back()->with('success', 'Supplier deleted successfully.');
    }
}
