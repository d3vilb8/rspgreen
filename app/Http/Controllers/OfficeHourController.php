<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\OfficeHour;
use Illuminate\Http\Request;

class OfficeHourController extends Controller
{
    public function index()
    {
        $officeHours = OfficeHour::all();
        return Inertia::render('salary/officeTime', [
            'officeHours' => $officeHours,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $officeHour = OfficeHour::create($validated);
        return response()->json($officeHour, 201);
    }

    public function update(Request $request, $id)
    {
        $officeHour = OfficeHour::findOrFail($id);

        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $officeHour->update($validated);
        return response()->json($officeHour);
    }

    public function destroy($id)
    {
        $officeHour = OfficeHour::findOrFail($id);
        $officeHour->delete();
        return response()->json(['message' => 'Office hour deleted']);
    }
}
