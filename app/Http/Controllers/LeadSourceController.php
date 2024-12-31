<?php
namespace App\Http\Controllers;

use App\Models\LeadSource;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LeadSourceController extends Controller
{
    public function index()
    {
        $leadSources = LeadSource::all();
        return Inertia::render('lead/addSource', [
            'leadSources' => $leadSources,
        ]);
    }

    // Store a new lead source
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0', 
        ]);

        LeadSource::create($request->all());

       
        return redirect()->route('lead-sources.index');
    }

   
    public function show($id)
    {
        $leadSource = LeadSource::findOrFail($id);
        return Inertia::render('lead/addSource', [
            'leadSource' => $leadSource,
        ]);
    }

 
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0', 
        ]);

        $leadSource = LeadSource::findOrFail($id);
        $leadSource->update($request->all());

        return redirect()->route('lead-sources.index');
    }

  
    public function destroy($id)
    {
        $leadSource = LeadSource::findOrFail($id);
        $leadSource->delete();

       
        return redirect()->route('lead-sources.index');
    }
}
