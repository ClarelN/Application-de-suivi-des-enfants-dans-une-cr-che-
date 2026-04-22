<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use App\Models\Enfant;
use Illuminate\Http\Request;

class EvenementController extends Controller
{
    public function index()
    {
        $evenements = Evenement::withCount('enfants')->latest()->paginate(10);
        return view('evenements.index', compact('evenements'));
    }

    public function create()
    {
        return view('evenements.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date|after:date_debut',
            'places_max'  => 'nullable|integer|min:1',
        ]);

        Evenement::create($request->all());

        return redirect()->route('evenements.index')
            ->with('success', 'Événement créé avec succès !');
    }

    public function show(Evenement $evenement)
    {
        $evenement->load('enfants');
        return view('evenements.show', compact('evenement'));
    }

    // Inscrire un enfant à une sortie
    public function inscrire(Request $request, Evenement $evenement)
    {
        $request->validate([
            'enfant_id' => 'required|exists:enfants,id',
        ]);

        if ($evenement->placesRestantes() <= 0) {
            return redirect()->back()
                ->with('error', 'Plus de places disponibles !');
        }

        $evenement->enfants()->syncWithoutDetaching($request->enfant_id);

        return redirect()->back()
            ->with('success', 'Enfant inscrit à l\'événement !');
    }

    // Désinscrire un enfant
    public function desinscrire(Request $request, Evenement $evenement)
    {
        $request->validate([
            'enfant_id' => 'required|exists:enfants,id',
        ]);

        $evenement->enfants()->detach($request->enfant_id);

        return redirect()->back()
            ->with('success', 'Enfant désinscrit de l\'événement.');
    }

    public function destroy(Evenement $evenement)
    {
        $evenement->delete();
        return redirect()->route('evenements.index')
            ->with('success', 'Événement supprimé.');
    }
}
