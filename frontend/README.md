# Frontend SkillHub (React + Vite)

Application frontend de SkillHub: interface apprenant/formateur, navigation, modales d'authentification et consommation de l'API Laravel.

## Sommaire

- [Stack frontend](#stack-frontend)
- [Structure du dossier](#structure-du-dossier)
- [Prerequis](#prerequis)
- [Installation et lancement](#installation-et-lancement)
- [Configuration environnement](#configuration-environnement)
- [Scripts utiles](#scripts-utiles)
- [Architecture applicative](#architecture-applicative)
- [Pages principales](#pages-principales)
- [Services API](#services-api)
- [Gestion de session](#gestion-de-session)
- [Conventions equipe](#conventions-equipe)
- [Depannage](#depannage)

## Stack frontend

- React 19
- React Router
- React Bootstrap + Bootstrap 5
- Vite 8
- ESLint

## Structure du dossier

```
frontend/
├── src/
│   ├── components/     # Composants globaux (Navbar, Footer)
│   ├── modals/         # Login/Register
│   ├── pages/          # Pages metier
│   ├── services/       # Clients API + mapping erreurs
│   ├── App.jsx         # Routing principal + session utilisateur
│   └── main.jsx        # Point d'entree React
├── public/
├── index.html
└── vite.config.js
```

## Prerequis

- Node.js 18+
- npm 9+
- Backend SkillHub en cours d'execution

## Installation et lancement

```bash
cd frontend
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Preview build local:

```bash
npm run preview
```

## Configuration environnement

Le frontend lit `VITE_API_BASE_URL` depuis `frontend/.env`.

Exemple:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Important:

- `http://localhost:5173` pour le frontend (Vite)
- `http://localhost:8000` pour le backend (Laravel)

## Scripts utiles

- `npm run dev` : serveur de dev
- `npm run build` : build de production
- `npm run preview` : preview du build
- `npm run lint` : verifications lint

## Architecture applicative

Le routage est centralise dans `src/App.jsx`.

- Gestion de session utilisateur (login/register/logout)
- Redirection post-auth en fonction du role
- Timeout d'inactivite (deconnexion automatique apres delai configure)

Les pages consomment l'API via `src/services/*` et ne parlent pas directement a `fetch`.

## Pages principales

- `/` : accueil
- `/formations` : catalogue
- `/formation/:id` : detail formation
- `/dashboard/formateur` : CRUD formations formateur
- `/dashboard/apprenant` : suivi des formations apprenant
- `/apprendre/:id` : lecture des modules

## Services API

Fichiers principaux:

- `src/services/apiClient.js` : requetes HTTP, headers communs, gestion erreurs
- `src/services/apiErrorMapper.js` : mapping erreurs API -> messages UX
- `src/services/authService.js` : login, register, profile, logout
- `src/services/formationService.js` : catalogue + detail + modules
- `src/services/trainerService.js` : CRUD formateur
- `src/services/enrollmentService.js` : inscriptions apprenant

## Gestion de session

- Token JWT stocke en localStorage (`skillhub_token`)
- User stocke en localStorage (`skillhub_user`)
- Timestamp activite utilisateur stocke (`skillhub_last_activity`)
- Deconnexion automatique apres inactivite (voir logique dans `App.jsx`)

## Conventions equipe

- Garder les appels API dans `services/`
- Eviter la logique metier backend directement dans les composants UI
- Utiliser `mapApiError` pour les messages utilisateur
- Ajouter/mettre a jour `PropTypes` sur les composants reusables
- Verifier `npm run build` avant push

## Depannage

### 1) Failed to fetch

- Verifier que le backend tourne
- Verifier `VITE_API_BASE_URL` dans `frontend/.env`
- Verifier la config CORS backend

### 2) 401 Unauthorized

- Verifier token valide
- Se reconnecter si session expiree
- Verifier role (formateur/apprenant) selon la route

### 3) Donnees non affichees dans un dashboard

- Verifier qu'il existe des donnees cote backend (formations/inscriptions)
- Verifier les reponses reseau dans DevTools > Network

---

Pour la vue globale du projet, consultez `../README.md`.
Pour la partie API/backend, consultez `../backend/README.md`.
