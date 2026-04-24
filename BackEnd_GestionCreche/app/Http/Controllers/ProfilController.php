<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    // GET /api/profile
    public function show(Request $request)
    {
        return response()->json($request->user(), 200);
    }

    // PUT /api/profile
    public function update(Request $request)
    {
        $request->validate([
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:utilisateurs,email,' . $request->user()->id,
        ]);

        $request->user()->update($request->only('nom', 'prenom', 'email'));

        return response()->json([
            'message'     => 'Profil mis à jour.',
            'utilisateur' => $request->user()
        ], 200);
    }

    // PUT /api/profile/password
    public function updatePassword(Request $request)
    {
        $request->validate([
            'ancien_password'  => 'required|string',
            'nouveau_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->ancien_password, $request->user()->password)) {
            return response()->json([
                'message' => 'Ancien mot de passe incorrect.'
            ], 403);
        }

        $request->user()->update([
            'password' => Hash::make($request->nouveau_password)
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour.'
        ], 200);
    }
}
