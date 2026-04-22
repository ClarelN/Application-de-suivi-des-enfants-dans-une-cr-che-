<?php

namespace App\Http\Controllers;

use App\Models\ParentModel;
use App\Models\Enfant;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    public function index()
    {
        $parents = ParentModel::paginate(10);
        return view('parents.index', compact('parents'));
    }

    public function create()
    {
        $enfants = Enfant::all();
        return view('parents.create', compact('enfants'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:parent_models',
            'telephone' => 'required|string|max:20',
            'adresse'   => 'nullable|string',
            'profession' => 'nullable|string',
            'enfant_id' => 'nullable|exists:enfants,id',
        ]);

        ParentModel::create($request->all());

        return redirect()->route('parents.index')
            ->with('success', 'Parent ajouté avec succès !');
    }

    public function show(ParentModel $parent)
    {
        $parent->load('enfants');
        return view('parents.show', compact('parent'));
    }

    public function edit(ParentModel $parent)
    {
        $enfants = Enfant::all();
        return view('parents.edit', compact('parent', 'enfants'));
    }

    public function update(Request $request, ParentModel $parent)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:parent_models,email,' . $parent->id,
            'telephone' => 'required|string|max:20',
            'adresse'   => 'nullable|string',
            'profession' => 'nullable|string',
            'enfant_id' => 'nullable|exists:enfants,id',
        ]);

        $parent->update($request->all());

        return redirect()->route('parents.index')
            ->with('success', 'Parent mis à jour avec succès !');
    }

    public function destroy(ParentModel $parent)
    {
        $parent->delete();

        return redirect()->route('parents.index')
            ->with('success', 'Parent supprimé avec succès !');
    }
}
