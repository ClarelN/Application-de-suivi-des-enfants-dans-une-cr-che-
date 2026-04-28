<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageApiController extends Controller
{
    public function index()
    {
        $messages = Message::with('expediteur')
            ->where('destinataire_id', Auth::id())
            ->latest()
            ->paginate(10);

        return MessageResource::collection($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'destinataire_id' => 'required|exists:utilisateurs,id',
            'sujet'           => 'required|string|max:255',
            'corps'           => 'required|string',
        ]);

        $message = Message::create([
            'expediteur_id'   => Auth::id(),
            'destinataire_id' => $request->destinataire_id,
            'sujet'           => $request->sujet,
            'corps'           => $request->corps,
        ]);

        return (new MessageResource($message))
            ->additional(['message' => 'Message envoyé.'])
            ->response()->setStatusCode(201);
    }

    public function show(Message $message)
    {
        $message->marquerLu();

        return new MessageResource($message->load('expediteur', 'destinataire'));
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['message' => 'Message supprimé.']);
    }
}
