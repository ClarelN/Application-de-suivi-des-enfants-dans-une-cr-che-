<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GroupeResource;
use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeApiController extends Controller
{
    public function index()
    {
        $groupes = Groupe::withCount('enfants')->paginate(10);
        return GroupeResource::collection($groupes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'          => 'required|string|max:255',
            'age_min_mois' => 'required|integer|min:0',
            'age_max_mois' => 'required|integer|gt:age_min_mois',
            'capacite_max' => 'required|integer|min:1',
            'couleur'      => 'nullable|string|max:7',
        ]);

        $groupe = Groupe::create($request->all());
        return new GroupeResource($groupe);
    }

    public function show(Groupe $groupe)
    {
        $groupe->load('enfants');
        return new GroupeResource($groupe);
    }

    public function update(Request $request, Groupe $groupe)
    {
        $request->validate([
            'nom'          => 'sometimes|string|max:255',
            'age_min_mois' => 'sometimes|integer|min:0',
            'age_max_mois' => 'sometimes|integer|gt:age_min_mois',
            'capacite_max' => 'sometimes|integer|min:1',
            'couleur'      => 'nullable|string|max:7',
        ]);

        $groupe->update($request->all());
        return new GroupeResource($groupe);
    }

    public function destroy(Groupe $groupe)
    {
        $groupe->delete();
        return response()->json(['message' => 'Groupe supprimé avec succès.'], 200);
    }
}
