<?php

namespace Tests\Feature;

use App\Models\Enfant;
use App\Models\Repas;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RepasTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $this->actingAs(Utilisateur::factory()->create(), 'sanctum');
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/repas')->assertOk();
    }

    public function test_store_cree_un_repas(): void
    {
        $this->auth();

        $this->postJson('/api/repas', [
            'nom_repas' => 'Déjeuner',
            'date'      => now()->format('Y-m-d'),
            'heure'     => '12:00',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.nom_repas', 'Déjeuner');
    }

    public function test_show_retourne_un_repas(): void
    {
        $this->auth();
        $repas = Repas::factory()->create();

        $this->getJson("/api/repas/{$repas->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $repas->id);
    }

    public function test_consommation_index_retourne_200(): void
    {
        $this->auth();
        $repas = Repas::factory()->create();

        $this->getJson("/api/repas/{$repas->id}/consommations")->assertOk();
    }

    public function test_consommation_store_enregistre_pour_un_enfant(): void
    {
        $this->auth();
        $repas  = Repas::factory()->create();
        $enfant = Enfant::factory()->create();

        $this->postJson("/api/repas/{$repas->id}/consommations", [
            'enfant_id'       => $enfant->id,
            'quantite_mangee' => 'tout',
        ])->assertStatus(201);

        $this->assertDatabaseHas('consommation_repas', [
            'repas_id'        => $repas->id,
            'enfant_id'       => $enfant->id,
            'quantite_mangee' => 'tout',
        ]);
    }

    public function test_destroy_supprime_un_repas(): void
    {
        $this->auth();
        $repas = Repas::factory()->create();

        $this->deleteJson("/api/repas/{$repas->id}")->assertOk();
        $this->assertSoftDeleted('repas', ['id' => $repas->id]);
    }

    public function test_store_echoue_sans_nom_repas(): void
    {
        $this->auth();

        // Le champ nom_repas est requis — vérifie qu'on ne peut pas créer un repas sans nom
        $this->postJson('/api/repas', [
            'date'  => now()->format('Y-m-d'),
            'heure' => '12:00',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['nom_repas']);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/repas', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['nom_repas', 'date', 'heure']);
    }

    public function test_store_echoue_avec_heure_invalide(): void
    {
        $this->auth();

        $this->postJson('/api/repas', [
            'nom_repas' => 'Déjeuner',
            'date'      => now()->format('Y-m-d'),
            'heure'     => 'pas-une-heure',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['heure']);
    }

    public function test_route_protegee_sans_token(): void
    {
        // Pas d'actingAs → doit renvoyer 401
        $this->getJson('/api/repas')->assertStatus(401);
    }
}
