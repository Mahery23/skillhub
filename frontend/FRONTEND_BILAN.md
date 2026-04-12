# Bilan Frontend — SkillHub

## Stack technique utilisée

| Technologie | Rôle |
|---|---|
| React.js + Vite | Framework frontend |
| React Router DOM | Navigation entre les pages |
| React Bootstrap | Composants UI (modals, formulaires) |
| Bootstrap | Styles de base |
| CSS personnalisé (`index.css`) | Système de design SkillHub |

---

## Structure du projet

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── modals/
│   │   ├── LoginModal.jsx
│   │   └── RegisterModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Formations.jsx
│   │   ├── FormationDetail.jsx
│   │   ├── DashboardFormateur.jsx
│   │   ├── DashboardApprenant.jsx
│   │   └── SuiviFormation.jsx
│   ├── services/
│   │   └── authService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

## Système de design (index.css)

Un système de design complet a été mis en place dans `index.css` avec :

**Variables CSS globales :**
- Palette de couleurs `--brand-deep`, `--brand-mid`, `--brand-main`, `--brand-soft`, `--brand-ice`
- Couleurs de texte `--text-primary`, `--text-secondary`, `--text-muted`
- Couleurs de fond `--bg-page`, `--bg-white`, `--bg-soft`
- Badges niveaux : vert (débutant), amber (intermédiaire), rouge (avancé)
- Border radius `--radius-sm` à `--radius-xl`
- Ombres `--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Classes utilitaires réutilisables :**
- `.sh-btn` avec variantes : `--primary`, `--outline`, `--ghost`, `--white`, `--card-cta`
- `.sh-formation-card` : carte formation avec hover effect
- `.sh-badge`, `.sh-badge-green`, `.sh-badge-amber`, `.sh-badge-red` : badges de niveau
- `.sh-section`, `.sh-section--dark`, `.sh-section--soft` : sections de page
- `.sh-hero` et tous ses éléments : section hero avec animations float
- `.sh-stats-band` : bande de statistiques
- `.sh-role-card` : cartes de choix de rôle
- `.sh-step` : étapes "Comment ça marche"
- `.sh-valeur-card` : cartes valeurs
- `.sh-temoignage-card` : cartes témoignages
- `.sh-avatar` : avatar avec initiales
- `.sh-cta-band` : bande call-to-action finale

---

## Gestion de l'état global (App.jsx)

`App.jsx` gère l'état central de l'application :

```jsx
const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('skillhub_user')
    return savedUser ? JSON.parse(savedUser) : null
})
```

**Fonctionnalités :**
- Persistance de la session dans le `localStorage`
- Callbacks `handleLogin()`, `handleRegister()`, `handleLogout()`
- Ouverture des modals depuis n'importe quelle page via `onOpenLogin` et `onOpenRegister`
- Passage du `user` aux pages qui en ont besoin via les props

**Protection des routes :**
- `DashboardFormateur` → redirige vers `/` si non connecté, vers `/dashboard/apprenant` si mauvais rôle
- `DashboardApprenant` → redirige vers `/` si non connecté, vers `/dashboard/formateur` si mauvais rôle
- `SuiviFormation` → redirige vers `/` si non connecté

---

## Pages développées

### 1. Page d'accueil — `Home.jsx` (route `/`)

**Sections dans l'ordre :**
- **Hero** : titre, sous-titre, boutons CTA adaptatifs (différents si connecté ou non), visuel animé avec cards flottantes
- **Stats band** : 120+ formations, 4 800 apprenants, 60 formateurs, 5 catégories
- **Choix du rôle** : cartes apprenant/formateur avec inscription directe (visible seulement si non connecté)
- **Comment ça marche** : 4 étapes numérotées sur fond sombre
- **Formations à la une** : 3 cards avec catégorie, niveau, description, meta (apprenants/vues) et lien vers le détail
- **Nos valeurs** : 3 cartes (Accessibilité, Communauté, Excellence)
- **Témoignages** : 3 cartes avec avatar initiales, étoiles et citation
- **CTA final** : bande violette avec boutons adaptatifs selon connexion

**Props reçues :** `user`, `onOpenLogin`, `onOpenRegister`

---

### 2. Page des formations — `Formations.jsx` (route `/formations`)

**Fonctionnalités :**
- En-tête sombre avec nombre total de formations
- **3 filtres dynamiques** : recherche par mot-clé, filtre par catégorie, filtre par niveau
- Bouton de réinitialisation des filtres
- Compteur de résultats en temps réel
- Grille de 9 formations mock (données fictives en attendant l'API)
- Message "Aucune formation trouvée" si les filtres ne correspondent à rien

**Données mock disponibles :**
Introduction à React, Laravel & API REST, Docker & DevOps, UI/UX Design Figma, Python pour la Data, Marketing Digital, Node.js & Express, Machine Learning, CSS Avancé & Animations

---

### 3. Page détail formation — `FormationDetail.jsx` (route `/formation/:id`)

**Contenu affiché :**
- En-tête sombre avec catégorie, niveau, titre, description, formateur, nombre d'apprenants et vues
- Lien retour vers `/formations`
- Liste des modules numérotés (minimum 4-5 modules par formation)
- **Carte d'action sticky** (droite) avec : badge "100% Gratuit", détails de la formation, bouton d'action

**Logique du bouton d'action :**
- Si non connecté → ouvre la modal de connexion (`onOpenLogin`)
- Si connecté → redirige vers `/apprendre/:id`

**Props reçues :** `user`, `onOpenLogin`

---

### 4. Dashboard formateur — `DashboardFormateur.jsx` (route `/dashboard/formateur`)

**Fonctionnalités :**
- Protection de route (redirect si non connecté ou si rôle ≠ formateur)
- En-tête avec message de bienvenue personnalisé (`user.nom`)
- **Stats rapides** : nombre de formations, total apprenants, total vues
- Grille des formations du formateur avec cards
- **CRUD complet sur les formations :**
  - Création via modal avec champs : titre, catégorie, niveau, description
  - Modification via modal pré-remplie avec les données existantes
  - Suppression avec modal de confirmation
- État vide avec message d'invitation si aucune formation
- Validation du formulaire (titre et description obligatoires)

**Props reçues :** `user`

> **Note :** Pour tester sans API, injecter un user dans le localStorage via la console du navigateur :
> ```javascript
> localStorage.setItem('skillhub_user', JSON.stringify({ nom: 'Alice Martin', email: 'alice@test.com', role: 'formateur' }))
> ```

---

### 5. Dashboard apprenant — `DashboardApprenant.jsx` (route `/dashboard/apprenant`)

**Fonctionnalités :**
- Protection de route (redirect si non connecté ou si rôle ≠ apprenant)
- En-tête avec message de bienvenue personnalisé
- **Stats rapides** : formations suivies, formations terminées, progression moyenne
- Grille des formations avec cards incluant une barre de progression
- **Barre de progression colorée** : rouge (<40%), amber (40-79%), vert (≥80%)
- Bouton **"Suivre"** → redirige vers `/apprendre/:id`
- Bouton **"Ne plus suivre"** → modal de confirmation → désinscription
- État vide avec lien vers le catalogue

**Props reçues :** `user`

> **Note :** Pour tester, injecter un user apprenant dans le localStorage :
> ```javascript
> localStorage.setItem('skillhub_user', JSON.stringify({ nom: 'Jean Dupont', email: 'jean@test.com', role: 'apprenant' }))
> ```

---

### 6. Page de suivi de formation — `SuiviFormation.jsx` (route `/apprendre/:id`)

**Fonctionnalités :**
- Protection de route (redirect si non connecté)
- En-tête avec titre, description et barre de progression globale
- **Layout en deux colonnes :**
  - Gauche : liste des modules avec état visuel (en cours / terminé / non commencé)
  - Droite : contenu du module actif (texte pédagogique)
- Navigation entre modules avec boutons Précédent / Suivant
- Bouton **"Marquer comme terminé"** qui bascule l'état du module
- Progression calculée automatiquement : `(modules terminés / total modules) * 100`
- Message de félicitations quand progression = 100%

**Props reçues :** `user`

---

## Données mock

Toutes les pages utilisent des données fictives en attendant la connexion à l'API Laravel.
Les données sont définies en constantes en haut de chaque fichier de page.
Quand l'API sera prête, il suffira de remplacer ces constantes par des appels à `authService.js` / `axios`.

---

## Gitflow suivi

| Branche | Contenu | Statut |
|---|---|---|
| `feature/home-page` | Page d'accueil complète + Navbar + Footer | Mergée dans develop |
| `feature/liste-formations` | Formations.jsx + FormationDetail.jsx + DashboardFormateur.jsx | Mergée dans develop |
| `feature/dashboard-apprenant` | DashboardApprenant.jsx | Mergée dans develop |
| `feature/suivi-formation` | SuiviFormation.jsx | Mergée dans develop |

**Convention de commits utilisée :**
- Titre en anglais (convention) : `feat: add formations page with filters`
- Description optionnelle en français

---

## Ce qui reste à faire (backend + intégration)

### Backend Laravel (à faire)
- Migrations MySQL : `users`, `formations`, `modules`, `enrollments`
- Modèles Eloquent avec relations
- Authentification JWT (`POST /api/register`, `POST /api/login`, `GET /api/profile`)
- CRUD formations (`GET/POST/PUT/DELETE /api/formations`)
- CRUD modules (`GET/POST/PUT/DELETE /api/formations/{id}/modules`)
- Inscription/désinscription (`POST/DELETE /api/formations/{id}/inscription`)
- Gestion des rôles (formateur / apprenant)
- Incrément automatique des vues
- Tests unitaires PHPUnit
- MongoDB pour les logs d'activité

### Intégration frontend (à faire après l'API)
- Brancher `authService.js` sur les vrais endpoints API
- Remplacer toutes les données mock par des appels Axios
- Gérer les tokens JWT dans les headers des requêtes
- Gérer les erreurs API dans les composants
- Tests et validation finale

---

*Document généré le 12/04/2026 — Frontend SkillHub v1.0*
