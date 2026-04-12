import { useParams, Link, useNavigate } from 'react-router-dom'

const FORMATIONS = [
  { id: 1, titre: "Introduction à React", niveau: "Débutant", categorie: "Développement web", description: "Apprenez les bases de React.js et construisez vos premières interfaces modernes. Ce cours couvre les composants, les hooks, le state management et bien plus encore.", apprenants: 35, vues: 120, formateur: "Alice Martin", modules: [ { ordre: 1, titre: "Introduction et installation" }, { ordre: 2, titre: "Les composants React" }, { ordre: 3, titre: "Le state et les props" }, { ordre: 4, titre: "Les hooks essentiels" }, { ordre: 5, titre: "Projet final" } ] },
  { id: 2, titre: "Laravel & API REST", niveau: "Intermédiaire", categorie: "Backend", description: "Construisez une API REST complète avec authentification JWT et bonnes pratiques Laravel. Migrations, modèles, contrôleurs, middlewares et tests unitaires.", apprenants: 22, vues: 98, formateur: "Karim Diallo", modules: [ { ordre: 1, titre: "Installation et configuration" }, { ordre: 2, titre: "Migrations et modèles" }, { ordre: 3, titre: "Contrôleurs et routes" }, { ordre: 4, titre: "Authentification JWT" }, { ordre: 5, titre: "Tests unitaires" } ] },
  { id: 3, titre: "Docker & DevOps", niveau: "Avancé", categorie: "DevOps", description: "Maîtrisez la conteneurisation et le déploiement d'applications en production avec Docker, Docker Compose et les pipelines CI/CD.", apprenants: 18, vues: 75, formateur: "Sophie Lefèvre", modules: [ { ordre: 1, titre: "Introduction à Docker" }, { ordre: 2, titre: "Images et conteneurs" }, { ordre: 3, titre: "Docker Compose" }, { ordre: 4, titre: "CI/CD avec GitHub Actions" } ] },
  { id: 4, titre: "UI/UX Design Figma", niveau: "Débutant", categorie: "Design", description: "Créez des interfaces utilisateur modernes et intuitives avec Figma. Wireframes, prototypes, design system et bonnes pratiques UX.", apprenants: 41, vues: 210, formateur: "Marc Dubois", modules: [ { ordre: 1, titre: "Prise en main de Figma" }, { ordre: 2, titre: "Wireframes et zoning" }, { ordre: 3, titre: "Design system" }, { ordre: 4, titre: "Prototypage interactif" } ] },
  { id: 5, titre: "Python pour la Data", niveau: "Intermédiaire", categorie: "Data", description: "Analysez et visualisez des données avec Python, Pandas et Matplotlib. De l'import des données à la création de graphiques avancés.", apprenants: 30, vues: 145, formateur: "Lina Morel", modules: [ { ordre: 1, titre: "Bases de Python" }, { ordre: 2, titre: "Manipulation avec Pandas" }, { ordre: 3, titre: "Visualisation avec Matplotlib" }, { ordre: 4, titre: "Projet d'analyse" } ] },
  { id: 6, titre: "Marketing Digital", niveau: "Débutant", categorie: "Marketing", description: "Maîtrisez les fondamentaux du marketing digital, des réseaux sociaux, du SEO et des campagnes publicitaires en ligne.", apprenants: 27, vues: 89, formateur: "Tom Bernard", modules: [ { ordre: 1, titre: "Introduction au marketing digital" }, { ordre: 2, titre: "Stratégie réseaux sociaux" }, { ordre: 3, titre: "SEO et référencement" }, { ordre: 4, titre: "Publicité en ligne" } ] },
  { id: 7, titre: "Node.js & Express", niveau: "Intermédiaire", categorie: "Backend", description: "Développez des API performantes avec Node.js et le framework Express. Gestion des routes, middlewares, base de données et authentification.", apprenants: 19, vues: 67, formateur: "Alice Martin", modules: [ { ordre: 1, titre: "Introduction à Node.js" }, { ordre: 2, titre: "Express et les routes" }, { ordre: 3, titre: "Middlewares" }, { ordre: 4, titre: "Connexion à une base de données" } ] },
  { id: 8, titre: "Machine Learning", niveau: "Avancé", categorie: "Data", description: "Construisez vos premiers modèles de machine learning avec scikit-learn. Régression, classification, clustering et évaluation des modèles.", apprenants: 12, vues: 54, formateur: "Karim Diallo", modules: [ { ordre: 1, titre: "Introduction au Machine Learning" }, { ordre: 2, titre: "Régression linéaire" }, { ordre: 3, titre: "Classification" }, { ordre: 4, titre: "Évaluation des modèles" } ] },
  { id: 9, titre: "CSS Avancé & Animations", niveau: "Intermédiaire", categorie: "Design", description: "Maîtrisez Flexbox, Grid et les animations CSS pour des interfaces dynamiques et modernes.", apprenants: 24, vues: 103, formateur: "Sophie Lefèvre", modules: [ { ordre: 1, titre: "Flexbox avancé" }, { ordre: 2, titre: "CSS Grid" }, { ordre: 3, titre: "Animations et transitions" }, { ordre: 4, titre: "Projet interface complète" } ] },
]

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

