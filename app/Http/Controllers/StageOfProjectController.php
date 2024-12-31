<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StageOfProject;

class StageOfProjectController extends Controller
{
    public function index()
    {
        $stages = StageOfProject::all();

        return Inertia::render('projects/projectStages', [
            'leadStage' => $stages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        StageOfProject::create($request->all());

        return redirect()->back()->with('success', 'Stage created successfully.');
    }

    public function update(Request $request, StageOfProject $stage)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $stage->update($request->all());

        return redirect()->back()->with('success', 'Stage updated successfully.');
    }

    public function destroy(StageOfProject $stage)
    {
        $stage->delete();

        return redirect()->back()->with('success', 'Stage deleted successfully.');
    }
}
