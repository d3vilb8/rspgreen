<?php
// app/Http/Controllers/HolidayLocationController.php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use DB;

class HolidayLocationController extends Controller
{
    // Index method to display the list of vacations
    public function index()
    {
        // Fetch the list of vacations from the database
        $vacations = DB::table('locations_holiday')->pluck('name');
        
        // Return the 'location/holidayList' Inertia page with the fetched vacations
        return Inertia::render('location/holidayList', [
            'vacations' => $vacations
        ]);
    }

    // Store method to handle creating a new vacation
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        // Insert the new vacation location into the database
        DB::table('locations_holiday')->insert([
            'name' => $validated['name'],
        ]);

        // Redirect back to the vacation locations list
        return redirect()->route('holiday-locationswise.index'); 
    }

    // Show method to display a specific vacation location
    public function show($id)
    {
        // Fetch the vacation by ID
        $vacation = DB::table('locations_holiday')->find($id); 
        
        // If the vacation doesn't exist, abort with 404
        if (!$vacation) {
            abort(404); 
        }

        // Return the specific vacation location view
        return Inertia::render('HolidayLocation/Show', [
            'vacation' => $vacation->name  
        ]);
    }

    // Update method to handle editing a vacation location
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        // Update the vacation location in the database
        DB::table('locations_holiday')
            ->where('id', $id)
            ->update([
                'name' => $validated['name'],
            ]);

        // Redirect back to the vacation locations list
        return redirect()->route('holiday-locationswise.index');  
    }

    // Destroy method to handle deleting a vacation location
    public function destroy($id)
    {
        // Delete the vacation location from the database
        DB::table('locations_holiday')->where('id', $id)->delete();

        // Redirect back to the vacation locations list
        return redirect()->route('holiday-locationswise.index');  
    }
}
