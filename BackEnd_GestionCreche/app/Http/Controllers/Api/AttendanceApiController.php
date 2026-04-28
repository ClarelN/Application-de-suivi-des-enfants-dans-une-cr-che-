<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PresenceResource;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AttendanceApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('enfant');

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }
        if ($request->has('enfant_id')) {
            $query->where('enfant_id', $request->enfant_id);
        }

        return PresenceResource::collection($query->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'enfant_id' => 'required|exists:enfants,id',
            'date'      => 'required|date',
            'status'    => 'required|in:present,absent,retard',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['enfant_id' => $request->enfant_id, 'date' => $request->date],
            ['status'    => $request->status]
        );

        return (new PresenceResource($attendance->load('enfant')))
            ->additional(['message' => 'Présence enregistrée.'])
            ->response()->setStatusCode(201);
    }

    public function show(Attendance $attendance)
    {
        return new PresenceResource($attendance->load('enfant'));
    }

    public function update(Request $request, Attendance $attendance)
    {
        $request->validate(['status' => 'required|in:present,absent,retard']);
        $attendance->update($request->only('status'));

        return new PresenceResource($attendance->load('enfant'));
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return response()->json(['message' => 'Présence supprimée.']);
    }

    public function dailyReport()
    {
        $today = Carbon::today();

        $presences = Attendance::with('enfant')
            ->whereDate('date', $today)
            ->get();

        return response()->json([
            'date'    => $today->toDateString(),
            'data'    => [
                'present' => PresenceResource::collection($presences->where('status', 'present')->values()),
                'absent'  => PresenceResource::collection($presences->where('status', 'absent')->values()),
                'retard'  => PresenceResource::collection($presences->where('status', 'retard')->values()),
            ],
        ]);
    }
}
