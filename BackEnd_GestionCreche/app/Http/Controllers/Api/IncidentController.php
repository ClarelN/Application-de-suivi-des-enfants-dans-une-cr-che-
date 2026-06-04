<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IncidentResource;
use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncidentController extends Controller
{
    public function index()
    {
        $incidents = Incident::with('enfant')->latest()->paginate(20);
        return IncidentResource::collection($incidents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'gravite'     => 'required|in:faible,moyen,eleve',
            'enfant_id'   => 'nullable|exists:enfants,id',
            'date'        => 'required|date',
        ]);

        $incident = Incident::create([
            'type'         => $request->type,
            'description'  => $request->description,
            'gravite'      => $request->gravite,
            'enfant_id'    => $request->enfant_id,
            'date'         => $request->date,
            'educateur_id' => Auth::id(),
            'traite'       => false,
        ]);

        return (new IncidentResource($incident->load('enfant')))
            ->response()->setStatusCode(201);
    }

    public function update(Request $request, Incident $incident)
    {
        $request->validate([
            'traite'      => 'sometimes|boolean',
            'gravite'     => 'sometimes|in:faible,moyen,eleve',
            'type'        => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
        ]);

        $incident->update($request->only('traite', 'gravite', 'type', 'description'));

        return new IncidentResource($incident->load('enfant'));
    }
}
