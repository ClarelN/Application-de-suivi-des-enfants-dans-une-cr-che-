<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function index()
    {
        $groupes = Groupe::withCount('enfants')->paginate(10);
        return view('groupes.index', compact('groupes'));
    }

    public function create()
    {
        return view('groupes.create');
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

        Groupe::create($request->all());

        return redirect()->route('groupes.index')
            ->with('success', 'Groupe créé avec succès !');
    }

    public function show(Groupe $groupe)
    {
        $groupe->load('enfants', 'educateurs');
        return view('groupes.show', compact('groupe'));
    }

    public function edit(Groupe $groupe)
    {
        return view('groupes.edit', compact('groupe'));
    }

    public function update(Request $request, Groupe $groupe)
    {
        $request->validate([
            'nom'          => 'required|string|max:255',
            'age_min_mois' => 'required|integer|min:0',
            'age_max_mois' => 'required|integer|gt:age_min_mois',
            'capacite_max' => 'required|integer|min:1',
            'couleur'      => 'nullable|string|max:7',
        ]);

        $groupe->update($request->all());

        return redirect()->route('groupes.index')
            ->with('success', 'Groupe modifié avec succès !');
    }

    public function destroy(Groupe $groupe)
    {
        $groupe->delete();
        return redirect()->route('groupes.index')
            ->with('success', 'Groupe supprimé avec succès !');
    }
}
