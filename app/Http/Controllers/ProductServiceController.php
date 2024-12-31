<?php

namespace App\Http\Controllers;

use App\Models\ProductService;
use App\Models\ServiceCategory;
use App\Models\Unit;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProductServiceController extends Controller
{

    public function index()
    {
        $products = ProductService::join('service_categories', 'service_categories.id', '=', 'product_services.category_id')->select('product_services.name', 'product_services.id', 'service_categories.name as cname')->get();
        $unit = Unit::all();
        $tax = Tax::all();
        $category = ServiceCategory::all();
        return Inertia::render('product/index', compact('products', 'unit', 'tax', 'category'));
    }
    // Create
    public function store(Request $request)
    {
        // dd($request->all());
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|string',
            // 'purchase_price' => 'required|numeric',
            // 'unit_id' => 'required|integer',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg', // Validate image file
            // 'sku' => 'required|'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images'), $imageName); // Move to public/images directory
            $validatedData['image'] = 'images/' . $imageName; // Save path to database
        }

        ProductService::create($validatedData);
        return back();
    }

    // Edit
    public function update(Request $request, $id)
{
    $productService = ProductService::findOrFail($id);

    // Handle image upload
    if ($request->hasFile('image')) {
        // Delete the old image if it exists
        if ($productService->image && File::exists(public_path($productService->image))) {
            File::delete(public_path($productService->image));
        }

        $image = $request->file('image');
        $imageName = time() . '_' . $image->getClientOriginalName();
        $image->move(public_path('images'), $imageName);
        $productService->image = 'images/' . $imageName;
    }

    // Update other fields directly
    $productService->name = $request->input('name');
    $productService->description = "change when description need";

    // Save the updated data
    $productService->save();

    return back();
}


    // Delete
    public function destroy($id)
    {
        $productService = ProductService::findOrFail($id);

        // Delete the associated image if it exists
        if ($productService->image && File::exists(public_path($productService->image))) {
            File::delete(public_path($productService->image));
        }

        $productService->delete();
        return response()->json(['message' => 'Product service deleted successfully']);
    }
}
