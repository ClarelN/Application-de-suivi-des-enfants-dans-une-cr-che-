<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockLogistiqueResource;
use App\Models\StockLogistique;
use Illuminate\Http\Request;

class StockLogistiqueController extends Controller
{
    public function index()
    {
        $stocks = StockLogistique::orderBy('produit')->get();

        return response()->json([
            'data'      => StockLogistiqueResource::collection($stocks),
            'en_alerte' => StockLogistiqueResource::collection(
                $stocks->filter(fn($s) => $s->estEnAlerte())->values()
            ),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit'           => 'required|string|max:255',
            'quantite_actuelle' => 'required|numeric|min:0',
            'unite'             => 'required|string|max:50',
            'seuil_alerte'      => 'required|numeric|min:0',
        ]);

        $stock = StockLogistique::create($request->all());

        return (new StockLogistiqueResource($stock))
            ->additional(['message' => 'Produit ajouté au stock.'])
            ->response()->setStatusCode(201);
    }

    public function show(StockLogistique $stockLogistique)
    {
        return new StockLogistiqueResource($stockLogistique);
    }

    public function update(Request $request, StockLogistique $stockLogistique)
    {
        $request->validate([
            'produit'           => 'sometimes|string|max:255',
            'quantite_actuelle' => 'sometimes|numeric|min:0',
            'unite'             => 'sometimes|string|max:50',
            'seuil_alerte'      => 'sometimes|numeric|min:0',
        ]);

        $stockLogistique->update($request->all());

        return new StockLogistiqueResource($stockLogistique);
    }

    public function destroy(StockLogistique $stockLogistique)
    {
        $stockLogistique->delete();

        return response()->json(['message' => 'Produit supprimé du stock.']);
    }
}
