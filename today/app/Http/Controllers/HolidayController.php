<?php
namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    public function index()
    {
        // Get all holidays
        $holidays = Holiday::all();

        // Return Inertia view with holidays data
        return Inertia::render('location/index', [
            'holidays' => $holidays,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
        ]);

        // Create a new holiday
        $holiday = Holiday::create($request->all());

        // Return a success response with Inertia
        return Inertia::render('location/index', [
            'holidays' => Holiday::all(), // Optionally update the list after creation
        ]);
    }

    public function update(Request $request, $id)
    {
        // Find the holiday by id
        $holiday = Holiday::findOrFail($id);

        // Validate the request
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
        ]);

        // Update the holiday
        $holiday->update($request->all());

        // Return an Inertia response with updated holidays
        return Inertia::render('location/index', [
            'holidays' => Holiday::all(),
        ]);
    }

    public function destroy($id)
    {
        // Find the holiday by id
        $holiday = Holiday::find($id);

        if ($holiday) {
            // Delete the holiday
            $holiday->delete();

            // Return an Inertia response after deletion
            return Inertia::render('location/index', [
                'holidays' => Holiday::all(), // Refresh the holidays list after deletion
            ]);
        }

        // If holiday not found, return an error message
        return Inertia::render('location/index', [
            'message' => 'Holiday not found',
            'holidays' => Holiday::all(),
        ]);
    }

    public function HolidayCalender(Request $request)
    {
        // Get all distinct locations for the location dropdown
        $locations = Holiday::distinct('location')->pluck('location');

        // Get location from the request query parameters
        $location = $request->query('location');

        // Start query to fetch holidays, ordered by start date
        $holidays = Holiday::orderBy('start_date', 'asc');

        // If location is provided, filter holidays by location
        if ($location) {
            $holidays = $holidays->where('location', $location);
        }

        // Fetch holidays
        $holidays = $holidays->get();

        // If no holidays are found, log the information
        if ($holidays->isEmpty()) {
            \Log::info("No holidays found for location: " . $location);
        }

        // Return holidays and locations to the frontend
        return Inertia::render('location/holidayCalender', [
            'holidays' => $holidays->isEmpty() ? [] : $holidays->toArray(),
            'locations' => $locations,
        ]);
    }
}
