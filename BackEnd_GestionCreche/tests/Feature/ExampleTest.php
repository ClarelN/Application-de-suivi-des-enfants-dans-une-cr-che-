<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_endpoint_est_accessible(): void
    {
        $this->postJson('/api/login', [
            'email'    => 'nonexistant@test.cm',
            'password' => 'mauvais',
        ])->assertStatus(401);
    }

    public function test_routes_protegees_renvoient_401_sans_token(): void
    {
        $routes = [
            '/api/enfants',
            '/api/groupes',
            '/api/presences',
            '/api/activites',
            '/api/messages',
            '/api/annonces',
            '/api/repas',
            '/api/stocks',
        ];

        foreach ($routes as $route) {
            $this->getJson($route)->assertStatus(401, "La route $route doit être protégée.");
        }
    }
}
