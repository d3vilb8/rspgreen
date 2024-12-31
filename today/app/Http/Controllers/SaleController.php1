<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ProductService;
use App\Models\Sale;
use App\Models\Tax;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\WhatsAppService;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::join('users', 'users.id', '=', 'sales.customer_id')->select('users.*', 'sales.*')->get();
        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }



    // public function store(Request $request)
    // {
    //     // dd($request->all());
    //     // $request->validate([
    //     //     'bill_no' => 'required',
    //     //     'customer_id' => 'required',
    //     //     'date' => 'required',
    //     //     'billing_address' => 'required',
    //     //     'status' => 'required',
    //     //     'amc_type' => 'required',
    //     //     'mobile_no' => 'required',
    //     //     'email' => 'required',
    //     //     'sales_details' => 'required|array' // Ensure sales_details is an array
    //     // ]);

    //     // $sale = Sale::create($request->all());
    //     $sale = Sale::create($request->all());
    //     if (!$sale) {
    //         return response()->json(['error' => 'Failed to create sale'], 500);
    //     }
    //     // dd($request->sales_details);
    //     // Prepare product names from sales_details
    //     $productNames = '';
    //     foreach ($request->sales_details as $product) {
    //         // Assuming 'product_name' is a key in each product detail
    //         $productNames .= $product['product'] . ', ';
    //     }
    //     // Remove trailing comma and space
    //     $productNames = rtrim($productNames, ', ');
    //     // dd($productNames);
    //     $recipient = '+91' . ltrim($request->mobile_no, '+');
    //     // Send WhatsApp message after sale is stored
    //     $chat = [
    //         "secret" => "3c1d2c5c4ce14c120dc4f668460ea68fb3bcdd1c", // API secret
    //         "account" => "1730203027060ad92489947d410d897474079c14776720cd93ce9f4",
    //         "recipient" => $recipient,
    //         "type" => "text",
    //         "message" => "Hello! Your sale for the following products has been recorded: {$productNames}. Thank you!"
    //     ];

    //     $cURL = curl_init("https://app.bulkwise.in/api/send/whatsapp");
    //     curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);
    //     curl_setopt($cURL, CURLOPT_POSTFIELDS, $chat);
    //     $response = curl_exec($cURL);
    //     curl_close($cURL);

    //     return redirect()->route('sales.index');
    // }

    public function create()
    {
        $date = Carbon::now()->format('Ymd');

        // Get the last sale record's ID, or set to 0 if there are no sales yet
        $lastSale = Sale::latest()->first();
        $lastId = $lastSale ? $lastSale->id : 0;

        // Generate the new invoice number in the format "INVYYYYMMDD<ID+1>"
        $invoiceNumber = 'RSP/' . $date .'/'. ($lastId + 1);
        $customers = DB::table('clients')->join('users', 'users.id', 'clients.user_id')->get();
        // dd($customers);
        $products = ProductService::all();
        $taxs = Tax::all();
        return Inertia::render('sales/create', ['customers' => $customers, 'products' => $products, 'taxes' => $taxs, 'invoiceNumber' => $invoiceNumber]);
    }
    public function store(Request $request)
    {


        $sale = Sale::create($request->all());


        return redirect()->route('sales.index');
        $products = DB::table('product')->join('products_category', 'products_category.id', '=', 'product.category_id')->select('products_category.name', 'product.id')->get();
        $taxs = Tax::all();
        return Inertia::render('sales/create', ['customers' => $customers, 'products' => $products, 'taxes' => $taxs]);
    }

    // public function store(Request $request) {
    //     // \dd($request->all());
    //     $request->validate([
    //         'bill_no'=>'required',
    //         'customer_id'=>'required',
    //         'date'=>'required',
    //         'billing_address'=>'required',
    //         'status'=>'required',
    //         'amc_type'=>'required',
    //         'mobile_no'=>'required',
    //         'email'=>'required',
    //     ]);

    //     Sale::create($request->all());
    //     // foreach($request->sales_details as $product){
    //     //     //code here
    //     // }
    //     return \redirect()->to(\route('sales.index'));
    // }


    public function edit($id)
    {
        $sale = Sale::join('tbl_user', 'tbl_user.user_id', '=', 'sales.customer_id')->where('sales.id', $id)->first();
        $customers = DB::table('clients')->join('users', 'users.id', 'clients.user_id')->get();
        $taxs = Tax::all();
        $products = ProductService::all();
        return Inertia::render('sales/edit', ['customers' => $customers, 'products' => $products, 'taxes' => $taxs, 'sale' => $sale]);
    }


    public function update($id, Request $request)
    {
        // dd($request->all());
        $request->validate([
            'bill_no' => 'required',
            'customer_id' => 'required',
            'date' => 'required',
            'billing_address' => 'required',
            'status' => 'required',
            // 'amc_type' => 'required',
            'mobile_no' => 'required',
            'email' => 'required',
        ]);

        Sale::findOrFail($id)->update($request->all());
        return \redirect()->to(\route('sales.index'));
    }

    public function destroy($id)
    {
        Sale::findOrFail($id)->delete();
        return \redirect()->to(\route('sales.index'));
    }

    public function printSales($id){
        $sale = Sale::findOrFail($id);
        $cst = DB::table('clients')->join('users', 'users.id', 'clients.user_id')->where('users.id',$sale->customer_id)->first();;
        return Inertia::render('print/invoice',\compact('sale','cst'));
    }
}
