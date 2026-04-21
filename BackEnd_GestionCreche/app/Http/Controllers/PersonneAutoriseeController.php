<?php

namespace App\Http\Controllers;

use App\Models\PersonneAutorisee;
use App\Models\Enfant;
use Illuminate\Http\Request;

class PersonneAutoriseeController extends Controller
{
    public function index()
    {
        $personnes = PersonneAutorisee::with('enfant')->paginate(10);
        return view('personnes_autorisees.index', compact('personnes'));
    }

    public function create()
    {
        $enfants = Enfant::all();
        return view('personnes_autorisees.create', compact('enfants'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'enfant_id'    => 'required|exists:enfants,id',
            'nom'          => 'required|string|max:255',
            'prenom'       => 'required|string|max:255',
            'lien_parente' => 'required|string|max:255',
            'telephone'    => 'required|string|max:20',
        ]);

        PersonneAutorisee::create($request->all());

        return redirect()->route('personnes-autorisees.index')
            ->with('success', 'Personne autorisée ajoutée avec succès !');
    }

    public function show(PersonneAutorisee $personneAutorisee)
    {
        return view('personnes_autorisees.show', compact('personneAutorisee'));
    }

    public function edit(PersonneAutorisee $personneAutorisee)
    {
        $enfants = Enfant::all();
        return view('personnes_autorisees.edit', compact('personneAutorisee', 'enfants'));
    }

    public function update(Request $request, PersonneAutorisee $personneAutorisee)
    {
        $request->validate([
            'enfant_id'    => 'required|exists:enfants,id',
            'nom'          => 'required|string|max:255',
            'prenom'       => 'required|string|max:255',
            'lien_parente' => 'required|string|max:255',
            'telephone'    => 'required|string|max:20',
        ]);

        $personneAutorisee->update($request->all());

        return redirect()->route('personnes-autorisees.index')
            ->with('success', 'Personne autorisée modifiée avec succès !');
    }

    public function destroy(PersonneAutorisee $personneAutorisee)
    {
        $personneAutorisee->delete();
        return redirect()->route('personnes-autorisees.index')
            ->with('success', 'Personne autorisée supprimée avec succès !');
    }
}
