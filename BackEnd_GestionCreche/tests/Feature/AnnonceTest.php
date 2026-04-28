<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnonceTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): Utilisateur
    {
        $user = Utilisateur::factory()->create(['role' => 'administrateur']);
        $this->actingAs($user, 'sanctum');
        return $user;
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/annonces')->assertOk();
    }

    public function test_store_publie_une_annonce(): void
    {
        $this->auth();

        $this->postJson('/api/annonces', [
            'titre' => 'Fermeture exceptionnelle',
            'corps' => 'La crèche sera fermée le vendredi 26 avril.',
            'cible' => 'tous',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.titre', 'Fermeture exceptionnelle');
    }

    public function test_show_retourne_une_annonce(): void
    {
        $user = $this->auth();

        $annonce = Annonce::create([
            'user_id' => $user->id,
            'titre'   => 'Test',
            'corps'   => 'Corps de test.',
            'cible'   => 'parents',
        ]);

        $this->getJson("/api/annonces/{$annonce->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $annonce->id);
    }

    public function test_update_modifie_une_annonce(): void
    {
        $user = $this->auth();

        $annonce = Annonce::create([
            'user_id' => $user->id,
            'titre'   => 'Ancien titre',
            'corps'   => 'Ancien corps.',
            'cible'   => 'tous',
        ]);

        $this->putJson("/api/annonces/{$annonce->id}", ['titre' => 'Nouveau titre'])
             ->assertOk()
             ->assertJsonPath('data.titre', 'Nouveau titre');
    }

    public function test_destroy_supprime_une_annonce(): void
    {
        $user = $this->auth();

        $annonce = Annonce::create([
            'user_id' => $user->id,
            'titre'   => 'A supprimer',
            'corps'   => 'Corps.',
            'cible'   => 'tous',
        ]);

        $this->deleteJson("/api/annonces/{$annonce->id}")->assertOk();
        $this->assertSoftDeleted('annonces', ['id' => $annonce->id]);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/annonces', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['titre', 'corps', 'cible']);
    }

    public function test_store_echoue_avec_cible_invalide(): void
    {
        $this->auth();

        $this->postJson('/api/annonces', [
            'titre' => 'Test',
            'corps' => 'Contenu.',
            'cible' => 'inconnu',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['cible']);
    }

    public function test_route_protegee_sans_token(): void
    {
        // Pas d'actingAs → doit renvoyer 401
        $this->getJson('/api/annonces')->assertStatus(401);
    }
}
