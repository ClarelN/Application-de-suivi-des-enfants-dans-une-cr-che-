<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Enfant;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    // Voir toutes les activités
    public function index()
    {
        $activities = Activity::withCount('enfants')->paginate(10);
        return view('activities.index', compact('activities'));
    }

    public function create()
    {
        $enfants = Enfant::all();
        return view('activities.create', compact('enfants'));
    }

    // Ajouter une nouvelle activité
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time'  => 'required|date',
            'end_time'    => 'required|date|after:start_time',
            'enfants'     => 'nullable|array',
            'enfants.*'   => 'exists:enfants,id',
        ]);

        $activity = Activity::create($request->except('enfants'));

        // Attacher les enfants participants
        if ($request->has('enfants')) {
            $activity->enfants()->sync($request->enfants);
        }

        return redirect()->route('activities.index')
            ->with('success', 'Activité ajoutée avec succès !');
    }

    public function show(Activity $activity)
    {
        $activity->load('enfants');
        return view('activities.show', compact('activity'));
    }

    public function edit(Activity $activity)
    {
        $enfants = Enfant::all();
        return view('activities.edit', compact('activity', 'enfants'));
    }

    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time'  => 'required|date',
            'end_time'    => 'required|date|after:start_time',
            'enfants'     => 'nullable|array',
            'enfants.*'   => 'exists:enfants,id',
        ]);

        $activity->update($request->except('enfants'));

        $activity->enfants()->sync($request->enfants ?? []);

        return redirect()->route('activities.index')
            ->with('success', 'Activité modifiée avec succès !');
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return redirect()->route('activities.index')
            ->with('success', 'Activité supprimée avec succès !');
    }
}
