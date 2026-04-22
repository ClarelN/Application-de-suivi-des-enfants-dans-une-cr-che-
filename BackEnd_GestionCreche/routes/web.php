<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EnfantController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\PersonneAutoriseeController;

Route::resource('enfants', EnfantController::class);
Route::resource('groupes', GroupeController::class);
Route::resource('personnes-autorisees', PersonneAutoriseeController::class);

Route::get('/', function () {
    return view('welcome');
});
