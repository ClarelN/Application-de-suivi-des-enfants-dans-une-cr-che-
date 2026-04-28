<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Enfant;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresenceTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $this->actingAs(Utilisateur::factory()->create(), 'sanctum');
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/presences')->assertOk();
    }

    public function test_store_enregistre_une_presence(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();

        $this->postJson('/api/presences', [
            'enfant_id' => $enfant->id,
            'date'      => now()->format('Y-m-d'),
            'status'    => 'present',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.statut', 'present');
    }

    public function test_store_updateorcreate_evite_les_doublons(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();
        $date   = now()->format('Y-m-d');

        $this->postJson('/api/presences', ['enfant_id' => $enfant->id, 'date' => $date, 'status' => 'present']);
        $this->postJson('/api/presences', ['enfant_id' => $enfant->id, 'date' => $date, 'status' => 'absent'])
             ->assertStatus(201);

        $this->assertDatabaseCount('attendances', 1);
    }

    public function test_rapport_journalier_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/presences/rapport-journalier')->assertOk()
             ->assertJsonStructure(['date', 'data' => ['present', 'absent', 'retard']]);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/presences', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['enfant_id', 'date', 'status']);
    }

    public function test_store_echoue_avec_statut_invalide(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();

        $this->postJson('/api/presences', [
            'enfant_id' => $enfant->id,
            'date'      => now()->format('Y-m-d'),
            'status'    => 'inconnu',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['status']);
    }

    public function test_route_protegee_sans_token(): void
    {
        $this->getJson('/api/presences')->assertStatus(401);
    }
}
