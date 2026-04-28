<?php

namespace Tests\Feature;

use App\Models\StockLogistique;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $this->actingAs(Utilisateur::factory()->create(), 'sanctum');
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/stocks')
             ->assertOk()
             ->assertJsonStructure(['data', 'en_alerte']);
    }

    public function test_store_ajoute_un_produit(): void
    {
        $this->auth();

        $this->postJson('/api/stocks', [
            'produit'           => 'Couches',
            'quantite_actuelle' => 100,
            'unite'             => 'unités',
            'seuil_alerte'      => 20,
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.produit', 'Couches');
    }

    public function test_show_retourne_un_stock(): void
    {
        $this->auth();
        $stock = StockLogistique::factory()->create();

        $this->getJson("/api/stocks/{$stock->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $stock->id);
    }

    public function test_update_modifie_la_quantite(): void
    {
        $this->auth();
        $stock = StockLogistique::factory()->create(['quantite_actuelle' => 50]);

        $this->putJson("/api/stocks/{$stock->id}", ['quantite_actuelle' => 75])
             ->assertOk()
             ->assertJsonPath('data.quantite_actuelle', 75);
    }

    public function test_en_alerte_detecte_stock_critique(): void
    {
        $this->auth();
        StockLogistique::factory()->enAlerte()->create(['produit' => 'Lait']);

        $response = $this->getJson('/api/stocks')->assertOk();
        $enAlerte = $response->json('en_alerte');

        $this->assertNotEmpty($enAlerte);
        $this->assertTrue(collect($enAlerte)->contains('produit', 'Lait'));
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/stocks', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['produit', 'quantite_actuelle', 'unite', 'seuil_alerte']);
    }

    public function test_store_echoue_avec_quantite_negative(): void
    {
        $this->auth();

        $this->postJson('/api/stocks', [
            'produit'           => 'Couches',
            'quantite_actuelle' => -5,
            'unite'             => 'unités',
            'seuil_alerte'      => 10,
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['quantite_actuelle']);
    }

    public function test_route_protegee_sans_token(): void
    {
        // Pas d'actingAs → doit renvoyer 401
        $this->getJson('/api/stocks')->assertStatus(401);
    }
}
