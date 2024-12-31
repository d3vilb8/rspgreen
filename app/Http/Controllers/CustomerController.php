<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\CustomerUpload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
   
    public function uploadDoc()
    {
        return Inertia::render('admin/uploaddoc');
    }

    
    public function uploadTable($id)
    {
        $customerInfo = CustomerUpload::where('project_id', $id)->get();

        return Inertia::render('admin/customer/cs', [
            'customerInfo' => $customerInfo,
            'id' => $id
        ]);
    }
    public function viewProject()
    {
        return Inertia::render('admin/customer/vp', [
            // 'customerInfo' => $customerInfo,
            // 'id' => $id
        ]);  
    }
    public function paymentData()
    {
        return Inertia::render('admin/customer/pd', [
            // 'customerInfo' => $customerInfo,
            // 'id' => $id
        ]);  
    }
  

 
    public function storeDocument(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

     
        $userId = Auth::id();

      
        $filePath = $request->file('file')->store('uploads', 'public');

        // Save the file details in the database
        CustomerUpload::create([
            'name' => $validated['name'],
            'uploaded_file' => $filePath,
            'customer_id' => $userId, 
            'project_id' => $id  
        ]);

        return redirect()->back()->with('success', 'Document uploaded successfully!');
    }

    // Delete a document
    public function deleteDocument(Request $request, $id)
{
    try {
        $customerUpload = CustomerUpload::findOrFail($id);

       
        if (Storage::disk('public')->exists($customerUpload->uploaded_file)) {
            Storage::disk('public')->delete($customerUpload->uploaded_file);
        }

    
        $customerUpload->delete();

        return redirect()->back()->with('success', 'Document deleted successfully!');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Failed to delete document: ' . $e->getMessage());
    }
}

}
