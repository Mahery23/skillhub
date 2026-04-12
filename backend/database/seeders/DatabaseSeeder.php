<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'nom'          => 'Utilisateur Test',
            'email'        => 'test@example.com',
            'mot_de_passe' => 'password',
            'role'         => 'apprenant',
        ]);
    }
}
