<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\LeadStage;
use Illuminate\Http\Request;

class LeadStageController extends Controller
{
    public function index()
    {
        $leadStage = LeadStage::all();
        return Inertia::render('lead/addStage', [
            'leadStage' => $leadStage,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        LeadStage::create($request->only('name'));
        return redirect()->route('lead-stages.index'); // Use resource route name
    }

    public function show($id)
    {
        $leadStage = LeadStage::findOrFail($id);
        return Inertia::render('lead/addStage', [
            'leadStage' => $leadStage,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $leadStage = LeadStage::findOrFail($id);
        $leadStage->update($request->only('name'));

        return redirect()->route('lead-stages.index'); // Use resource route name
    }

    public function destroy($id)
    {
        $leadStage = LeadStage::findOrFail($id);
        $leadStage->delete();

        return redirect()->route('lead-stages.index'); 
    }
}
