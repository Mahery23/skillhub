<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\ModuleController;
use Illuminate\Support\Facades\Route;

// ← Remplacer les const par des variables
$formationRoute           = '/formations/{formation}';
$formationModulesRoute    = '/formations/{formation}/modules';
$formationEnrollmentRoute = '/formations/{formation}/inscription';
$moduleRoute              = '/modules/{module}';

// Endpoints publics d'authentification.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Catalogue des formations.
Route::get('/formations', [FormationController::class, 'index']);
Route::get($formationRoute, [FormationController::class, 'show']);
Route::get($formationModulesRoute, [ModuleController::class, 'index']);

// Routes protégées par JWT.
Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:api', 'check.role:formateur'])->group(function () use ($formationRoute, $formationModulesRoute, $moduleRoute) {
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put($formationRoute, [FormationController::class, 'update']);
    Route::delete($formationRoute, [FormationController::class, 'destroy']);

    Route::post($formationModulesRoute, [ModuleController::class, 'store']);
    Route::put($moduleRoute, [ModuleController::class, 'update']);
    Route::delete($moduleRoute, [ModuleController::class, 'destroy']);
});

Route::middleware(['auth:api', 'check.role:apprenant'])->group(function () use ($formationEnrollmentRoute) {
    Route::post($formationEnrollmentRoute, [EnrollmentController::class, 'store']);
    Route::delete($formationEnrollmentRoute, [EnrollmentController::class, 'destroy']);
    Route::get('/apprenant/formations', [EnrollmentController::class, 'mesFormations']);
});
