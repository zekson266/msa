<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    //=================================================================
    public function signup(SignupRequest $request){
        
        $data = $request->validated();

        /** @var \App\Models\User $user */

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user','token'));
    }
    //=================================================================
    public function login(LoginRequest $request){
        
        $credentials = $request->validated();
        
        if(!Auth::attempt($credentials)){
            return response([
                'message' => __('Provided email or password is incorect')
            ],422);
        }
        /** @var \App\Models\User $user */

        $user = Auth::user();

        $token = $user->createToken('main')->plainTextToken;

        $user = new UserResource($user);

        return response()->json(compact('user','token'));
        // return response(compact('user','token'));
    }
    //=================================================================
    public function logout(Request $request){

        /** @var \App\Models\User $user */
        
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('',204);
    }
}
