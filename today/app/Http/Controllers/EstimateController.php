<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use App\Models\EstimateItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EstimateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {




        return Inertia::render('estimate/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'category_id' => 'required|exists:categories,id',
            'issue_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $proposal = Estimate::create([
            'customer_id' => $request->customer_id,
            'category_id' => $request->category_id,
            'proposal_number' => '#PROP' . str_pad(Estimate::count() + 1, 4, '0', STR_PAD_LEFT),
            'issue_date' => $request->issue_date,
            'subtotal' => 0,
            'discount' => 0,
            'tax' => 0,
            'total' => 0,
        ]);

        $subtotal = 0;
        foreach ($request->items as $itemData) {
            $amount = ($itemData['quantity'] * $itemData['price']) - $itemData['discount'];
            $amount += $amount * ($itemData['tax'] / 100);
            $subtotal += $amount;

            EstimateItem::create([
                'proposal_id' => $proposal->id,
                'item_name' => $itemData['item_name'],
                'quantity' => $itemData['quantity'],
                'price' => $itemData['price'],
                'discount' => $itemData['discount'],
                'tax' => $itemData['tax'],
                'amount' => $amount,
            ]);
        }

        $proposal->update([
            'subtotal' => $subtotal,
            'discount' => $request->discount ?? 0,
            'tax' => $request->tax ?? 0,
            'total' => $subtotal - $request->discount + $request->tax,
        ]);
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Estimate $estimate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Estimate $estimate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Estimate $estimate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Estimate $estimate)
    {
        //
    }
}
