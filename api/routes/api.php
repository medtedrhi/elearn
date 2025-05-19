<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


// Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile/{id}', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
