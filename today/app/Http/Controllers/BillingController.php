<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillForm;
use App\Models\Billing;
use App\Models\ProductService;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supplier = Supplier::all();
        $product = ProductService::all();
        return Inertia::render('accounts/bill', compact('supplier', 'product'));
    }

    public function create()
    {
        $supplier = Supplier::all();
        $product = ProductService::all();
        return Inertia::render('accounts/billform', compact('supplier', 'product'));
    }

    public function store(Request $request)
    {
        // dd($request->all());
        // Directly access request data
        $data = $request->all();

        // Debugging to check if billingforms is being sent correctly
        $billingForms = $data['items'] ?? [];
        // dd($billingForms); // This should show the array of items

        // Create the Bill entry
        $bill = Bill::create([
            'supplier_id' => $data['supplier_id'],
            'bill_date' => $data['bill_date'],
            'due_date' => $data['due_date'],
            'bill_number' => $data['bill_number'],
            'order_number' => $data['order_number'],
        ]);

        // Loop through billing forms and create entries
        foreach ($billingForms as $item) {
            // Make sure necessary keys exist
            $quantity = $item['quantity'] ?? 0;
            $price = $item['price'] ?? 0;
            $discount = $item['discount'] ?? 0; // Default to 0 if not provided
            $tax = $item['tax'] ?? 0; // Default to 0 if not provided
            $productId = $item['product_id'] ?? null;

            // Check if product ID is present
            if ($productId) {
                // Calculate the amount
                $amount = ($price * $quantity) - $discount;

                // Create BillForm entries
                BillForm::create([
                    'bill_id' => $bill->id,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'discount' => $discount,
                    'tax' => $tax,
                    'amount' => $amount,
                ]);
            }
        }

        // Return success response
        return response()->json(['message' => 'Bill created successfully']);
    }




    public function update(Request $request, $id)
    {
        // similar to store method with additional checks
    }

    public function destroy($id)
    {
        $bill = Bill::findOrFail($id);
        $bill->delete();

        return response()->json(['message' => 'Bill deleted successfully']);
    }
}
