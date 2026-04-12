<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

/**
 * Représente un utilisateur SkillHub authentifié par JWT.
 *
 * Le modèle utilise les colonnes métier du cahier des charges:
 * nom, email, mot_de_passe, role et date_creation.
 */
class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public const CREATED_AT = 'date_creation';
    public const UPDATED_AT = null;

    /**
     * Définit les casts des colonnes métier du modèle.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_creation' => 'datetime',
            'mot_de_passe' => 'hashed',
        ];
    }

    /**
     * Retourne l'identifiant utilisé dans le token JWT.
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Ajoute les informations de rôle et de nom dans le token JWT.
     *
     * @return array<string, mixed>
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role,
            'nom' => $this->nom,
        ];
    }

    /**
     * Retourne le mot de passe stocké dans la colonne métier dédiée.
     */
    public function getAuthPassword(): string
    {
        return $this->mot_de_passe;
    }

    /**
     * Retourne les formations créées par ce formateur.
     *
     * @return HasMany<Formation, $this>
     */
    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'formateur_id');
    }
}
