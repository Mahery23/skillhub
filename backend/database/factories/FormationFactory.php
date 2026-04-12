<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre'          => fake()->sentence(4),
            'description'    => fake()->paragraph(),
            'categorie'      => fake()->randomElement(['Développement web', 'Data', 'Design', 'Marketing', 'DevOps']),
            'niveau'         => fake()->randomElement(['Débutant', 'Intermédiaire', 'Avancé']),
            'formateur_id'   => User::factory()->create(['role' => 'formateur'])->id,
            'nombre_de_vues' => 0,
        ];
    }
}
