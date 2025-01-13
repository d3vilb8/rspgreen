<?php

namespace App\Http\Controllers;

use App\Models\OfficeTime;
use Illuminate\Http\Request;

class OfficeTimeController extends Controller
{
     // Display a listing of office times
      // Store office time if needed
      public function store(Request $request)
      {
          $request->validate([
              'start_time' => 'required',
              'end_time' => 'required',
          ]);
  
          OfficeTime::create($request->all());
  
          return response()->json(['message' => 'Office time set successfully']);
      }
  
      // Show office time
      public function show($id)
      {
          return OfficeTime::find($id);
      }
  
      // Retrieve office times for the front end (optional)
      public function getOfficeHours()
      {
          $officeTime = OfficeTime::first();  // Get the first record or modify logic as needed
          return response()->json([
              'start' => $officeTime->start_time,
              'end' => $officeTime->end_time,
          ]);
      }
}
