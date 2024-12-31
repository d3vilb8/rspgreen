<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ComplaintController extends Controller
{
    public function index()
    {
        $complaints = Complaint::join('users', 'users.id', '=', 'complaints.customer_id')
            // ->join('product', 'product.id', '=', 'complaints.product_id')
            ->join('product_services', 'product_services.id', '=', 'complaints.product_id')
            ->join('users as e_name', 'e_name.id', '=', 'complaints.assigned_id')
            ->select('e_name.name as e_name', 'complaints.id', 'users.name', 'complaints.date', 'complaints.complaint_no', 'complaints.complaint_type', 'complaints.status')
            ->get();
        return Inertia::render('complaint/index', [
            'complaints' => $complaints
        ]);
    }

    public function create()
    {
        // $customers = DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')->where('role', 'client')->get();
        $customers = DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')->get();
        // dd($customers);
        $products = DB::table('product_services')->get();
        // $employees = DB::table('users')->where('role', 'Employee')->get();
        $employees = DB::table('users')->join('employees', 'employees.user_id', '=', 'users.id')->select('users.name', 'users.id')->get();
        // dd($employees);
        return Inertia::render('complaint/create', ['customers' => $customers, 'products' => $products, 'employees' => $employees]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'complaint_no' => 'required',
            'date' => 'required', // Ensure date is valid
            'customer_id' => 'required', // Validate if the customer exists
            'complaint_type' => 'required',
            'description' => 'required',
            'product_id' => 'required', // Validate if the product exists
            'assigned_id' => 'required', // Validate if the assigned user exists
            'assigned_date' => 'required', // Ensure assigned date is valid
            'status' => 'required',
            'mobile_no' => 'required', // Validate mobile number format
            'email' => 'required', // Ensure valid email format
            'address' => 'required',
        ]);

        Complaint::create($request->all());
        return \redirect()->to(\route('complaint.index'));
    }

    public function edit($id)
    {
        $complaint = Complaint::findOrFail($id);
        $customers = DB::table('clients')->join('users', 'users.id', '=', 'clients.user_id')->get();
        // dd($customers);
        $products = DB::table('product_services')->get();
        // $employees = DB::table('users')->where('role', 'Employee')->get();
        $employees = DB::table('users')->join('employees', 'employees.user_id', '=', 'users.id')->select('users.name', 'users.id')->get();
        return Inertia::render('complaint/edit', ['complaint' => $complaint, 'customers' => $customers, 'products' => $products, 'employees' => $employees]);
    }

    public function update($id, Request $request)
    {
        $request->validate([
            'complaint_no' => 'required',
            'date' => 'required', // Ensure date is valid
            'customer_id' => 'required', // Validate if the customer exists
            'complaint_type' => 'required',
            'description' => 'required',
            'product_id' => 'required', // Validate if the product exists
            'assigned_id' => 'required', // Validate if the assigned user exists
            'assigned_date' => 'required', // Ensure assigned date is valid
            'status' => 'required',
            'mobile_no' => 'required', // Validate mobile number format
            'email' => 'required', // Ensure valid email format
            'address' => 'required',
        ]);

        Complaint::findOrFail($id)->update($request->all());
        return \redirect()->to(\route('complaint.index'));
    }

    public function destroy($id)
    {
        Complaint::findOrFail($id)->delete();
        return \redirect()->to(\route('complaint.index'));
    }
}
