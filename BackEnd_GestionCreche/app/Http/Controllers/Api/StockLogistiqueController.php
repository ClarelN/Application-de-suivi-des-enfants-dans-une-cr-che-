<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockLogistique;
use Illuminate\Http\Request;

class StockLogistiqueController extends Controller
{
    // GET /api/stocks
    public function index()
    {
        $stocks = StockLogistique::orderBy('produit')->get();

        // Séparer les produits en alerte
        $enAlerte = $stocks->filter(fn($s) => $s->estEnAlerte());

        return response()->json([
            'success'   => true,
            'data'      => $stocks,
            'en_alerte' => $enAlerte->values(),
        ]);
    }

    // POST /api/stocks
    public function store(Request $request)
    {
        $request->validate([
            'produit'           => 'required|string|max:255',
            'quantite_actuelle' => 'required|numeric|min:0',
            'unite'             => 'required|string|max:50',
            'seuil_alerte'      => 'required|numeric|min:0',
        ]);

        $stock = StockLogistique::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté au stock.',
            'data'    => $stock,
        ], 201);
    }

    // GET /api/stocks/{id}
    public function show(StockLogistique $stockLogistique)
    {
        return response()->json([
            'success'   => true,
            'data'      => $stockLogistique,
            'en_alerte' => $stockLogistique->estEnAlerte(),
        ]);
    }

    // PUT /api/stocks/{id}
    public function update(Request $request, StockLogistique $stockLogistique)
    {
        $request->validate([
            'produit'           => 'sometimes|string|max:255',
            'quantite_actuelle' => 'sometimes|numeric|min:0',
            'unite'             => 'sometimes|string|max:50',
            'seuil_alerte'      => 'sometimes|numeric|min:0',
        ]);

        $stockLogistique->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Stock mis à jour.',
            'data'    => $stockLogistique,
        ]);
    }

    // DELETE /api/stocks/{id}
    public function destroy(StockLogistique $stockLogistique)
    {
        $stockLogistique->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé du stock.',
        ]);
    }
}
