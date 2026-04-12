<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\ModuleController;
use Illuminate\Support\Facades\Route;

const FORMATION_ROUTE = '/formations/{formation}';
const FORMATION_MODULES_ROUTE = '/formations/{formation}/modules';
const MODULE_ROUTE = '/modules/{module}';

// Endpoints publics d'authentification.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Catalogue des formations.
Route::get('/formations', [FormationController::class, 'index']);
Route::get(FORMATION_ROUTE, [FormationController::class, 'show']);
Route::get(FORMATION_MODULES_ROUTE, [ModuleController::class, 'index']);

// Routes protégées par JWT.
Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/formations', [FormationController::class, 'store']);
    Route::put(FORMATION_ROUTE, [FormationController::class, 'update']);
    Route::delete(FORMATION_ROUTE, [FormationController::class, 'destroy']);

    Route::post(FORMATION_MODULES_ROUTE, [ModuleController::class, 'store']);
    Route::put(MODULE_ROUTE, [ModuleController::class, 'update']);
    Route::delete(MODULE_ROUTE, [ModuleController::class, 'destroy']);
});
