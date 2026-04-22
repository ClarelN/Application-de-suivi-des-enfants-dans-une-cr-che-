<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnonceController extends Controller
{
    public function index()
    {
        $annonces = Annonce::with('auteur')->latest()->paginate(10);
        return view('annonces.index', compact('annonces'));
    }

    public function create()
    {
        return view('annonces.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'     => 'required|string|max:255',
            'corps'     => 'required|string',
            'cible'     => 'required|in:tous,parents,educateurs',
            'expire_le' => 'nullable|date|after:today',
        ]);

        Annonce::create([
            ...$request->all(),
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('annonces.index')
            ->with('success', 'Annonce publiée avec succès !');
    }

    public function show(Annonce $annonce)
    {
        return view('annonces.show', compact('annonce'));
    }

    public function edit(Annonce $annonce)
    {
        return view('annonces.edit', compact('annonce'));
    }

    public function update(Request $request, Annonce $annonce)
    {
        $request->validate([
            'titre'     => 'required|string|max:255',
            'corps'     => 'required|string',
            'cible'     => 'required|in:tous,parents,educateurs',
            'expire_le' => 'nullable|date',
        ]);

        $annonce->update($request->all());

        return redirect()->route('annonces.index')
            ->with('success', 'Annonce modifiée avec succès !');
    }

    public function destroy(Annonce $annonce)
    {
        $annonce->delete();
        return redirect()->route('annonces.index')
            ->with('success', 'Annonce supprimée.');
    }
}
