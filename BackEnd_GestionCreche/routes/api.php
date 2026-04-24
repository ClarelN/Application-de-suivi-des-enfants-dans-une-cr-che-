<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProfilController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EnfantApiController;
use App\Http\Controllers\Api\GroupeApiController;

// Routes publiques (authentification)
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Routes API pour les ressources principales
Route::apiResource('enfants', EnfantApiController::class);
Route::apiResource('groupes', GroupeApiController::class);

// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfilController::class, 'show'])->name('api.profile.show');
        Route::put('/', [ProfilController::class, 'update'])->name('api.profile.update');
        Route::put('/password', [ProfilController::class, 'updatePassword'])->name('api.profile.password');
    });

    // Enfants d'un groupe spécifique
Route::get('groupes/{groupe}/enfants', function (\App\Models\Groupe $groupe) {
    return \App\Http\Resources\EnfantResource::collection(
        $groupe->enfants()->with('personnesAutorisees')->get()
    );
})->name('api.groupes.enfants');

    // Endpoints API à configurer (structure pour futurs développements)
    // Route::apiResource('enfants', ...);
    // Route::apiResource('groupes', ...);
    // Route::apiResource('activites', ...);
    // Route::apiResource('presences', ...);
    // Route::apiResource('educateurs', ...);
    // Route::apiResource('parents', ...);
    // Route::apiResource('administrateurs', ...);
});
