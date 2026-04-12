# SkillHub - Plateforme e-learning collaborative

SkillHub met en relation des **formateurs** et des **apprenants** autour de formations en ligne gratuites.

Ce README est la vue globale du projet (frontend + backend) pour faciliter l'onboarding de l'equipe.

## Sommaire

- [Vision produit](#vision-produit)
- [Architecture globale](#architecture-globale)
- [Stack technique](#stack-technique)
- [Structure du repository](#structure-du-repository)
- [Prerequis](#prerequis)
- [Installation rapide (fullstack)](#installation-rapide-fullstack)
- [Lancement en local](#lancement-en-local)
- [Parcours de verification rapide](#parcours-de-verification-rapide)
- [Routes frontend](#routes-frontend)
- [API backend (resume)](#api-backend-resume)
- [Documentation detaillee](#documentation-detaillee)
- [Workflow equipe](#workflow-equipe)
- [Qualite et tests](#qualite-et-tests)
- [Depannage](#depannage)

## Vision produit

- Offrir un catalogue de formations en ligne
- Permettre aux formateurs de creer et gerer leurs contenus
- Permettre aux apprenants de s'inscrire, suivre et progresser
- Assurer la securite via JWT et controle des roles

## Architecture globale

```
Frontend React (Vite)  <----HTTP/JSON---->  Backend Laravel API  <---->  MySQL
	   |                                            |
	   |                                            +---- JWT Auth + controle des roles
	   |
	   +---- Navigation, modales auth, dashboards
```

## Stack technique

| Cote | Technologie |
|---|---|
| Frontend | React 19, Vite, React Router, React Bootstrap |
| Backend | Laravel 13, PHP 8.3 |
| Auth | JWT (`php-open-source-saver/jwt-auth`) |
| DB principale | MySQL |
| DB annexe | MongoDB (connexion dispo) |
| Tests | PHPUnit |

## Structure du repository

```
skillhub_group/
├── frontend/          # Application React
├── backend/           # API Laravel
├── README.md          # Guide global (ce fichier)
└── ...
```

## Prerequis

- Node.js 18+
- npm 9+
- PHP 8.3+
- Composer 2+
- MySQL 8+ (ou MariaDB)

## Installation rapide (fullstack)

### 1) Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
```

### 2) Frontend

```bash
cd ../frontend
npm install
```

Configurer `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

## Lancement en local

### Terminal 1 - Backend

```bash
cd backend
php artisan serve
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

## Parcours de verification rapide

1. Ouvrir le frontend (`http://localhost:5173`)
2. Creer un compte apprenant puis formateur
3. En tant que formateur: creer/modifier/supprimer une formation
4. En tant qu'apprenant: consulter detail, s'inscrire, verifier dashboard
5. Verifier les requetes API dans DevTools > Network

## Routes frontend

| Route | Ecran |
|---|---|
| `/` | Accueil |
| `/formations` | Catalogue |
| `/formation/:id` | Detail formation |
| `/dashboard/formateur` | Dashboard formateur |
| `/dashboard/apprenant` | Dashboard apprenant |
| `/apprendre/:id` | Lecture des modules |

## API backend (resume)

Authentification:

- `POST /api/register`
- `POST /api/login`
- `GET /api/profile` (JWT)

Formations:

- `GET /api/formations`
- `GET /api/formations/{id}`
- `POST /api/formations` (formateur)
- `PUT /api/formations/{id}` (formateur)
- `DELETE /api/formations/{id}` (formateur)

Inscriptions apprenant:

- `POST /api/formations/{id}/inscription`
- `DELETE /api/formations/{id}/inscription`
- `GET /api/apprenant/formations`

## Documentation detaillee

- Backend detaille: `backend/README.md`
- Frontend detaille: `frontend/README.md`
- Spec API OpenAPI: `backend/docs/openapi.yaml`

## Workflow equipe

Branches recommandees:

- `main` : stable/production
- `develop` : integration continue
- `feature/*` : nouvelles fonctionnalites
- `fix/*` : corrections

Bonnes pratiques PR:

- PR petite et ciblee
- Description claire (contexte, changements, tests)
- Captures ecran si impact UI
- Verification locale avant push

## Qualite et tests

Backend:

```bash
cd backend
composer run test
```

Frontend:

```bash
cd frontend
npm run build
```

## Depannage

### 1) CORS / Failed to fetch

- Verifier `VITE_API_BASE_URL`
- Verifier que backend tourne bien sur le port attendu
- Vider cache Laravel:

```bash
cd backend
php artisan optimize:clear
```

### 2) 401 Unauthorized

- Se reconnecter (token expire)
- Verifier role selon route protegee
- Verifier que `JWT_SECRET` existe dans `backend/.env`

### 3) Migrations en erreur

- Verifier credentials MySQL
- Verifier existence de la base
- Repartir proprement:

```bash
cd backend
php artisan migrate:fresh --seed
```

---

Si vous arrivez sur le projet, commencez par ce README, puis enchainez avec `backend/README.md` ou `frontend/README.md` selon votre scope.
