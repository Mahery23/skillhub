import { useState } from 'react'
import { Link } from 'react-router-dom'

const FORMATIONS = [
  { id: 1, titre: "Introduction à React", niveau: "Débutant", categorie: "Développement web", description: "Apprenez les bases de React.js et construisez vos premières interfaces modernes.", apprenants: 35, vues: 120, formateur: "Alice Martin" },
  { id: 2, titre: "Laravel & API REST", niveau: "Intermédiaire", categorie: "Backend", description: "Construisez une API REST complète avec authentification JWT et bonnes pratiques.", apprenants: 22, vues: 98, formateur: "Karim Diallo" },
  { id: 3, titre: "Docker & DevOps", niveau: "Avancé", categorie: "DevOps", description: "Maîtrisez la conteneurisation et le déploiement d'applications en production.", apprenants: 18, vues: 75, formateur: "Sophie Lefèvre" },
  { id: 4, titre: "UI/UX Design Figma", niveau: "Débutant", categorie: "Design", description: "Créez des interfaces utilisateur modernes et intuitives avec Figma.", apprenants: 41, vues: 210, formateur: "Marc Dubois" },
  { id: 5, titre: "Python pour la Data", niveau: "Intermédiaire", categorie: "Data", description: "Analysez et visualisez des données avec Python, Pandas et Matplotlib.", apprenants: 30, vues: 145, formateur: "Lina Morel" },
  { id: 6, titre: "Marketing Digital", niveau: "Débutant", categorie: "Marketing", description: "Maîtrisez les fondamentaux du marketing digital et des réseaux sociaux.", apprenants: 27, vues: 89, formateur: "Tom Bernard" },
  { id: 7, titre: "Node.js & Express", niveau: "Intermédiaire", categorie: "Backend", description: "Développez des API performantes avec Node.js et le framework Express.", apprenants: 19, vues: 67, formateur: "Alice Martin" },
  { id: 8, titre: "Machine Learning", niveau: "Avancé", categorie: "Data", description: "Construisez vos premiers modèles de machine learning avec scikit-learn.", apprenants: 12, vues: 54, formateur: "Karim Diallo" },
  { id: 9, titre: "CSS Avancé & Animations", niveau: "Intermédiaire", categorie: "Design", description: "Maîtrisez Flexbox, Grid et les animations CSS pour des interfaces dynamiques.", apprenants: 24, vues: 103, formateur: "Sophie Lefèvre" },
]

const CATEGORIES = ["Toutes", "Développement web", "Backend", "DevOps", "Design", "Data", "Marketing"]
const NIVEAUX = ["Tous", "Débutant", "Intermédiaire", "Avancé"]

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

function Formations() {
  const [recherche, setRecherche]     = useState('')
  const [categorie, setCategorie]     = useState('Toutes')
  const [niveau, setNiveau]           = useState('Tous')

  const formationsFiltrees = FORMATIONS.filter(f => {
    const matchRecherche = f.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        f.description.toLowerCase().includes(recherche.toLowerCase())
    const matchCategorie = categorie === 'Toutes' || f.categorie === categorie
    const matchNiveau    = niveau === 'Tous' || f.niveau === niveau
    return matchRecherche && matchCategorie && matchNiveau
  })

  const resetFiltres = () => {
    setRecherche('')
    setCategorie('Toutes')
    setNiveau('Tous')
  }

  return (
      <div>
        {/* En-tête */}
        <section className="sh-section--dark py-5">
          <div className="container text-center">
            <h1 className="sh-section-title--light mb-2">Toutes les formations</h1>
            <p className="sh-section-sub--light">
              {FORMATIONS.length} formations disponibles — gratuites et accessibles à tous
            </p>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-4 bg-white border-bottom">
          <div className="container">
            <div className="row g-3 align-items-end">

              {/* Recherche */}
              <div className="col-md-4">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Recherche
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher une formation..."
                    value={recherche}
                    onChange={e => setRecherche(e.target.value)}
                />
              </div>

              {/* Catégorie */}
              <div className="col-md-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Catégorie
                </label>
                <select
                    className="form-select"
                    value={categorie}
                    onChange={e => setCategorie(e.target.value)}
                >
                  {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div className="col-md-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Niveau
                </label>
                <select
                    className="form-select"
                    value={niveau}
                    onChange={e => setNiveau(e.target.value)}
                >
                  {NIVEAUX.map(n => (
                      <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <div className="col-md-2">
                <button
                    className="btn btn-outline-secondary w-100"
                    onClick={resetFiltres}
                >
                  Réinitialiser
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Résultats */}
        <section className="sh-section">
          <div className="container">

            {/* Compteur résultats */}
            <p className="mb-4 small" style={{ color: 'var(--text-secondary)' }}>
              {formationsFiltrees.length} formation{formationsFiltrees.length > 1 ? 's' : ''} trouvée{formationsFiltrees.length > 1 ? 's' : ''}
            </p>

            {/* Grille formations */}
            {formationsFiltrees.length > 0 ? (
                <div className="row g-4">
                  {formationsFiltrees.map(f => (
                      <div className="col-md-4" key={f.id}>
                        <div className="sh-formation-card">
                          <div className="sh-formation-card-top">
                            <span className="sh-cat-tag">{f.categorie}</span>
                            <span className={`sh-badge ${niveauConfig[f.niveau].cls}`}>{f.niveau}</span>
                          </div>
                          <h6 className="sh-formation-title">{f.titre}</h6>
                          <p className="sh-formation-desc">{f.description}</p>
                          <p className="small" style={{ color: 'var(--text-muted)' }}>
                            Par {f.formateur}
                          </p>
                          <div className="sh-formation-meta">
                            <span>👥 {f.apprenants} apprenants</span>
                            <span>👁 {f.vues} vues</span>
                          </div>
                          <Link to={`/formation/${f.id}`} className="sh-btn sh-btn--card-cta">
                            Voir le détail
                          </Link>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                /* Aucun résultat */
                <div className="text-center py-5">
                  <p className="fs-5 fw-semibold" style={{ color: 'var(--brand-deep)' }}>
                    Aucune formation trouvée
                  </p>
                  <p className="small mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Essayez d'autres mots-clés ou réinitialisez les filtres.
                  </p>
                  <button className="sh-btn sh-btn--outline mt-3" onClick={resetFiltres}>
                    Réinitialiser les filtres
                  </button>
                </div>
            )}

          </div>
        </section>
      </div>
  )
}

export default Formations