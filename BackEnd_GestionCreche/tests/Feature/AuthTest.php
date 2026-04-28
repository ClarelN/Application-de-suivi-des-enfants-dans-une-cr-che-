<?php

namespace Tests\Feature;

use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_retourne_token_avec_identifiants_valides(): void
    {
        Utilisateur::factory()->create([
            'email'    => 'test@creche.cm',
            'password' => Hash::make('password'),
            'actif'    => true,
        ]);

        $this->postJson('/api/login', [
            'email'    => 'test@creche.cm',
            'password' => 'password',
        ])
        ->assertOk()
        ->assertJsonStructure(['token', 'token_type', 'utilisateur']);
    }

    public function test_login_echoue_avec_mauvais_mot_de_passe(): void
    {
        Utilisateur::factory()->create([
            'email'    => 'test@creche.cm',
            'password' => Hash::make('password'),
        ]);

        $this->postJson('/api/login', [
            'email'    => 'test@creche.cm',
            'password' => 'mauvais',
        ])->assertStatus(401);
    }

    public function test_logout_retourne_200(): void
    {
        $user = Utilisateur::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/logout')->assertOk();
    }
}
