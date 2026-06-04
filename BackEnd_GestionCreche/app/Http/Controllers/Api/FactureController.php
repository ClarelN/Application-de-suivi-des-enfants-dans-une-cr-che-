<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FactureResource;
use App\Models\Facture;
use App\Models\Paiement;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        $factures = Facture::with('enfant')->latest()->paginate(50);
        return FactureResource::collection($factures);
    }

    public function paiement(Request $request, Facture $facture)
    {
        $request->validate([
            'montant' => 'required|numeric|min:0.01',
            'mode'    => 'required|in:especes,virement,cheque,carte',
            'note'    => 'nullable|string',
        ]);

        Paiement::create([
            'facture_id'    => $facture->id,
            'montant'       => $request->montant,
            'mode'          => $request->mode,
            'date_paiement' => now()->toDateString(),
            'note'          => $request->note,
        ]);

        $totalPaye = $facture->paiements()->sum('montant');
        if ($totalPaye >= $facture->montant_du) {
            $facture->update(['statut' => 'regle']);
        } elseif ($totalPaye > 0) {
            $facture->update(['statut' => 'partiellement_regle']);
        }

        return response()->json([
            'message' => 'Paiement enregistré.',
            'data'    => new FactureResource($facture->fresh()->load('enfant')),
        ]);
    }
}
