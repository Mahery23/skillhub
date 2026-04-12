<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\ModuleController;
use Illuminate\Support\Facades\Route;

defined('FORMATION_ROUTE') || define('FORMATION_ROUTE', '/formations/{formation}');
defined('FORMATION_MODULES_ROUTE') || define('FORMATION_MODULES_ROUTE', '/formations/{formation}/modules');
defined('FORMATION_ENROLLMENT_ROUTE') || define('FORMATION_ENROLLMENT_ROUTE', '/formations/{formation}/inscription');
defined('MODULE_ROUTE') || define('MODULE_ROUTE', '/modules/{module}');

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
});

Route::middleware(['auth:api', 'check.role:formateur'])->group(function () {
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put(FORMATION_ROUTE, [FormationController::class, 'update']);
    Route::delete(FORMATION_ROUTE, [FormationController::class, 'destroy']);

    Route::post(FORMATION_MODULES_ROUTE, [ModuleController::class, 'store']);
    Route::put(MODULE_ROUTE, [ModuleController::class, 'update']);
    Route::delete(MODULE_ROUTE, [ModuleController::class, 'destroy']);
});

Route::middleware(['auth:api', 'check.role:apprenant'])->group(function () {
    Route::post(FORMATION_ENROLLMENT_ROUTE, [EnrollmentController::class, 'store']);
    Route::delete(FORMATION_ENROLLMENT_ROUTE, [EnrollmentController::class, 'destroy']);
    Route::get('/apprenant/formations', [EnrollmentController::class, 'mesFormations']);
});
