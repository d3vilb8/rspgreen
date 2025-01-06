<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionController extends Controller
{
    public function index()
    {
        $commissions = Commission::all();


        return Inertia::render('', [
            'commissions' => $commissions,
        ]);
    }

    public function create()
    {

        return Inertia::render('salary/salary');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:Fixed,Percentage',
            'amount' => 'required|numeric',
        ]);

        Commission::create($request->only(['title', 'type', 'amount']));

        return redirect()->route('salary/salary')->with('success', 'Commission created successfully.');
    }

    public function show($id)
    {
        $commission = Commission::findOrFail($id);


        return Inertia::render('', [
            'commission' => $commission,
        ]);
    }

    public function edit($id)
    {
        $commission = Commission::findOrFail($id);


        return Inertia::render('', [
            'commission' => $commission,
        ]);
    }

    public function update(Request $request, $id)
    {
        $commission = Commission::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:Fixed,Percentage',
            'amount' => 'required|numeric',
        ]);

        $commission->update($request->only(['title', 'type', 'amount']));

        return redirect()->route('salary/salary')->with('success', 'Commission updated successfully.');
    }

    public function destroy($id)
    {
        $commission = Commission::findOrFail($id);
        $commission->delete();

        return redirect()->route('salary/salary')->with('success', 'Commission deleted successfully.');
    }
}
