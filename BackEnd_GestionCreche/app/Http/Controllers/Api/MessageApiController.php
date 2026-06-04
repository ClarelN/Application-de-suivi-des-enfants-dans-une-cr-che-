<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UtilisateurResource;
use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageApiController extends Controller
{
    // GET /messages — liste des conversations (dernier message par contact)
    public function index()
    {
        $userId = Auth::id();

        $messages = Message::with('expediteur', 'destinataire')
            ->where('expediteur_id', $userId)
            ->orWhere('destinataire_id', $userId)
            ->latest()
            ->get();

        $seen = [];
        $conversations = [];

        foreach ($messages as $msg) {
            $otherId = $msg->expediteur_id === $userId
                ? $msg->destinataire_id
                : $msg->expediteur_id;

            if (isset($seen[$otherId])) continue;
            $seen[$otherId] = true;

            $other = $msg->expediteur_id === $userId ? $msg->destinataire : $msg->expediteur;
            if (!$other) continue;

            $nonLus = Message::where('expediteur_id', $otherId)
                ->where('destinataire_id', $userId)
                ->where('lu', false)
                ->count();

            $conversations[] = [
                'contact'         => new UtilisateurResource($other),
                'dernier_message' => new MessageResource($msg),
                'non_lus'         => $nonLus,
            ];
        }

        return response()->json(['data' => $conversations]);
    }

    // GET /messages/contacts — contacts filtrés par classe
    public function contacts()
    {
        $user = Auth::user();

        if ($user->role === 'parent') {
            // Éducateurs des classes où sont inscrits ses enfants + admin
            $groupIds = $user->enfants()->pluck('groupe_id')->unique();

            $educators = Utilisateur::where('role', 'educateur')
                ->where('actif', true)
                ->whereHas('groupes', fn($q) => $q->whereIn('groupes.id', $groupIds))
                ->get();

            $admins = Utilisateur::where('role', 'administrateur')
                ->where('actif', true)
                ->get();

            $contacts = $educators->merge($admins)->unique('id')->values();

        } elseif ($user->role === 'educateur') {
            // Parents des enfants inscrits dans ses classes
            $groupIds = $user->groupes()->pluck('groupes.id');

            $contacts = Utilisateur::where('role', 'parent')
                ->where('actif', true)
                ->whereHas('enfants', fn($q) => $q->whereIn('groupe_id', $groupIds))
                ->get();

        } else {
            // Admin : tout le monde sauf lui-même
            $contacts = Utilisateur::where('id', '!=', $user->id)
                ->where('actif', true)
                ->get();
        }

        return UtilisateurResource::collection($contacts);
    }

    // GET /messages/conversation/{userId} — échange avec un contact précis
    public function conversation(int $userId)
    {
        $myId = Auth::id();

        $messages = Message::with('expediteur', 'destinataire')
            ->where(function ($q) use ($myId, $userId) {
                $q->where('expediteur_id', $myId)->where('destinataire_id', $userId);
            })
            ->orWhere(function ($q) use ($myId, $userId) {
                $q->where('expediteur_id', $userId)->where('destinataire_id', $myId);
            })
            ->oldest()
            ->get();

        // Marquer les messages reçus comme lus automatiquement
        Message::where('expediteur_id', $userId)
            ->where('destinataire_id', $myId)
            ->where('lu', false)
            ->update(['lu' => true]);

        return MessageResource::collection($messages);
    }

    // POST /messages — envoyer un message (texte + fichier optionnel)
    public function store(Request $request)
    {
        $request->validate([
            'destinataire_id' => 'required|exists:utilisateurs,id',
            'sujet'           => 'nullable|string|max:255',
            'corps'           => 'nullable|string',
            'fichier'         => 'nullable|file|max:51200',
        ]);

        $data = [
            'expediteur_id'   => Auth::id(),
            'destinataire_id' => $request->destinataire_id,
            'sujet'           => $request->sujet ?? '',
            'corps'           => $request->corps ?? '',
        ];

        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $mime = $file->getMimeType();
            $path = $file->store('messages', 'public');

            $data['fichier_chemin'] = $path;
            $data['fichier_nom']    = $file->getClientOriginalName();
            $data['fichier_taille'] = $file->getSize();

            if (str_starts_with($mime, 'image/')) {
                $data['fichier_type'] = 'image';
            } elseif (str_starts_with($mime, 'video/')) {
                $data['fichier_type'] = 'video';
            } else {
                $data['fichier_type'] = 'file';
            }
        }

        $message = Message::create($data);

        return (new MessageResource($message->load('expediteur', 'destinataire')))
            ->response()->setStatusCode(201);
    }

    // PATCH /messages/{message} — marquer comme lu
    public function update(Request $request, Message $message)
    {
        $message->update(['lu' => true]);

        return new MessageResource($message->load('expediteur'));
    }

    // GET /messages/{message} — voir + marquer comme lu
    public function show(Message $message)
    {
        $message->marquerLu();

        return new MessageResource($message->load('expediteur', 'destinataire'));
    }

    // DELETE /messages/{message}
    public function destroy(Message $message)
    {
        if ($message->fichier_chemin) {
            Storage::disk('public')->delete($message->fichier_chemin);
        }
        $message->delete();

        return response()->json(['message' => 'Message supprimé.']);
    }
}
