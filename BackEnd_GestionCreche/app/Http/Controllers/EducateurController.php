<?php

namespace App\Http\Controllers;

use App\Models\Educateur;
use App\Models\Groupe;
use Illuminate\Http\Request;

class EducateurController extends Controller
{
    public function index()
    {
        $educateurs = Educateur::with('groupe')->paginate(10);
        return view('educateurs.index', compact('educateurs'));
    }

    public function create()
    {
        $groupes = Groupe::all();
        return view('educateurs.create', compact('groupes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:educateurs',
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string',
            'groupe_id' => 'nullable|exists:groupes,id',
            'diplome'   => 'nullable|string',
        ]);

        Educateur::create($request->all());

        return redirect()->route('educateurs.index')
            ->with('success', 'Éducateur ajouté avec succès !');
    }

    public function show(Educateur $educateur)
    {
        $educateur->load('groupe');
        return view('educateurs.show', compact('educateur'));
    }

    public function edit(Educateur $educateur)
    {
        $groupes = Groupe::all();
        return view('educateurs.edit', compact('educateur', 'groupes'));
    }

    public function update(Request $request, Educateur $educateur)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:educateurs,email,' . $educateur->id,
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string',
            'groupe_id' => 'nullable|exists:groupes,id',
            'diplome'   => 'nullable|string',
        ]);

        $educateur->update($request->all());

        return redirect()->route('educateurs.index')
            ->with('success', 'Éducateur mis à jour avec succès !');
    }

    public function destroy(Educateur $educateur)
    {
        $educateur->delete();

        return redirect()->route('educateurs.index')
            ->with('success', 'Éducateur supprimé avec succès !');
    }
}
