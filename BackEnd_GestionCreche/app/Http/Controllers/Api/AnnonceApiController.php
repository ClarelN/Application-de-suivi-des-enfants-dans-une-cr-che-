<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnonceResource;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnonceApiController extends Controller
{
    public function index()
    {
        $annonces = Annonce::with('auteur')->latest()->paginate(10);

        return AnnonceResource::collection($annonces);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'     => 'required|string|max:255',
            'corps'     => 'required|string',
            'cible'     => 'required|in:tous,parents,educateurs',
            'expire_le' => 'nullable|date|after:today',
        ]);

        $annonce = Annonce::create([
            ...$request->all(),
            'user_id' => Auth::id(),
        ]);

        return (new AnnonceResource($annonce))
            ->additional(['message' => 'Annonce publiée.'])
            ->response()->setStatusCode(201);
    }

    public function show(Annonce $annonce)
    {
        return new AnnonceResource($annonce->load('auteur'));
    }

    public function update(Request $request, Annonce $annonce)
    {
        $request->validate([
            'titre'     => 'sometimes|string|max:255',
            'corps'     => 'sometimes|string',
            'cible'     => 'sometimes|in:tous,parents,educateurs',
            'expire_le' => 'nullable|date',
        ]);

        $annonce->update($request->all());

        return new AnnonceResource($annonce->load('auteur'));
    }

    public function destroy(Annonce $annonce)
    {
        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée.']);
    }
}
