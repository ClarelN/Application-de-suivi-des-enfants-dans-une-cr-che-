<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnfantResource;
use App\Models\Enfant;
use Illuminate\Http\Request;

class EnfantApiController extends Controller
{
    public function index()
    {
        $enfants = Enfant::with('groupe', 'personnesAutorisees')->paginate(10);
        return EnfantResource::collection($enfants);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'sexe'           => 'required|in:M,F',
            'groupe_id'      => 'nullable|exists:groupes,id',
            'allergie'       => 'nullable|string',
            'obs_medicale'   => 'nullable|string',
        ]);

        $enfant = Enfant::create($request->all());

        return new EnfantResource($enfant);
    }

    public function show(Enfant $enfant)
    {
        $enfant->load('groupe', 'personnesAutorisees');
        return new EnfantResource($enfant);
    }

    public function update(Request $request, Enfant $enfant)
    {
        $request->validate([
            'nom'            => 'sometimes|string|max:255',
            'prenom'         => 'sometimes|string|max:255',
            'date_naissance' => 'sometimes|date',
            'sexe'           => 'sometimes|in:M,F',
            'groupe_id'      => 'nullable|exists:groupes,id',
            'allergie'       => 'nullable|string',
            'obs_medicale'   => 'nullable|string',
        ]);

        $enfant->update($request->all());

        return new EnfantResource($enfant);
    }

    public function destroy(Enfant $enfant)
    {
        $enfant->delete();
        return response()->json(['message' => 'Enfant supprimé avec succès.'], 200);
    }
}
