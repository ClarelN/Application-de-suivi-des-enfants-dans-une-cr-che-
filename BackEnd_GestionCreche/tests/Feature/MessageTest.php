<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageTest extends TestCase
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

        $this->getJson('/api/messages')->assertOk();
    }

    public function test_store_envoie_un_message(): void
    {
        $expediteur   = $this->auth();
        $destinataire = Utilisateur::factory()->create();

        $this->postJson('/api/messages', [
            'destinataire_id' => $destinataire->id,
            'sujet'           => 'Bonjour',
            'corps'           => 'Ceci est un message de test.',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.sujet', 'Bonjour');
    }

    public function test_show_marque_le_message_comme_lu(): void
    {
        $user = $this->auth();

        $message = Message::create([
            'expediteur_id'   => Utilisateur::factory()->create()->id,
            'destinataire_id' => $user->id,
            'sujet'           => 'Test lecture',
            'corps'           => 'Corps du message.',
            'lu'              => false,
        ]);

        $this->getJson("/api/messages/{$message->id}")->assertOk();
        $this->assertDatabaseHas('messages', ['id' => $message->id, 'lu' => true]);
    }

    public function test_destroy_supprime_un_message(): void
    {
        $user = $this->auth();

        $message = Message::create([
            'expediteur_id'   => $user->id,
            'destinataire_id' => Utilisateur::factory()->create()->id,
            'sujet'           => 'A supprimer',
            'corps'           => 'Corps.',
            'lu'              => false,
        ]);

        $this->deleteJson("/api/messages/{$message->id}")->assertOk();
        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/messages', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['destinataire_id', 'sujet', 'corps']);
    }

    public function test_store_echoue_avec_destinataire_inexistant(): void
    {
        $this->auth();

        $this->postJson('/api/messages', [
            'destinataire_id' => 99999,
            'sujet'           => 'Test',
            'corps'           => 'Corps du message.',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['destinataire_id']);
    }

    public function test_route_protegee_sans_token(): void
    {
        // Pas d'actingAs → doit renvoyer 401
        $this->getJson('/api/messages')->assertStatus(401);
    }
}
