<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use \App\Http\Controllers\Api\PostController;
use App\Http\Resources\UserResource;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('signup',[AuthController::class,'signup'])->name('auth.signup');
Route::post('login',[AuthController::class,'login'])->name('auth.login');

Route::middleware('auth:sanctum')->group( function () {
    Route::get('user',function(Request $request) {
        return response(new UserResource($request->user()));
    });
    Route::post('logout',[AuthController::class,'logout'])->name('auth.logout');
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
});

Route::controller(CommentController::class)->group(function(){
    Route::get('comment','index')->name('comment.index');
    Route::post('comment','store')->name('comment.store');    
});

Route::controller(PostController::class)->group(function(){
    Route::get('/test','test')->name('test');

    Route::get('/post','index')->name('post.index');
    Route::get('/post/show/{post}','show')->name('post.show');
    Route::put('/post/{post}','update')->middleware('auth:sanctum')->name('post.update');
    Route::post('/post/image_upload','image_upload')->middleware('auth:sanctum')->name('post.image_upload');
    Route::post('/post','store')->middleware('auth:sanctum')->name('post.store');
    Route::delete('/post/{post}','destroy')->middleware('auth:sanctum')->name('post.destroy');
});