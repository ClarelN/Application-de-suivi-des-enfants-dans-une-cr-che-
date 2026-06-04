<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\Api\EnfantApiController;
use App\Http\Controllers\Api\GroupeApiController;
use App\Http\Controllers\Api\AttendanceApiController;
use App\Http\Controllers\Api\ActivityApiController;
use App\Http\Controllers\Api\MessageApiController;
use App\Http\Controllers\Api\AnnonceApiController;
use App\Http\Controllers\Api\RepasController;
use App\Http\Controllers\Api\ConsommationRepasController;
use App\Http\Controllers\Api\StockLogistiqueController;
use App\Http\Controllers\Api\UtilisateurApiController;
use App\Http\Controllers\Api\SuiviJournalierController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\TarifController;
use App\Http\Controllers\Api\FactureController;
use App\Http\Controllers\Api\ParentController;
use Illuminate\Support\Facades\Route;

// ─── Public ──────────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// ─── Protégé (Sanctum) ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Profil utilisateur
    Route::prefix('profile')->name('api.profile.')->group(function () {
        Route::get('/',         [ProfilController::class, 'show'])->name('show');
        Route::put('/',         [ProfilController::class, 'update'])->name('update');
        Route::put('/password', [ProfilController::class, 'updatePassword'])->name('password');
    });

    // ── Noyau : Enfants & Groupes ─────────────────────────────────────────────
    Route::apiResource('enfants', EnfantApiController::class);
    Route::apiResource('groupes', GroupeApiController::class);
    Route::get('groupes/{groupe}/enfants', function (\App\Models\Groupe $groupe) {
        return \App\Http\Resources\EnfantResource::collection(
            $groupe->enfants()->with('personnesAutorisees')->get()
        );
    })->name('api.groupes.enfants');

    // ── Suivi : Présences ─────────────────────────────────────────────────────
    Route::get('presences/rapport-journalier', [AttendanceApiController::class, 'dailyReport'])
        ->name('api.presences.rapport');
    Route::apiResource('presences', AttendanceApiController::class);

    // ── Suivi : Activités journalières ────────────────────────────────────────
    Route::apiResource('activites', ActivityApiController::class)
        ->parameters(['activites' => 'activity']);

    // ── Communication : Messages ──────────────────────────────────────────────
    // Les routes nommées DOIVENT être avant apiResource pour éviter que
    // "contacts" et "conversation" soient interprétés comme des {message}
    Route::get('messages/contacts', [MessageApiController::class, 'contacts']);
    Route::get('messages/conversation/{userId}', [MessageApiController::class, 'conversation']);
    Route::apiResource('messages', MessageApiController::class)->only([
        'index', 'store', 'show', 'destroy',
    ]);

    // ── Communication : Annonces ──────────────────────────────────────────────
    Route::apiResource('annonces', AnnonceApiController::class)->except([
        'create', 'edit',
    ]);

    // ── Logistique : Repas & Consommations ────────────────────────────────────
    Route::apiResource('repas', RepasController::class)
        ->parameters(['repas' => 'repas']);
    Route::prefix('repas/{repas}/consommations')->name('api.repas.consommations.')->group(function () {
        Route::get('/',          [ConsommationRepasController::class, 'index'])->name('index');
        Route::post('/',         [ConsommationRepasController::class, 'store'])->name('store');
        Route::post('/groupe',   [ConsommationRepasController::class, 'storeGroupe'])->name('groupe');
        Route::delete('/{enfant}', [ConsommationRepasController::class, 'destroy'])->name('destroy');
    });

    // ── Logistique : Stocks ───────────────────────────────────────────────────
    Route::apiResource('stocks', StockLogistiqueController::class)
        ->parameters(['stocks' => 'stockLogistique']);

    // ── Utilisateurs ──────────────────────────────────────────────────────────
    Route::get('utilisateurs', [UtilisateurApiController::class, 'index']);
    Route::post('utilisateurs', [UtilisateurApiController::class, 'store']);
    Route::put('utilisateurs/{utilisateur}', [UtilisateurApiController::class, 'update']);

    // ── Suivi journalier ──────────────────────────────────────────────────────
    Route::get('suivis', [SuiviJournalierController::class, 'index']);
    Route::post('suivis', [SuiviJournalierController::class, 'store']);

    // ── Incidents ─────────────────────────────────────────────────────────────
    Route::get('incidents', [IncidentController::class, 'index']);
    Route::post('incidents', [IncidentController::class, 'store']);
    Route::patch('incidents/{incident}', [IncidentController::class, 'update']);

    // ── Tarifs ────────────────────────────────────────────────────────────────
    Route::get('tarifs', [TarifController::class, 'index']);
    Route::post('tarifs', [TarifController::class, 'store']);
    Route::put('tarifs/{tarif}', [TarifController::class, 'update']);

    // ── Factures ─────────────────────────────────────────────────────────────
    Route::get('factures', [FactureController::class, 'index']);
    Route::post('factures/{facture}/paiement', [FactureController::class, 'paiement']);

    // ── Messages : PATCH marquer lu ───────────────────────────────────────────
    Route::patch('messages/{message}', [MessageApiController::class, 'update']);

    // ── Espace parent ─────────────────────────────────────────────────────────
    Route::prefix('parent')->group(function () {
        Route::get('enfant',   [ParentController::class, 'enfant']);
        Route::get('suivis',   [ParentController::class, 'suivis']);
        Route::get('factures', [ParentController::class, 'factures']);
        Route::post('absences', [ParentController::class, 'signalerAbsence']);
    });
});
