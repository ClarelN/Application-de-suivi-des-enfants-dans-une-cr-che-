<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SuiviJournalierResource;
use App\Models\SuiviJournalier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuiviJournalierController extends Controller
{
    public function index(Request $request)
    {
        $query = SuiviJournalier::with('enfant');

        if ($request->has('enfant_id')) {
            $query->where('enfant_id', $request->enfant_id);
        }

        return SuiviJournalierResource::collection($query->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'enfant_id'   => 'required|exists:enfants,id',
            'date'        => 'required|date',
            'repas'       => 'nullable|in:tout,un_peu,rien',
            'sieste_debut'=> 'nullable|date_format:H:i',
            'sieste_fin'  => 'nullable|date_format:H:i',
            'humeur'      => 'nullable|integer|min:1|max:5',
            'note'        => 'nullable|string',
        ]);

        $suivi = SuiviJournalier::updateOrCreate(
            ['enfant_id' => $request->enfant_id, 'date' => $request->date],
            [
                'educateur_id' => Auth::id(),
                'repas'        => $request->repas,
                'sieste_debut' => $request->sieste_debut,
                'sieste_fin'   => $request->sieste_fin,
                'humeur'       => $request->humeur,
                'note'         => $request->note,
            ]
        );

        return (new SuiviJournalierResource($suivi->load('enfant')))
            ->response()->setStatusCode(201);
    }
}
