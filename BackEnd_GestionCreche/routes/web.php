<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EnfantController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\PersonneAutoriseeController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AdministrateurController;
use App\Http\Controllers\EducateurController;
use App\Http\Controllers\ParentController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\EvenementController;

// Ressources principales
Route::resource('enfants', EnfantController::class);
Route::resource('groupes', GroupeController::class);
Route::resource('personnes-autorisees', PersonneAutoriseeController::class);

// Activités et présences
Route::resource('activities', ActivityController::class);
Route::resource('attendances', AttendanceController::class);

// Personnel et gestion
Route::resource('administrateurs', AdministrateurController::class);
Route::resource('educateurs', EducateurController::class);
Route::resource('parents', ParentController::class);
Route::resource('utilisateurs', UtilisateurController::class);

// Communication
Route::resource('messages', MessageController::class);
Route::resource('annonces', AnnonceController::class);
Route::resource('evenements', EvenementController::class);

// Routes spéciales
Route::post('attendances/mark', [AttendanceController::class, 'markAttendance'])
    ->name('attendances.mark');
Route::get('attendances/daily-report', [AttendanceController::class, 'dailyReport'])
    ->name('attendances.daily-report');

    // Inscription / désinscription aux sorties
Route::post('evenements/{evenement}/inscrire', [EvenementController::class, 'inscrire'])
    ->name('evenements.inscrire');
Route::post('evenements/{evenement}/desinscrire', [EvenementController::class, 'desinscrire'])
    ->name('evenements.desinscrire');

Route::get('/', function () {
    return view('welcome');
});
