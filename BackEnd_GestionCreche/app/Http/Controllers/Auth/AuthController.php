<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class AuthController
{
     // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)
                                  ->where('actif', true)
                                  ->first();

        if (!$utilisateur || !Hash::check($request->password, $utilisateur->password)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Connexion réussie.',
            'token'        => $token,
            'token_type'   => 'Bearer',
            'utilisateur'  => [
                'id'     => $utilisateur->id,
                'nom'    => $utilisateur->nom,
                'prenom' => $utilisateur->prenom,
                'email'  => $utilisateur->email,
                'role'   => $utilisateur->role,
            ]
        ], 200);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ], 200);
    }
}
