<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceCategoryController extends Controller
{
    public function index()
    {
        $categories = ServiceCategory::all();
        // dd($categories);
        return Inertia::render('product/categories', ['categories' => $categories]);
    }
    public function create()
    {
        $categories = ServiceCategory::all();
        // dd($categories);
        return Inertia::render('product/categories', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ServiceCategory::create($request->all());

        return redirect()->route('service-categories.index');
    }

    public function update(Request $request, ServiceCategory $serviceCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $serviceCategory->update($request->all());

        return redirect()->route('service-categories.index');
    }

    public function destroy(ServiceCategory $serviceCategory)
    {
        $serviceCategory->delete();
        return redirect()->route('service-categories.index');
    }
}
