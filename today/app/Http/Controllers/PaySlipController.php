<?php

namespace App\Http\Controllers;

use App\Models\Payslip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaySlipController extends Controller
{
    public function index()
    {
        $payslips = Payslip::all();
        return Inertia::render('employee/payslip', [
            'payslips' => $payslips,
        ]);
    }

    // Show form to create a new payslip
    public function create()
    {
        return Inertia::render('Payslips/Create');
    }

    // Store a new payslip
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:payslips,name',
        ]);

        Payslip::create($request->all());
        return redirect()->route('payslips.index')->with('success', 'Payslip created successfully.');
    }

    // Show form to edit a payslip
    public function edit(Payslip $payslip)
    {
        return Inertia::render('Payslips/Edit', [
            'payslip' => $payslip,
        ]);
    }

    // Update an existing payslip
    public function update(Request $request, Payslip $payslip)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:payslips,name,' . $payslip->id,
        ]);

        $payslip->update($request->all());
        return redirect()->route('payslips.index')->with('success', 'Payslip updated successfully.');
    }

    // Delete a payslip
    public function destroy(Payslip $payslip)
    {
        $payslip->delete();
        return redirect()->route('payslips.index')->with('success', 'Payslip deleted successfully.');
    }
}
