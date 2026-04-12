<?php

namespace Tests\Feature\Api;

use App\Models\Formation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormationTest extends TestCase
{
    use RefreshDatabase;

    private User $formateur;
    private User $apprenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->formateur = User::factory()->create(['role' => 'formateur']);
        $this->apprenant = User::factory()->create(['role' => 'apprenant']);
    }

    // ✅ Catalogue public accessible sans token
    public function test_catalogue_formations_accessible_sans_authentification(): void
    {
        $response = $this->getJson('/api/formations');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    // ✅ Formateur peut créer une formation
    public function test_formateur_peut_creer_une_formation(): void
    {
        $response = $this->actingAs($this->formateur, 'api')
            ->postJson('/api/formations', [
                'titre'       => 'Ma formation test',
                'description' => 'Une description suffisamment longue.',
                'categorie'   => 'Développement web',
                'niveau'      => 'Débutant',
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('formation.titre', 'Ma formation test');
    }

    // ❌ Apprenant ne peut pas créer une formation
    public function test_apprenant_ne_peut_pas_creer_une_formation(): void
    {
        $response = $this->actingAs($this->apprenant, 'api')
            ->postJson('/api/formations', [
                'titre'       => 'Tentative interdite',
                'description' => 'Description.',
                'categorie'   => 'Data',
                'niveau'      => 'Avancé',
            ]);

        $response->assertStatus(403);
    }

    // ❌ Création sans token refusée
    public function test_creation_sans_token_refusee(): void
    {
        $response = $this->postJson('/api/formations', [
            'titre'       => 'Sans token',
            'description' => 'Description.',
            'categorie'   => 'Design',
            'niveau'      => 'Intermédiaire',
        ]);

        $response->assertStatus(401);
    }

    // ❌ Catégorie invalide refusée
    public function test_categorie_invalide_refusee(): void
    {
        $response = $this->actingAs($this->formateur, 'api')
            ->postJson('/api/formations', [
                'titre'       => 'Formation Backend',
                'description' => 'Description.',
                'categorie'   => 'Backend', // ← invalide
                'niveau'      => 'Débutant',
            ]);

        $response->assertStatus(422);
    }

    // ✅ Formateur peut modifier sa propre formation
    public function test_formateur_peut_modifier_sa_formation(): void
    {
        $formation = Formation::factory()->create([
            'formateur_id' => $this->formateur->id,
        ]);

        $response = $this->actingAs($this->formateur, 'api')
            ->putJson("/api/formations/{$formation->id}", [
                'titre'       => 'Titre modifié',
                'description' => 'Nouvelle description.',
                'categorie'   => 'DevOps',
                'niveau'      => 'Avancé',
            ]);

        $response->assertStatus(200)
                 ->assertJsonPath('formation.titre', 'Titre modifié');
    }

    // ❌ Formateur ne peut pas modifier la formation d'un autre
    public function test_formateur_ne_peut_pas_modifier_formation_dun_autre(): void
    {
        $autreFormateur = User::factory()->create(['role' => 'formateur']);
        $formation = Formation::factory()->create([
            'formateur_id' => $autreFormateur->id,
        ]);

        $response = $this->actingAs($this->formateur, 'api')
            ->putJson("/api/formations/{$formation->id}", [
                'titre'       => 'Tentative de vol',
                'description' => 'Description.',
                'categorie'   => 'Data',
                'niveau'      => 'Débutant',
            ]);

        $response->assertStatus(403);
    }

    // ✅ Formateur peut supprimer sa formation
    public function test_formateur_peut_supprimer_sa_formation(): void
    {
        $formation = Formation::factory()->create([
            'formateur_id' => $this->formateur->id,
        ]);

        $response = $this->actingAs($this->formateur, 'api')
            ->deleteJson("/api/formations/{$formation->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('formations', ['id' => $formation->id]);
    }
}
