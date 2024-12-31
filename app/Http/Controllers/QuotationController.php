<?php

namespace App\Http\Controllers;

use App\Models\ProductService;
use App\Models\Quotation;
use App\Models\Tax;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class QuotationController extends Controller
{
    protected $user_image;


    // Fetch list of clients
    public function index()
    {

        $data = Quotation::join('users', 'users.id', 'quotations.customer_id')->select('quotations.*', 'users.name')->get();
        // dd($data);

        return Inertia::render('quotation/index', compact('data'));
    }


    // Fetch archived clients
    public function archiveclient()
    {
        $data = DB::table('tbl_user')
            ->where('role', 'client')
            ->where('is_archive', 1)
            ->get();
        return Inertia::render('quotation/archiveclient', compact('data'));
    }

    // Delete client
    public function destroy($id)
    {
        Quotation::findOrFail($id)->delete();

        session()->flash('success', 'Quotation Deleted Successfully');
        return redirect()->route('Quotation.index');
    }
    public function addarchive($id)
    {
        DB::table('tbl_user')->where('user_id', $id)->update(['is_archive' => 1]);
        session()->flash('success', 'Client is now archive Successfully');
        return redirect()->route('Quotation.index');
    }

    public function edit($id)
    {
        $qt = Quotation::findOrFail($id);
        $qt_acc = DB::table('quatation_account_tax')->join('taxes', 'taxes.name', '=', 'quatation_account_tax.tax_name')->where('quatation_account_tax.quation_id', $id)->select('taxes.id as tax_id', 'tax as tax_value', 'tax_name')->get()->toArray();
        $qt_his = DB::table('tbl_quotation_history')->where('quotation_id', $id)->select('item_name as product_id', 'price', 'qty as p_qty', DB::raw('qty * price as amount'))->get()->toArray();
        $taxOptions = DB::table('taxes')->first();
        $customer_dets = DB::table('users')->join('clients', 'clients.user_id', '=', 'users.id')->select('users.id','users.name', 'clients.phone')->get();
        return Inertia::render('quotation/edit', compact('customer_dets', 'taxOptions', 'qt', 'qt_acc', 'qt_his'));
    }

    public function getproduct()
    {
        $product = ProductService::all();
        return response()->json($product, Response::HTTP_OK);
    }
    // Add a new Quotation
    public function create(Request $request)
    {
        $last_record = DB::table('tbl_quotation')->orderBy('quotation_id', 'desc')->first();
        $client_idf = 'Q' . $last_record->quotation_id . rand(11, 99) . date('mY');
        $client_idf2 = (object)[
            'value' => $client_idf,

        ];
        $taxOptions = DB::table('taxes')->get();
        $products = ProductService::all();
        // dd($taxOptions);
        $customer_dets = DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')->get();


        return Inertia::render('quotation/create', compact('client_idf2', 'customer_dets', 'taxOptions', 'products'));
    }
    public function gettaxoptions()
    {
        $product = Tax::all();
        return response()->json($product, Response::HTTP_OK);
    }
    public function getCustomer($id)
    {
        $customer_details = DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')->where('user_id', $id)->first();

        // Check if the service partner exists
        if (!$customer_details) {
            return response()->json(['message' => 'Custoemr not found'], 404);
        }

        // Return the service partner details as JSON
        return response()->json($customer_details);
    }
    public function store(Request $request)
    {

        $request->validate([
            'quotation_no' => 'required|string|max:255',
            'quotation_date' => 'required|date',
            'customer_name' => 'required|string|max:255',
            'customer_details' => 'required',
            'mobile_no' => 'required|string|max:15',
            'quotation_amount' => 'required',
            'report' => 'required',
            'ref_no' => 'required',
            'email' => 'required|email',
            'status' => 'required|in:0,1,2', // Adjust as needed for your status options
            'Billing_address' => 'required|string',
            'message' => 'nullable|string',
        ], ['message.required' => 'The scope work field is required']);

        Quotation::create([
            'quotation_no' => $request->quotation_no,
            'quotation_date' => $request->quotation_date,
            'quotation_amount' => $request->quotation_amount,
            'report' => $request->report,
            'ref_no' => $request->ref_no,
            'customer_id' => $request->customer_details,
            'mobile' => $request->mobile_no,
            'email' => $request->email,
            'status' => $request->status,
            'name' => $request->customer_name,
            'address' => $request->Billing_address,
            'message' => $request->message,
        ]);

        return redirect()->route('Quotation.index');
    }

    public function update(Request $request, $id)
    {

        $request->validate([
            'quotation_no' => 'required|string|max:255',
            'quotation_date' => 'required|date',
            'customer_name' => 'required|string|max:255',
            'customer_details' => 'required',
            'mobile_no' => 'required|string|max:15',
            'quotation_amount' => 'required',
            'report' => 'required',
            'ref_no' => 'required',
            'email' => 'required|email',
            'status' => 'required|in:0,1,2', // Adjust as needed for your status options
            'Billing_address' => 'required|string',
            'message' => 'nullable|string',
        ], ['message.required' => 'The scope work field is required']);

        // Update the main quotation details
       Quotation::findOrFail($id)->update([
            'quotation_no' => $request->quotation_no,
            'quotation_date' => $request->quotation_date,
            'quotation_amount' => $request->quotation_amount,
            'report' => $request->report,
            'ref_no' => $request->ref_no,
            'customer_id' => $request->customer_details,
            'mobile' => $request->mobile_no,
            'name' => $request->customer_name,
            'email' => $request->email,
            'status' => $request->status,
            'address' => $request->Billing_address,
            'message' => $request->message,
        ]);

        

        // Redirect with a success message
        return redirect()->route('Quotation.index');
    }

    public function Print($id)
    {
        $user = Auth::user();

        $data = Quotation::join('users', 'quotations.customer_id', '=', 'users.id')
            ->join('clients', 'clients.user_id', '=', 'users.id')
            ->select('quotations.*', 'users.name', 'users.email', 'clients.address', 'clients.phone')
            ->where('quotations.id', $id)
            ->first();
        // dd($data);

        $products = DB::table('tbl_quotation_history')
            ->join('product_services', 'tbl_quotation_history.item_name', '=', 'product_services.id')
            ->select('tbl_quotation_history.qty', 'tbl_quotation_history.price', 'tbl_quotation_history.net_amount', 'product_services.name')
            ->where('tbl_quotation_history.quotation_id', $id)
            ->get();

        $totalAmount = $products->sum('net_amount');

        return Inertia::render('print/quotation', [
            'data' => $data,
            'user' => $user,
            'products' => $products,
            'totalAmount' => $totalAmount,
        ]);
    }
}
