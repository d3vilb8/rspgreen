<?php
// app/Http/Controllers/HolidayLocationController.php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use DB;

class HolidayLocationController extends Controller
{
    // Index method to display the list of holidays
    public function index()
    {
        // Fetch the list of holidays from the database
        $holidays = DB::table('locations_holiday')->pluck('name');
        
        // Return the 'location/holidayList' Inertia page with the fetched holidays
        return Inertia::render('location/holidayList', [
            'holidays' => $holidays
        ]);
    }

    // Store method to handle creating a new holiday
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        // Insert the new holiday location into the database
        DB::table('locations_holiday')->insert([
            'name' => $validated['name'],
        ]);

        // Redirect back to the holiday locations list
        return redirect()->route('holiday-locationswise.index'); 
    }

    // Show method to display a specific holiday location
    public function show($id)
    {
        // Fetch the holiday by ID
        $holiday = DB::table('locations_holiday')->find($id); 
        
        // If the holiday doesn't exist, abort with 404
        if (!$holiday) {
            abort(404); 
        }

        // Return the specific holiday location view
        return Inertia::render('HolidayLocation/Show', [
            'holiday' => $holiday->name  
        ]);
    }

    // Update method to handle editing a holiday location
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        // Update the holiday location in the database
        DB::table('locations_holiday')
            ->where('id', $id)
            ->update([
                'name' => $validated['name'],
            ]);

        // Redirect back to the holiday locations list
        return redirect()->route('holiday-locationswise.index');  
    }

    // Destroy method to handle deleting a holiday location
    public function destroy($id)
    {
        // Delete the holiday location from the database
        DB::table('locations_holiday')->where('id', $id)->delete();

        // Redirect back to the holiday locations list
        return redirect()->route('holiday-locationswise.index');  
    }
}
