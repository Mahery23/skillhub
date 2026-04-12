import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFormations } from '../services/formationService'

const CATEGORIES = ["Toutes", "Développement web", "Backend", "DevOps", "Design", "Data", "Marketing"]
const NIVEAUX = ["Tous", "Débutant", "Intermédiaire", "Avancé"]

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

function Formations() {
  const [formations, setFormations]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [recherche, setRecherche]     = useState('')
  const [categorie, setCategorie]     = useState('Toutes')
  const [niveau, setNiveau]           = useState('Tous')

  useEffect(() => {
    const fetchFormations = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFormations({ recherche, categorie, niveau })
        // L'API peut retourner { data: [...] } ou directement [...]
        setFormations(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des formations.')
      } finally {
        setLoading(false)
      }
    }
    fetchFormations()
  }, [recherche, categorie, niveau])

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
              {loading ? 'Chargement...' : `${formations.length} formation${formations.length > 1 ? 's' : ''} disponible${formations.length > 1 ? 's' : ''} — gratuites et accessibles à tous`}
            </p>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-4 bg-white border-bottom">
          <div className="container">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Recherche</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher une formation..."
                    value={recherche}
                    onChange={e => setRecherche(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Catégorie</label>
                <select className="form-select" value={categorie} onChange={e => setCategorie(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Niveau</label>
                <select className="form-select" value={niveau} onChange={e => setNiveau(e.target.value)}>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100" onClick={resetFiltres}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Résultats */}
        <section className="sh-section">
          <div className="container">

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: 'var(--brand-main)' }} role="status" />
                  <p className="mt-3 small" style={{ color: 'var(--text-secondary)' }}>Chargement des formations...</p>
                </div>
            )}

            {/* Erreur */}
            {!loading && error && (
                <div className="text-center py-5">
                  <p className="fw-semibold" style={{ color: 'var(--brand-deep)' }}>Impossible de charger les formations.</p>
                  <p className="small mt-1" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                  <button className="sh-btn sh-btn--outline mt-3" onClick={resetFiltres}>Réessayer</button>
                </div>
            )}

            {/* Résultats */}
            {!loading && !error && (
                <>
                  <p className="mb-4 small" style={{ color: 'var(--text-secondary)' }}>
                    {formations.length} formation{formations.length > 1 ? 's' : ''} trouvée{formations.length > 1 ? 's' : ''}
                  </p>

                  {formations.length > 0 ? (
                      <div className="row g-4">
                        {formations.map(f => (
                            <div className="col-md-4" key={f.id}>
                              <div className="sh-formation-card">
                                <div className="sh-formation-card-top">
                                  <span className="sh-cat-tag">{f.categorie}</span>
                                  <span className={`sh-badge ${niveauConfig[f.niveau]?.cls || 'sh-badge-green'}`}>{f.niveau}</span>
                                </div>
                                <h6 className="sh-formation-title">{f.titre}</h6>
                                <p className="sh-formation-desc">{f.description}</p>
                                <p className="small" style={{ color: 'var(--text-muted)' }}>
                                  Par {f.formateur?.name || f.formateur?.nom || 'Formateur'}
                                </p>
                                <div className="sh-formation-meta">
                                  <span>👥 {f.apprenants ?? f.nb_apprenants ?? 0} apprenants</span>
                                  <span>👁 {f.vues ?? f.nombre_de_vues ?? 0} vues</span>
                                </div>
                                <Link to={`/formation/${f.id}`} className="sh-btn sh-btn--card-cta">
                                  Voir le détail
                                </Link>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-5">
                        <p className="fs-5 fw-semibold" style={{ color: 'var(--brand-deep)' }}>Aucune formation trouvée</p>
                        <p className="small mt-2" style={{ color: 'var(--text-secondary)' }}>Essayez d'autres mots-clés ou réinitialisez les filtres.</p>
                        <button className="sh-btn sh-btn--outline mt-3" onClick={resetFiltres}>Réinitialiser les filtres</button>
                      </div>
                  )}
                </>
            )}

          </div>
        </section>
      </div>
  )
}

export default Formations