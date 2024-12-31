<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;

class ViewServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Sharing notifications with all views
        View::composer('*', function ($view) {
            if (Auth::check()) {
                $notif = Auth::user()->notifications;
                $view->with('notif', $notif);
            }
        });
    }

    public function register()
    {
        //
    }
}
