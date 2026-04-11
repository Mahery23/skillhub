# Skillhub

Plateforme e-learning collaborative mettant en relation des formateurs et des apprenants autour de formations en ligne.

---

## Stack technique

| Côté | Technologie |
|---|---|
| Frontend | React.js |
| Backend | Laravel |
| Auth | JWT |
| Base de données | MySQL/MongoDB |
| Tests | PHPUnit |

---

## Structure du projet

```
skillhub/
├── frontend/
│
├── backend/
│
├── .github/
│   └── workflows/     # CI/CD
├── .gitignore
│
└── README.md
```

---

## Prérequis

- Node.js >= 18
- PHP >= 8.2
- Composer >= 2
- MySQL
- MongoDB

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Mahery23/skillhub.git
cd skillhub
```

### 2. Backend (Laravel)

```bash
cd backend
composer install
```

### 3. Frontend (React)

```bash
cd frontend
npm install
```

Démarrer l'application :

```bash
npm run dev
php artisan serve
```

---

## Routes frontend

| Route | Page |
|---|---|
| `/` | Page d'accueil |
| `/formations` | Liste des formations |
| `/formation/:id` | Détail d'une formation |
| `/dashboard/apprenant` | Tableau de bord apprenant |
| `/dashboard/formateur` | Tableau de bord formateur |
| `/apprendre/:id` | Suivi de formation |

---

## Endpoints API principaux

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Créer un compte |
| POST | `/api/login` | Connexion + token JWT |
| GET | `/api/profile` | Profil connecté 🔒 |

### Formations

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/formations` | Liste des formations |
| GET | `/api/formations/{id}` | Détail d'une formation |
| POST | `/api/formations` | Créer une formation 🔒 Formateur |
| PUT | `/api/formations/{id}` | Modifier une formation 🔒 Formateur |
| DELETE | `/api/formations/{id}` | Supprimer une formation 🔒 Formateur |

### Modules

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/formations/{id}/modules` | Modules d'une formation |
| POST | `/api/formations/{id}/modules` | Ajouter un module 🔒 Formateur |
| PUT | `/api/modules/{id}` | Modifier un module 🔒 Formateur |
| DELETE | `/api/modules/{id}` | Supprimer un module 🔒 Formateur |

### Inscriptions

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/formations/{id}/inscription` | S'inscrire 🔒 Apprenant |
| DELETE | `/api/formations/{id}/inscription` | Se désinscrire 🔒 Apprenant |
| GET | `/api/apprenant/formations` | Formations suivies 🔒 Apprenant |

🔒 = route protégée par JWT

---

## Tests

```bash
cd backend
php artisan test
```

Les tests couvrent :
- Authentification (inscription, connexion)
- Gestion des formations (création, modification)
- Sécurité des routes protégées
- Contrôle des rôles (apprenant / formateur)

---

## Branches Git

| Branche | Usage |
|---|---|
| `main` | Code stable, prêt pour la production |
| `develop` | Branche de développement principale |
| `features/*` | Nouvelles fonctionnalités |
| `fix/*` | Corrections de bugs |
