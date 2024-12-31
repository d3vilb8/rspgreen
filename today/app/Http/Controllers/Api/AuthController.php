<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Entry;
use App\Models\Employee;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = JWTAuth::user();

        if ($user) {
            $u = User::findOrFail($user->id);
            $u->is_exe_login = 1;
            $u->save();

            $lc = new Location();
            $lc->user_id = $user->id;
            $lc->latitude = $request->location['lat'];
            $lc->longitude = $request->location['long'];
            $lc->address = $request->location['add'];
            $lc->save();

            Entry::create([
                'user_id' => JWTAuth::user()->id,
                'location_id'=>$lc->id,
                'type' => 'loggedin',
                'entry_at' => Carbon::now()
            ]);
        }
        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(JWTAuth::parseToken()->authenticate());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $u = User::findOrFail(auth('api')->user()->id);
        $u->is_exe_login = 0;
        $u->save();
        Entry::create([
            'user_id' => auth('api')->user()->id,
            'type' => 'logout',
            'entry_at' => Carbon::now()
        ]);

        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL()
        ]);
    }
}
