<?php

namespace App\Http\Controllers;

use App\Models\Enfant;
use App\Models\Groupe;
use Illuminate\Http\Request;

class EnfantController extends Controller
{
    public function index()
    {
        $enfants = Enfant::with('groupe')->paginate(10);
        return view('enfants.index', compact('enfants'));
    }

    public function create()
    {
        $groupes = Groupe::all();
        return view('enfants.create', compact('groupes'));
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
            'photo_chemin'   => 'nullable|image|max:2048',
        ]);

        $data = $request->except('photo_chemin');

        if ($request->hasFile('photo_chemin')) {
            $data['photo_chemin'] = $request->file('photo_chemin')
                ->store('photos/enfants', 'public');
        }

        Enfant::create($data);

        return redirect()->route('enfants.index')
            ->with('success', 'Enfant ajouté avec succès !');
    }

    public function show(Enfant $enfant)
    {
        $enfant->load('groupe', 'personnesAutorisees', 'presences', 'suivisJournaliers');
        return view('enfants.show', compact('enfant'));
    }

    public function edit(Enfant $enfant)
    {
        $groupes = Groupe::all();
        return view('enfants.edit', compact('enfant', 'groupes'));
    }

    public function update(Request $request, Enfant $enfant)
    {
        $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'sexe'           => 'required|in:M,F',
            'groupe_id'      => 'nullable|exists:groupes,id',
            'allergie'       => 'nullable|string',
            'obs_medicale'   => 'nullable|string',
            'photo_chemin'   => 'nullable|image|max:2048',
        ]);

        $data = $request->except('photo_chemin');

        if ($request->hasFile('photo_chemin')) {
            $data['photo_chemin'] = $request->file('photo_chemin')
                ->store('photos/enfants', 'public');
        }

        $enfant->update($data);

        return redirect()->route('enfants.index')
            ->with('success', 'Enfant modifié avec succès !');
    }

    public function destroy(Enfant $enfant)
    {
        $enfant->delete(); // SoftDelete
        return redirect()->route('enfants.index')
            ->with('success', 'Enfant supprimé avec succès !');
    }
}
