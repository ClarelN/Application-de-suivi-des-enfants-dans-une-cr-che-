<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UtilisateurResource;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UtilisateurApiController extends Controller
{
    public function index()
    {
        return UtilisateurResource::collection(Utilisateur::paginate(50));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'     => 'required|string|max:255',
            'prenom'  => 'required|string|max:255',
            'email'   => 'required|email|unique:utilisateurs,email',
            'password'=> 'required|string|min:8',
            'role'    => 'required|in:administrateur,educateur,parent',
            'actif'   => 'boolean',
        ]);

        $user = Utilisateur::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'actif'    => $request->boolean('actif', true),
        ]);

        return (new UtilisateurResource($user))->response()->setStatusCode(201);
    }

    public function update(Request $request, Utilisateur $utilisateur)
    {
        $request->validate([
            'nom'     => 'sometimes|string|max:255',
            'prenom'  => 'sometimes|string|max:255',
            'email'   => ['sometimes', 'email', Rule::unique('utilisateurs', 'email')->ignore($utilisateur->id)],
            'role'    => 'sometimes|in:administrateur,educateur,parent',
            'actif'   => 'boolean',
            'password'=> 'nullable|string|min:8',
        ]);

        $data = $request->except('password');
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $utilisateur->update($data);

        return new UtilisateurResource($utilisateur->fresh());
    }
}
