<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RepasResource;
use App\Models\Repas;
use Illuminate\Http\Request;

class RepasController extends Controller
{
    public function index()
    {
        $repas = Repas::orderBy('date', 'desc')
            ->orderBy('heure', 'desc')
            ->paginate(10);

        return RepasResource::collection($repas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_repas'   => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'heure'       => 'required|date_format:H:i',
        ]);

        $repas = Repas::create($request->all());

        return (new RepasResource($repas))
            ->additional(['message' => 'Repas créé avec succès.'])
            ->response()->setStatusCode(201);
    }

    public function show(Repas $repas)
    {
        return new RepasResource($repas->load('enfants'));
    }

    public function update(Request $request, Repas $repas)
    {
        $request->validate([
            'nom_repas'   => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'sometimes|date',
            'heure'       => 'sometimes|date_format:H:i',
        ]);

        $repas->update($request->all());

        return new RepasResource($repas);
    }

    public function destroy(Repas $repas)
    {
        $repas->delete();

        return response()->json(['message' => 'Repas supprimé avec succès.']);
    }
}
