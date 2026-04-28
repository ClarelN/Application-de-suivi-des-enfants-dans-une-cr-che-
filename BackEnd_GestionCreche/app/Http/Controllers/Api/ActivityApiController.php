<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityApiController extends Controller
{
    public function index()
    {
        $activities = Activity::withCount('enfants')->latest()->paginate(10);

        return ActivityResource::collection($activities);
    }

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

        if ($request->has('enfants')) {
            $activity->enfants()->sync($request->enfants);
        }

        return (new ActivityResource($activity->load('enfants')))
            ->additional(['message' => 'Activité créée.'])
            ->response()->setStatusCode(201);
    }

    public function show(Activity $activity)
    {
        return new ActivityResource($activity->load('enfants'));
    }

    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_time'  => 'sometimes|date',
            'end_time'    => 'sometimes|date|after:start_time',
            'enfants'     => 'nullable|array',
            'enfants.*'   => 'exists:enfants,id',
        ]);

        $activity->update($request->except('enfants'));
        $activity->enfants()->sync($request->enfants ?? []);

        return new ActivityResource($activity->load('enfants'));
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return response()->json(['message' => 'Activité supprimée.']);
    }
}
