<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\location_list;

class locationlistController extends Controller
{
    public function index()
    {

        $locationList = location_list::all();
        dd($locationList);

        return Inertia::render('location/holidayList', [
            'location' => $location

        ]);
    }
}
