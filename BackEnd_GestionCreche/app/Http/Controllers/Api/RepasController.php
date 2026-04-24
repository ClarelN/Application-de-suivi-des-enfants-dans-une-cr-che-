<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Repas;
use Illuminate\Http\Request;

class RepasController extends Controller
{
    // GET /api/repas
    public function index()
    {
        $repas = Repas::with('enfants')
            ->orderBy('date', 'desc')
            ->orderBy('heure', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $repas,
        ]);
    }

    // POST /api/repas
    public function store(Request $request)
    {
        $request->validate([
            'nom_repas'   => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'heure'       => 'required|date_format:H:i',
        ]);

        $repas = Repas::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Repas créé avec succès.',
            'data'    => $repas,
        ], 201);
    }

    // GET /api/repas/{id}
    public function show(Repas $repas)
    {
        $repas->load('enfants');

        return response()->json([
            'success' => true,
            'data'    => $repas,
        ]);
    }

    // PUT /api/repas/{id}
    public function update(Request $request, Repas $repas)
    {
        $request->validate([
            'nom_repas'   => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'sometimes|date',
            'heure'       => 'sometimes|date_format:H:i',
        ]);

        $repas->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Repas modifié avec succès.',
            'data'    => $repas,
        ]);
    }

    // DELETE /api/repas/{id}
    public function destroy(Repas $repas)
    {
        $repas->delete();

        return response()->json([
            'success' => true,
            'message' => 'Repas supprimé avec succès.',
        ]);
    }
}
