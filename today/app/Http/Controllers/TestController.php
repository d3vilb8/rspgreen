<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Holiday;
use Illuminate\Http\Request;
use App\Models\LeaveManagement;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    public function index(Request $request)
    {

        
        // dd($holiday);
        // dd($leave);
        return Inertia::render('print/quotation' );
    }
}
