<?php

namespace Tests\Feature;

use App\Models\Enfant;
use App\Models\Groupe;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnfantTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): Utilisateur
    {
        $user = Utilisateur::factory()->create();
        $this->actingAs($user, 'sanctum');
        return $user;
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/enfants')->assertOk();
    }

    public function test_store_cree_un_enfant(): void
    {
        $this->auth();
        $groupe = Groupe::factory()->create();

        $this->postJson('/api/enfants', [
            'nom'            => 'Dupont',
            'prenom'         => 'Lucas',
            'date_naissance' => '2022-03-15',
            'sexe'           => 'M',
            'groupe_id'      => $groupe->id,
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.nom', 'Dupont');
    }

    public function test_show_retourne_un_enfant(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();

        $this->getJson("/api/enfants/{$enfant->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $enfant->id);
    }

    public function test_update_modifie_un_enfant(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();

        $this->putJson("/api/enfants/{$enfant->id}", ['nom' => 'NouveauNom'])
             ->assertOk()
             ->assertJsonPath('data.nom', 'NouveauNom');
    }

    public function test_destroy_supprime_un_enfant(): void
    {
        $this->auth();
        $enfant = Enfant::factory()->create();

        $this->deleteJson("/api/enfants/{$enfant->id}")->assertOk();
        $this->assertSoftDeleted('enfants', ['id' => $enfant->id]);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/enfants', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['nom', 'prenom', 'date_naissance', 'sexe']);
    }

    public function test_store_echoue_avec_sexe_invalide(): void
    {
        $this->auth();

        $this->postJson('/api/enfants', [
            'nom'            => 'Dupont',
            'prenom'         => 'Lucas',
            'date_naissance' => '2022-03-15',
            'sexe'           => 'X',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['sexe']);
    }

    public function test_route_protegee_sans_token(): void
    {
        $this->getJson('/api/enfants')->assertStatus(401);
    }
}
