<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index()
    {
        $utilisateurs = Utilisateur::paginate(10);
        return view('utilisateurs.index', compact('utilisateurs'));
    }

    public function create()
    {
        return view('utilisateurs.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:utilisateurs',
            'mot_de_passe' => 'required|string|min:8',
            'role'     => 'required|string|in:admin,educateur,parent',
        ]);

        $data = $request->all();
        $data['mot_de_passe'] = bcrypt($data['mot_de_passe']);

        Utilisateur::create($data);

        return redirect()->route('utilisateurs.index')
            ->with('success', 'Utilisateur ajouté avec succès !');
    }

    public function show(Utilisateur $utilisateur)
    {
        return view('utilisateurs.show', compact('utilisateur'));
    }

    public function edit(Utilisateur $utilisateur)
    {
        return view('utilisateurs.edit', compact('utilisateur'));
    }

    public function update(Request $request, Utilisateur $utilisateur)
    {
        $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'email'    => 'required|email|unique:utilisateurs,email,' . $utilisateur->id,
            'role'     => 'required|string|in:admin,educateur,parent',
        ]);

        $utilisateur->update($request->all());

        return redirect()->route('utilisateurs.index')
            ->with('success', 'Utilisateur mis à jour avec succès !');
    }

    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();

        return redirect()->route('utilisateurs.index')
            ->with('success', 'Utilisateur supprimé avec succès !');
    }
}
