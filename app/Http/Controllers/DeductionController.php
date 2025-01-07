<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DeductionController extends Controller
{
    public function index()
    {

        return Inertia::render('salary/deduction');
    }
   
    //
}
