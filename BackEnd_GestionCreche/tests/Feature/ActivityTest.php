<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Enfant;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $this->actingAs(Utilisateur::factory()->create(), 'sanctum');
    }

    public function test_index_retourne_200(): void
    {
        $this->auth();

        $this->getJson('/api/activites')->assertOk();
    }

    public function test_store_cree_une_activite(): void
    {
        $this->auth();

        $this->postJson('/api/activites', [
            'title'      => 'Atelier peinture',
            'start_time' => now()->toDateTimeString(),
            'end_time'   => now()->addHour()->toDateTimeString(),
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.titre', 'Atelier peinture');
    }

    public function test_store_avec_enfants_attaches(): void
    {
        $this->auth();
        $enfants = Enfant::factory()->count(3)->create();

        $this->postJson('/api/activites', [
            'title'      => 'Musique',
            'start_time' => now()->toDateTimeString(),
            'end_time'   => now()->addHour()->toDateTimeString(),
            'enfants'    => $enfants->pluck('id')->toArray(),
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.titre', 'Musique');
    }

    public function test_show_retourne_une_activite(): void
    {
        $this->auth();
        $activity = Activity::factory()->create();

        $this->getJson("/api/activites/{$activity->id}")
             ->assertOk()
             ->assertJsonPath('data.id', $activity->id);
    }

    public function test_store_echoue_sans_champs_requis(): void
    {
        $this->auth();

        $this->postJson('/api/activites', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['title', 'start_time', 'end_time']);
    }

    public function test_store_echoue_si_fin_avant_debut(): void
    {
        $this->auth();

        $this->postJson('/api/activites', [
            'title'      => 'Atelier',
            'start_time' => now()->addHour()->toDateTimeString(),
            'end_time'   => now()->toDateTimeString(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['end_time']);
    }

    public function test_route_protegee_sans_token(): void
    {
        $this->getJson('/api/activites')->assertStatus(401);
    }
}
