<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::join('users', 'users.id', '=', 'clients.user_id')->select('users.name', 'users.email', 'users.id', 'clients.phone', 'clients.address')->get();
        return Inertia::render('client/index', compact('clients'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $user = new User();
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->type = 2;
        $user->password = bcrypt($request['password']);
        $user->save();

        // Assign the role to the user
        $user->assignRole($request['roleclient']);

        // Create and save the employee record
        $employee = new Client();
        $employee->user_id = $user->id;

        $employee->phone = $request['phone'];
        $employee->address = $request['address'];
        $employee->save();
        return redirect('login')->with('success', 'Client created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        // Update user information
        $user = User::find($client->user_id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        // Update client information
        $client->phone = $request->phone;
        $client->address = $request->address;
        $client->save();

        return back()->with('success', 'Client updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        // Find the user and delete them
        $user = User::find($client->user_id);
        $user->delete();

        // Also delete the client record
        $client->delete();

        return back()->with('success', 'Client deleted successfully!');
    }
}
