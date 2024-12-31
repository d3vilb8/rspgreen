<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Location;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    // use Illuminate\Support\Facades\Log;

    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $user = Auth::user();
        $request->session()->regenerate();



        // if (!$user->isFirstLogin()) {
        //     $user->is_first_login = 1;
        //     $user->save();
        // } elseif (!$user->isExeLogin()) {
        //     Auth::logout();
        //     return Inertia::render('Auth/Login', [
        //         'message' => 'Please login from the web app first or install and login from the app.'
        //     ]);
        // }
        Log::info('User authenticated:', ['id' => $user->id, 'type' => $user->type]);

        if ($user->type == 1) {
            return redirect()->route('dashboard');
        } elseif ($user->type == 2) {

            return redirect('dashboard');
        } else {

            return redirect()->route('defaultRoute'); // Replace 'defaultRoute' with your actual default route
        }
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
