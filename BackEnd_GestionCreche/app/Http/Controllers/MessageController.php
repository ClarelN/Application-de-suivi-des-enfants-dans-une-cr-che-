<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // Boîte de réception
    public function index()
    {
        $messages = Message::with('expediteur')
            ->where('destinataire_id', Auth::id())
            ->latest()
            ->paginate(10);

        return view('messages.index', compact('messages'));
    }

    public function create()
    {
        $users = Utilisateur::where('id', '!=', Auth::id())->get();
        return view('messages.create', compact('users'));
    }

    // Envoyer un message à un parent
    public function store(Request $request)
    {
        $request->validate([
            'destinataire_id' => 'required|exists:utilisateurs,id',
            'sujet'           => 'required|string|max:255',
            'corps'           => 'required|string',
        ]);

        Message::create([
            'expediteur_id'   => Auth::id(),
            'destinataire_id' => $request->destinataire_id,
            'sujet'           => $request->sujet,
            'corps'           => $request->corps,
        ]);

        return redirect()->route('messages.index')
            ->with('success', 'Message envoyé avec succès !');
    }

    // Lire un message
    public function show(Message $message)
    {
        $message->marquerLu();
        return view('messages.show', compact('message'));
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return redirect()->route('messages.index')
            ->with('success', 'Message supprimé.');
    }
}
