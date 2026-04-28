<?php

namespace Tests\Feature;

use App\Models\Groupe;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupeTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $this->actingAs(Utilisateur::factory()->create(), 'sanctum');
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/groupes')->assertOk();
    }

    public function test_store_cree_un_groupe(): void
    {
        $this->auth();

        $this->postJson('/api/groupes', [
            'nom'          => 'Poussins',
            'age_min_mois' => 2,
            'age_max_mois' => 12,
            'capacite_max' => 8,
            'couleur'      => '#FFD700',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.nom', 'Poussins');
    }

    public function test_show_retourne_un_groupe(): void
    {
        $this->auth();
        $groupe = Groupe::factory()->create();

        $this->getJson("/api/groupes/{$groupe->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $groupe->id);
    }

    public function test_route_protegee_sans_token(): void
    {
        $this->getJson('/api/groupes')->assertStatus(401);
    }
}
