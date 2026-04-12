<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

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

    protected function casts(): array
    {
        return [
            'date_creation' => 'datetime',
            'mot_de_passe'  => 'hashed',
        ];
    }

    // ← Dire à Laravel quelle colonne est le mot de passe
    public function getAuthPasswordName(): string
    {
        return 'mot_de_passe';
    }

    public function getAuthPassword(): string
    {
        return $this->mot_de_passe;
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role,
            'nom'  => $this->nom,
        ];
    }

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'formateur_id');
    }

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'utilisateur_id');
    }

    public function formationsSuivies(): BelongsToMany
    {
        return $this->belongsToMany(
            Formation::class,
            'enrollments',
            'utilisateur_id',
            'formation_id'
        )->withPivot(['progression', 'date_inscription']);
    }
}
