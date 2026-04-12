# Backend SkillHub (Laravel API)

Backend API de SkillHub: authentification JWT, catalogue de formations, modules, et inscriptions apprenants.

## Sommaire

- [Stack technique](#stack-technique)
- [Structure du backend](#structure-du-backend)
- [Prerequis](#prerequis)
- [Installation rapide](#installation-rapide)
- [Configuration `.env`](#configuration-env)
- [Lancer le projet](#lancer-le-projet)
- [Scripts utiles](#scripts-utiles)
- [Routes API principales](#routes-api-principales)
- [Auth et roles](#auth-et-roles)
- [Base de donnees et migrations](#base-de-donnees-et-migrations)
- [MongoDB et logs d'activite](#mongodb-et-logs-dactivite)
- [Tests et qualite](#tests-et-qualite)
- [Documentation API (OpenAPI)](#documentation-api-openapi)
- [Depannage](#depannage)

## Stack technique

- PHP `^8.3`
- Laravel `^13`
- JWT: `php-open-source-saver/jwt-auth`
- MySQL (donnees applicatives)
- MongoDB (logs d'activite / audit)
- PHPUnit `^12` (tests)

## Structure du backend

Repertoires importants:

- `app/Http/Controllers/Api` : endpoints API (`AuthController`, `FormationController`, `ModuleController`, `EnrollmentController`)
- `app/Http/Middleware/CheckRole.php` : controle des roles (`formateur`, `apprenant`)
- `routes/api.php` : declaration des routes API
- `database/migrations` : schema SQL
- `database/seeders` : donnees de test
- `docs/openapi.yaml` : spec OpenAPI 3.0

## Prerequis

- PHP 8.3+
- Composer 2+
- MySQL 8+ (ou MariaDB compatible)
- Node.js 18+ (pour assets Vite)

## Installation rapide

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

Puis configurer la base dans `.env` et lancer les migrations:

```bash
php artisan migrate
php artisan db:seed
```

## Configuration `.env`

Exemple minimal MySQL:

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skillhub
DB_USERNAME=root
DB_PASSWORD=

AUTH_GUARD=api
JWT_SECRET=... # genere via php artisan jwt:secret
```

Le projet contient aussi une connexion `mongodb` dans `config/database.php` (base par defaut: `skillhub_logs`).

## Lancer le projet

Mode simple:

```bash
php artisan serve
```

Mode dev complet (serveur + queue + logs + vite):

```bash
composer run dev
```

## Scripts utiles

Scripts declares dans `composer.json`:

- `composer run setup` : installation + `.env` + key + migration + build
- `composer run dev` : environnement dev complet
- `composer run test` : clear config + tests Laravel

## Routes API principales

Les routes sont definies dans `routes/api.php`.

Public:

- `POST /api/register`
- `POST /api/login`
- `GET /api/formations`
- `GET /api/formations/{formation}`
- `GET /api/formations/{formation}/modules`

Protegees JWT:

- `GET /api/profile`
- `POST /api/logout`

Formateur (`check.role:formateur`):

- `POST /api/formations`
- `PUT /api/formations/{formation}`
- `DELETE /api/formations/{formation}`
- `POST /api/formations/{formation}/modules`
- `PUT /api/modules/{module}`
- `DELETE /api/modules/{module}`

Apprenant (`check.role:apprenant`):

- `POST /api/formations/{formation}/inscription`
- `DELETE /api/formations/{formation}/inscription`
- `GET /api/apprenant/formations`

## Auth et roles

- Guard API: `auth:api` avec JWT
- Roles metier:
  - `formateur`: CRUD formations/modules
  - `apprenant`: inscription/suivi formations
- Le middleware `CheckRole` renvoie:
  - `401` si non authentifie
  - `403` si role non autorise

## Base de donnees et migrations

Tables principales:

- `users`
- `formations`
- `modules`
- `enrollments`

Commandes utiles:

```bash
php artisan migrate
php artisan migrate:rollback
php artisan migrate:fresh --seed
```

## MongoDB et logs d'activite

MongoDB est utilise pour stocker des **logs d'activite** applicatifs.

- **Connexion**: definie dans `config/database.php` sous le nom `mongodb`
- **Base par defaut**: `skillhub_logs`
- **Collection**: `activity_logs`

Le service centralise dans `app/Services/ActivityLogService.php` ecrit les evenements sans casser le flux API si MongoDB est indisponible.

Evenements actuellement journalises:

- `user.registered`
- `user.logged_in`
- `user.logged_out`
- `formation.created`
- `formation.updated`
- `formation.deleted`
- `module.created`
- `module.updated`
- `module.deleted`
- `enrollment.created`
- `enrollment.deleted`

### Verifier dans Compass

1. Ouvrir MongoDB Compass
2. Se connecter au serveur local (`mongodb://localhost:27017`)
3. Ouvrir la base `skillhub_logs`
4. Ouvrir la collection `activity_logs`
5. Consulter l'onglet **Documents**

Si la collection n'apparait pas encore, c'est souvent parce qu'aucun evenement n'a ete genere.

## Tests et qualite

Lancer les tests:

```bash
composer run test
```

Formatage/style (si utilise dans votre workflow):

```bash
./vendor/bin/pint
```

## Documentation API (OpenAPI)

La source de verite API est `docs/openapi.yaml`.

Consultez aussi `docs/README.md` pour les details d'usage (Swagger Editor, Swagger UI, Redoc).

## Depannage

### 1) 401 sur routes protegees

- Verifier `Authorization: Bearer <token>`
- Verifier que `JWT_SECRET` est present dans `.env`
- Regenerer si besoin:

```bash
php artisan jwt:secret
```

### 2) Erreurs CORS en local frontend

- Verifier `config/cors.php`
- Vider les caches:

```bash
php artisan optimize:clear
```

### 3) Migrations qui echouent

- Verifier credentials DB
- Verifier que la base existe
- Repartir proprement:

```bash
php artisan migrate:fresh --seed
```

---

Si vous reprenez le projet: commencez par **Installation rapide**, puis validez les endpoints via `docs/openapi.yaml`.