function FormationDetail({ user, onOpenLogin }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const formation = FORMATIONS.find(f => f.id === parseInt(id))

  if (!formation) {
    return (
        <div className="container py-5 text-center">
          <h2 className="sh-section-title mb-3">Formation introuvable</h2>
          <Link to="/formations" className="sh-btn sh-btn--outline">
            Retour aux formations
          </Link>
        </div>
    )
  }

  const handleSuivre = () => {
    if (!user) {
      onOpenLogin()
    } else {
      navigate(`/apprendre/${formation.id}`)
    }
  }

  return (
      <div>
        {/* En-tête */}
        <section className="sh-section--dark py-5">
          <div className="container">
            <Link
                to="/formations"
                className="small mb-3 d-inline-block"
                style={{ color: 'var(--brand-soft)', textDecoration: 'none' }}
            >
              ← Retour aux formations
            </Link>
            <div className="d-flex align-items-center gap-2 mb-3">
            <span className="sh-cat-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--brand-soft)' }}>
              {formation.categorie}
            </span>
              <span className={`sh-badge ${niveauConfig[formation.niveau].cls}`}>
              {formation.niveau}
            </span>
            </div>
            <h1 className="sh-section-title--light mb-3">{formation.titre}</h1>
            <p className="sh-section-sub--light mb-4">{formation.description}</p>
            <div className="d-flex gap-4 flex-wrap" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
              <span>👤 Formateur : <strong style={{ color: '#fff' }}>{formation.formateur}</strong></span>
              <span>👥 {formation.apprenants} apprenants</span>
              <span>👁 {formation.vues} vues</span>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="sh-section">
          <div className="container">
            <div className="row g-5">

              {/* Liste des modules */}
              <div className="col-lg-8">
                <h2 className="sh-section-title mb-4">Contenu de la formation</h2>
                <div className="d-flex flex-column gap-3">
                  {formation.modules.map(module => (
                      <div
                          key={module.ordre}
                          className="d-flex align-items-center gap-3 p-3 rounded-3"
                          style={{
                            background: 'var(--bg-white)',
                            border: '1px solid var(--brand-border)',
                          }}
                      >
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: 36, height: 36,
                              background: 'var(--brand-ice)',
                              color: 'var(--brand-main)',
                              fontSize: 13, fontWeight: 700,
                            }}
                        >
                          {module.ordre}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-deep)' }}>
                      Module {module.ordre} — {module.titre}
                    </span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Carte d'action */}
              <div className="col-lg-4">
                <div
                    className="p-4 rounded-4 sticky-top"
                    style={{
                      background: 'var(--bg-white)',
                      border: '1.5px solid var(--brand-border)',
                      boxShadow: 'var(--shadow-md)',
                      top: 90,
                    }}
                >
                  <div className="text-center mb-4">
                  <span
                      className="d-inline-block px-3 py-1 rounded-pill mb-2"
                      style={{ background: 'var(--brand-ice)', color: 'var(--brand-main)', fontSize: 13, fontWeight: 700 }}
                  >
                    100% Gratuit
                  </span>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Accès immédiat à tous les modules
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-4" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div className="d-flex justify-content-between">
                      <span>Niveau</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.niveau}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Modules</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.modules.length} modules</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Apprenants</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.apprenants}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Formateur</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.formateur}</strong>
                    </div>
                  </div>

                  <button className="sh-btn sh-btn--primary w-100" onClick={handleSuivre}>
                    {user ? 'Suivre la formation' : 'Se connecter pour suivre'}
                  </button>

                  {!user && (
                      <p className="text-center mt-2" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Vous devez être connecté pour accéder à la formation
                      </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
  )
}

export default FormationDetail