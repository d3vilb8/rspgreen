<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationAllController extends Controller
{
    public function Notification()
    {
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        $holiday = Auth::user()->notifications;
        return Inertia::render('notification/index', compact('notif', 'holiday', 'userss', 'user_type', 'user'));
    }
}
