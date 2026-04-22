<?php

namespace App\Http\Controllers;

use App\Models\Administrateur;
use Illuminate\Http\Request;

class AdministrateurController extends Controller
{
    public function index()
    {
        $administrateurs = Administrateur::paginate(10);
        return view('administrateurs.index', compact('administrateurs'));
    }

    public function create()
    {
        return view('administrateurs.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:administrateurs',
            'telephone' => 'nullable|string|max:20',
            'adresse'  => 'nullable|string',
        ]);

        Administrateur::create($request->all());

        return redirect()->route('administrateurs.index')
            ->with('success', 'Administrateur ajouté avec succès !');
    }

    public function show(Administrateur $administrateur)
    {
        return view('administrateurs.show', compact('administrateur'));
    }

    public function edit(Administrateur $administrateur)
    {
        return view('administrateurs.edit', compact('administrateur'));
    }

    public function update(Request $request, Administrateur $administrateur)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:administrateurs,email,' . $administrateur->id,
            'telephone' => 'nullable|string|max:20',
            'adresse'  => 'nullable|string',
        ]);

        $administrateur->update($request->all());

        return redirect()->route('administrateurs.index')
            ->with('success', 'Administrateur mis à jour avec succès !');
    }

    public function destroy(Administrateur $administrateur)
    {
        $administrateur->delete();

        return redirect()->route('administrateurs.index')
            ->with('success', 'Administrateur supprimé avec succès !');
    }
}
