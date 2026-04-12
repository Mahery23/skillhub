<?php

namespace Tests\Feature;

use App\Models\Enrollment;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class EnrollmentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_learner_can_enroll_to_a_formation(): void
    {
        $learner = $this->createUser('apprenant', 'learner1@example.test');
        $trainer = $this->createUser('formateur', 'trainer1@example.test');
        $formation = $this->createFormation($trainer, 'Laravel API');

        $response = $this->withHeaders($this->authHeadersFor($learner))
            ->postJson("/api/formations/{$formation->id}/inscription");

        $response->assertCreated()
            ->assertJsonPath('message', 'Enrollment created successfully')
            ->assertJsonPath('enrollment.utilisateur_id', $learner->id)
            ->assertJsonPath('enrollment.formation_id', $formation->id)
            ->assertJsonPath('enrollment.progression', 0);

        $this->assertDatabaseHas('enrollments', [
            'utilisateur_id' => $learner->id,
            'formation_id' => $formation->id,
            'progression' => 0,
        ]);
    }

    public function test_learner_cannot_enroll_twice_to_the_same_formation(): void
    {
        $learner = $this->createUser('apprenant', 'learner2@example.test');
        $trainer = $this->createUser('formateur', 'trainer2@example.test');
        $formation = $this->createFormation($trainer, 'Vue.js');

        Enrollment::create([
            'utilisateur_id' => $learner->id,
            'formation_id' => $formation->id,
            'progression' => 0,
        ]);

        $response = $this->withHeaders($this->authHeadersFor($learner))
            ->postJson("/api/formations/{$formation->id}/inscription");

        $response->assertStatus(409)
            ->assertJsonPath('message', 'Vous suivez déjà cette formation.');

        $this->assertDatabaseCount('enrollments', 1);
    }

    public function test_non_learner_cannot_enroll(): void
    {
        $trainer = $this->createUser('formateur', 'trainer3@example.test');
        $owner = $this->createUser('formateur', 'trainer4@example.test');
        $formation = $this->createFormation($owner, 'Docker');

        $response = $this->withHeaders($this->authHeadersFor($trainer))
            ->postJson("/api/formations/{$formation->id}/inscription");

        $response->assertForbidden();
    }

    public function test_learner_can_unenroll_from_a_formation(): void
    {
        $learner = $this->createUser('apprenant', 'learner3@example.test');
        $trainer = $this->createUser('formateur', 'trainer5@example.test');
        $formation = $this->createFormation($trainer, 'Kubernetes');

        Enrollment::create([
            'utilisateur_id' => $learner->id,
            'formation_id' => $formation->id,
            'progression' => 35,
        ]);

        $response = $this->withHeaders($this->authHeadersFor($learner))
            ->deleteJson("/api/formations/{$formation->id}/inscription");

        $response->assertOk()
            ->assertJsonPath('message', 'Enrollment deleted successfully');

        $this->assertDatabaseMissing('enrollments', [
            'utilisateur_id' => $learner->id,
            'formation_id' => $formation->id,
        ]);
    }

    public function test_unenroll_returns_404_when_not_enrolled(): void
    {
        $learner = $this->createUser('apprenant', 'learner4@example.test');
        $trainer = $this->createUser('formateur', 'trainer6@example.test');
        $formation = $this->createFormation($trainer, 'React');

        $response = $this->withHeaders($this->authHeadersFor($learner))
            ->deleteJson("/api/formations/{$formation->id}/inscription");

        $response->assertNotFound()
            ->assertJsonPath('message', 'Aucune inscription trouvée pour cette formation.');
    }

    public function test_learner_can_list_only_his_enrolled_formations(): void
    {
        $learner = $this->createUser('apprenant', 'learner5@example.test');
        $otherLearner = $this->createUser('apprenant', 'learner6@example.test');
        $trainer = $this->createUser('formateur', 'trainer7@example.test');

        $formationA = $this->createFormation($trainer, 'Node.js');
        $formationB = $this->createFormation($trainer, 'PHP avancé');
        $formationC = $this->createFormation($trainer, 'Python');

        Enrollment::create([
            'utilisateur_id' => $learner->id,
            'formation_id' => $formationA->id,
            'progression' => 20,
        ]);

        Enrollment::create([
            'utilisateur_id' => $learner->id,
            'formation_id' => $formationB->id,
            'progression' => 65,
        ]);

        Enrollment::create([
            'utilisateur_id' => $otherLearner->id,
            'formation_id' => $formationA->id,
            'progression' => 10,
        ]);

        Enrollment::create([
            'utilisateur_id' => $otherLearner->id,
            'formation_id' => $formationC->id,
            'progression' => 90,
        ]);

        $response = $this->withHeaders($this->authHeadersFor($learner))
            ->getJson('/api/apprenant/formations');

        $response->assertOk();

        $formations = collect($response->json('formations'));

        $this->assertCount(2, $formations);
        $this->assertEqualsCanonicalizing(
            [$formationA->id, $formationB->id],
            $formations->pluck('formation.id')->all()
        );

        $formationADto = $formations->firstWhere('formation.id', $formationA->id);
        $this->assertSame(2, $formationADto['formation']['apprenants']);
        $this->assertSame($trainer->nom, $formationADto['formation']['formateur']['nom']);
    }

    /**
     * @return array<string, string>
     */
    private function authHeadersFor(User $user): array
    {
        $token = JWTAuth::fromUser($user);

        return [
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ];
    }

    private function createUser(string $role, string $email): User
    {
        return User::create([
            'nom' => explode('@', $email)[0],
            'email' => $email,
            'mot_de_passe' => 'password123',
            'role' => $role,
        ]);
    }

    private function createFormation(User $trainer, string $title): Formation
    {
        return Formation::create([
            'titre' => $title,
            'description' => "Description {$title}",
            'categorie' => 'Data',
            'niveau' => 'Débutant',
            'formateur_id' => $trainer->id,
            'nombre_de_vues' => 0,
        ]);
    }
}

