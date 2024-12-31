<?php

namespace App\Http\Controllers\Auth;

use App\Models\Lead;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Client;
use App\Models\LeadSource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $leadSources = LeadSource::all();
        return Inertia::render('Auth/Register', ['leadSources' => $leadSources]); // Corrected this line
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string',
            'address' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'type' => 2, // Customer type
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('customer');

        $client = new Client();
        $client->user_id = $user->id; // Assign user ID
        $client->phone = $request->phone;
        $client->address = $request->address;
        $client->save();
        // $leadSources = LeadSource::all();
        // Lead::create([
        //     'client_id' => $user->id,
        //     'email_address' => $request->email,
        //     'phone_number' => $request->phone,
        //     'source' => $request->source ?? 'direct', // Fixed direct as string
        //     'status' => 'open',
        //     'lead_stage' => 'Hot',
        //     'comment' => 'Automatically generated lead',
        // ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
