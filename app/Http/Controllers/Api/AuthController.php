<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    //=================================================================
    public function signup(SignupRequest $request){
        
        $data = $request->validated();
       
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('uesr','token'));
    }
    //=================================================================
    public function login(LoginRequest $request){
        
        $credentials = $request->validated();

        if(!Auth::attempt($credentials)){
            return response([
                'message' => __('Provided email or password is incorect')
            ]);
        }

        $user = Auth::user();

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('uesr','token'));
    }
    //=================================================================
    public function logout(Request $request){

        $user->$request->user();
        $user->currentAccessToken()->delete();
        return response('',204);
    }
}
