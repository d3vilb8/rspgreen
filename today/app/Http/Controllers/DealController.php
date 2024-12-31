<?php
namespace App\Http\Controllers;
use App\Models\Deal;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index()
    {
        // Fetch all deals and map client name
        $deals = Deal::get();
        // $deals = $deals->map(function($deal) {
        //     $deal->client_name = User::findOrFail($deal->client_id)->name;
        //     return $deal;
        // });

        return Inertia::render('deals/index', ['deals' => $deals]);
    }

    public function create()
    {
        // Fetch clients for the create form
        $clients = User::join('clients', 'clients.user_id', '=', 'users.id')
            ->select('users.id', 'users.name')
            ->get();
            
        return Inertia::render('deals/create', ['clients' => $clients]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            "deal_name" => "required",
            "phone" => "required|min:10",
            "price" => "required|numeric",
            "clients" => "required",
        ]);

        // Create a new deal
        Deal::create([
            // 'client_id' => $validated['client_id'],
            'deal_name' => $validated['deal_name'],
            'phone' => $validated['phone'],
            'price' => $validated['price'],
            'clients' => $validated['clients'],
        ]);

        return redirect()->route('deal.index');
    }

    public function edit($id)
    {
        // Fetch clients and the specific deal for the edit form
        $clients = User::join('clients', 'clients.user_id', '=', 'users.id')
            ->select('users.id', 'users.name')
            ->get();
            
        $deal = Deal::findOrFail($id);
        
        return Inertia::render('deals/edit', [
            'deal' => $deal,
            'clients' => $clients
        ]);
    }

    public function update(Request $request, $id)
    {
        
        $validated = $request->validate([
            // "client_id" => "required",
            "deal_name" => "required",
            "phone" => "required|min:10",
            "price" => "required|numeric",
            "clients" => "required",
        ]);

       
        $deal = Deal::findOrFail($id);
        $deal->update([
            // "client_id" => $validated['client_id'],
            "deal_name" => $validated['deal_name'],
            "phone" => $validated['phone'],
            "price" => $validated['price'],
            "clients" => $validated['clients'],
        ]);

        return redirect()->route('deal.index');
    }

    public function destroy($id)
    {
        //delete
        Deal::findOrFail($id)->delete();
        
        return redirect()->route('deal.index');
    }
}
