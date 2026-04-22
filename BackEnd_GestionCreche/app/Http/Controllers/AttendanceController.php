<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Enfant;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::with('enfant')->paginate(10);
        return view('attendances.index', compact('attendances'));
    }

    // Cocher la présence d'un enfant
    public function markAttendance(Request $request)
    {
        $request->validate([
            'enfant_id' => 'required|exists:enfants,id',
            'date'      => 'required|date',
            'status'    => 'required|in:present,absent,retard',
        ]);

        // updateOrCreate évite les doublons (unique enfant_id + date)
        $attendance = Attendance::updateOrCreate(
            [
                'enfant_id' => $request->enfant_id,
                'date'      => $request->date,
            ],
            [
                'status' => $request->status,
            ]
        );

        return redirect()->back()
            ->with('success', 'Présence enregistrée avec succès !');
    }

    // Liste des enfants présents aujourd'hui
    public function dailyReport()
    {
        $today = Carbon::today();

        $presents = Attendance::with('enfant')
            ->whereDate('date', $today)
            ->where('status', 'present')
            ->get();

        $absents = Attendance::with('enfant')
            ->whereDate('date', $today)
            ->where('status', 'absent')
            ->get();

        $retards = Attendance::with('enfant')
            ->whereDate('date', $today)
            ->where('status', 'retard')
            ->get();

        return view('attendances.daily_report', compact('presents', 'absents', 'retards', 'today'));
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->back()
            ->with('success', 'Présence supprimée.');
    }
}
