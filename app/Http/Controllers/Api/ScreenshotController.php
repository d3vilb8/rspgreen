<?php

namespace App\Http\Controllers\Api;

use App\Models\Screenshot;
use App\Models\LogGenerate;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ScreenshotController extends Controller
{
    public function index()
    {
        $all = Screenshot::where('user_id', JWTAuth::parseToken()->authenticate()->id)->get();
        $all = $all->map(function ($a) {
            $a->path = Storage::disk('public')->url($a->path);
            return $a;
        });
        return response()->json($all);
    }

    public function store(Request $request)
    {
        $file = $request->file('image');
        $path = $file->storeAs('uploads', $file->getClientOriginalName(), 'public');
        Screenshot::create([
            'user_id' => JWTAuth::parseToken()->authenticate()->id,
            'path' => $path
        ]);
        return response()->json(["message" => "Screenshot uploaded successfully!"]);
    }

    public function LogGenerate(Request $request)
    {
        // Validate and log the incoming request
        \Log::info('Received logs:', $request->all());

        // Validate the request data
        $validated = $request->validate([
            '*.process_name' => 'required|string|max:255',
            '*.window_title' => 'required|string|max:255',
            '*.start_time'   => 'required|string',
            '*.end_time'     => 'required|string',
            '*.category'     => 'required|string|max:255',
            '*.user_id'     => 'required|max:255',
        ]);

        // Store logs
        $createdLogs = [];
        foreach ($validated as $logData) {
            $createdLogs[] = LogGenerate::create($logData);
        }

        // Log the response
        \Log::info('Logs stored:', $createdLogs);

        // Return response
        return response()->json([
            'message' => 'Logs generated successfully.',
            'data' => $createdLogs,
        ], 201);
    }
}
