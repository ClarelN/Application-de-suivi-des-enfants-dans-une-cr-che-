<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TarifResource;
use App\Models\Tarif;
use Illuminate\Http\Request;

class TarifController extends Controller
{
    public function index()
    {
        $tarifs = Tarif::with('groupe')->latest()->paginate(50);
        return TarifResource::collection($tarifs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'groupe_id'         => 'required|exists:groupes,id',
            'montant_mensuel'   => 'required|numeric|min:0',
            'frais_inscription' => 'required|numeric|min:0',
            'date_effet'        => 'required|date',
            'actif'             => 'boolean',
        ]);

        $tarif = Tarif::create($request->all());

        return (new TarifResource($tarif->load('groupe')))->response()->setStatusCode(201);
    }

    public function update(Request $request, Tarif $tarif)
    {
        $request->validate([
            'groupe_id'         => 'sometimes|exists:groupes,id',
            'montant_mensuel'   => 'sometimes|numeric|min:0',
            'frais_inscription' => 'sometimes|numeric|min:0',
            'date_effet'        => 'sometimes|date',
            'actif'             => 'boolean',
        ]);

        $tarif->update($request->all());

        return new TarifResource($tarif->load('groupe'));
    }
}
