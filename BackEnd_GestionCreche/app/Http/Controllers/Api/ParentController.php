<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnfantResource;
use App\Http\Resources\FactureResource;
use App\Http\Resources\SuiviJournalierResource;
use App\Models\Attendance;
use App\Models\SuiviJournalier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentController extends Controller
{
    // GET /parent/enfant — premier enfant du parent connecté
    public function enfant()
    {
        $enfant = Auth::user()
            ->enfants()
            ->with('groupe', 'personnesAutorisees')
            ->first();

        if (!$enfant) {
            return response()->json(['data' => null], 200);
        }

        $today = Carbon::today()->toDateString();
        $presence = Attendance::where('enfant_id', $enfant->id)
            ->whereDate('date', $today)
            ->first();

        $resource = (new EnfantResource($enfant))->toArray(request());
        $resource['statut_presence'] = $presence?->status ?? 'present';

        return response()->json(['data' => $resource]);
    }

    // GET /parent/suivis — suivis des enfants du parent connecté
    public function suivis()
    {
        $enfantIds = Auth::user()->enfants()->pluck('enfants.id');

        $suivis = SuiviJournalier::with('enfant')
            ->whereIn('enfant_id', $enfantIds)
            ->latest('date')
            ->paginate(20);

        return SuiviJournalierResource::collection($suivis);
    }

    // GET /parent/factures — factures des enfants du parent connecté
    public function factures()
    {
        $enfantIds = Auth::user()->enfants()->pluck('enfants.id');

        $factures = \App\Models\Facture::with('enfant')
            ->whereIn('enfant_id', $enfantIds)
            ->latest()
            ->paginate(20);

        return FactureResource::collection($factures);
    }

    // POST /parent/absences — signaler une absence
    public function signalerAbsence(Request $request)
    {
        $request->validate([
            'date_debut' => 'required|date',
            'date_fin'   => 'nullable|date|after_or_equal:date_debut',
            'motif'      => 'required|string|max:255',
            'note'       => 'nullable|string',
        ]);

        $enfant = Auth::user()->enfants()->first();

        if (!$enfant) {
            return response()->json(['message' => 'Aucun enfant associé à ce compte.'], 422);
        }

        $debut  = Carbon::parse($request->date_debut);
        $fin    = Carbon::parse($request->date_fin ?? $request->date_debut);
        $created = 0;

        for ($date = $debut->copy(); $date->lte($fin); $date->addDay()) {
            if ($date->isWeekday()) {
                Attendance::updateOrCreate(
                    ['enfant_id' => $enfant->id, 'date' => $date->toDateString()],
                    ['status' => 'absent']
                );
                $created++;
            }
        }

        return response()->json([
            'message' => "Absence signalée pour $created jour(s).",
        ]);
    }
}
