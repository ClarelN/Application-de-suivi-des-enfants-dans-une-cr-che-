<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Repas;
use App\Models\Enfant;
use Illuminate\Http\Request;

class ConsommationRepasController extends Controller
{
    // GET /api/repas/{repas}/consommations
    public function index(Repas $repas)
    {
        $consommations = $repas->enfants()
            ->withPivot('quantite_mangee', 'commentaires')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $consommations,
        ]);
    }

    // POST /api/repas/{repas}/consommations
    // Enregistrer ce qu'un enfant a mangé
    public function store(Request $request, Repas $repas)
    {
        $request->validate([
            'enfant_id'      => 'required|exists:enfants,id',
            'quantite_mangee'=> 'required|in:tout,un_peu,rien',
            'commentaires'   => 'nullable|string',
        ]);

        // updateOrCreate pour éviter les doublons
        $repas->enfants()->syncWithoutDetaching([
            $request->enfant_id => [
                'quantite_mangee' => $request->quantite_mangee,
                'commentaires'    => $request->commentaires,
            ]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consommation enregistrée.',
        ], 201);
    }

    // POST /api/repas/{repas}/consommations/groupe
    // Enregistrer pour tous les enfants d'un coup
    public function storeGroupe(Request $request, Repas $repas)
    {
        $request->validate([
            'consommations'                  => 'required|array',
            'consommations.*.enfant_id'      => 'required|exists:enfants,id',
            'consommations.*.quantite_mangee'=> 'required|in:tout,un_peu,rien',
            'consommations.*.commentaires'   => 'nullable|string',
        ]);

        $data = [];
        foreach ($request->consommations as $c) {
            $data[$c['enfant_id']] = [
                'quantite_mangee' => $c['quantite_mangee'],
                'commentaires'    => $c['commentaires'] ?? null,
            ];
        }

        $repas->enfants()->syncWithoutDetaching($data);

        return response()->json([
            'success' => true,
            'message' => 'Consommations du groupe enregistrées.',
        ], 201);
    }

    // DELETE /api/repas/{repas}/consommations/{enfant}
    public function destroy(Repas $repas, Enfant $enfant)
    {
        $repas->enfants()->detach($enfant->id);

        return response()->json([
            'success' => true,
            'message' => 'Consommation supprimée.',
        ]);
    }
}
