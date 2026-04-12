<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom'          => fake()->name(),
            'email'        => fake()->unique()->safeEmail(),
            'mot_de_passe' => 'password', // sera automatiquement hashé grâce au cast 'hashed'
            'role'         => fake()->randomElement(['apprenant', 'formateur']),
        ];
    }
}
