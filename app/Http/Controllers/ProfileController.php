<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    // public function edit(Request $request): Response
    // {
    //     $user = Auth::user()->name;
    //     $userss = Auth::user();
    //     if ($userss) {
    //         // Ensure permissions are assigned and fetched correctly
    //         $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
    //         // dd($permissions);
    //     }
    //     $usrrr = Auth::user()->id;
    //     $notif = Auth::user()->notifications;
    //     return Inertia::render('Profile/Edit', [
    //         'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
    //         'status' => session('status'),
    //     ]);
    // }
    // public function edit(Request $request): Response
    // {
    //     $user = Auth::user()->name;
    //     $userss = Auth::user();

    //     // Ensure permissions are assigned and fetched correctly
    //     $user_type = $userss->getAllPermissions()->pluck('name')->toArray();

    //     $usrrr = Auth::user()->id;
    //     $notif = Auth::user()->notifications;

    //     return Inertia::render('Profile/Edit', compact('user', 'user_type', 'usrrr', 'notif'));
    // }
    public function edit(Request $request): Response
    {

        $notif = Auth::user()->notifications;
        $usrrr = Auth::user()->id;
        // dd($usrrr);
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        // dd($notif);

        return Inertia::render('Profile/Edit', [
            'user' => $user,
            'user_type' => $user_type,
            'usrrr' => $usrrr,
            'notif' => $notif,
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }


    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
