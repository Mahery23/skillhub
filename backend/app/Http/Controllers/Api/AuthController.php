<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', 'in:apprenant,formateur'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'nom'          => $request->string('name')->toString(),
            'email'        => $request->string('email')->toString(),
            'mot_de_passe' => $request->string('password')->toString(),
            'role'         => $request->string('role')->toString(),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Récupérer l'utilisateur manuellement
        $user = User::where('email', $request->string('email')->toString())->first();

        // Vérifier le mot de passe manuellement
        if (! $user || ! Hash::check($request->string('password')->toString(), $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Générer le token JWT directement depuis l'utilisateur
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ]);
    }
    public function profile(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'user' => $this->formatUser($user),
        ]);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    private function formatUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        return [
            'id'             => $user->id,
            'name'           => $user->nom,
            'nom'            => $user->nom,
            'email'          => $user->email,
            'role'           => $user->role,
            'date_creation'  => $user->date_creation,
        ];
    }
}
