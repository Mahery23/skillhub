
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getFormation, getFormationModules } from '../services/formationService'
import { getStoredUser } from '../services/authService'

const niveauConfig = {
  debutant: { cls: 'sh-badge-green' },
  intermediaire: { cls: 'sh-badge-amber' },
  avance: { cls: 'sh-badge-red' },
}

function FormationDetail() {
  const user = getStoredUser()
  const { id } = useParams()
  const navigate = useNavigate()
  const [formation, setFormation] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const niveauKey = (formation?.niveau || '').toLowerCase().normalize('NFD').replaceAll(/\p{Diacritic}/gu, '')

  useEffect(() => {
    let active = true

    const loadDetail = async () => {
      try {
        setLoading(true)
        setError('')

        const [formationData, modulesData] = await Promise.all([
          getFormation(id),
          getFormationModules(id),
        ])

        if (active) {
          setFormation(formationData)
          setModules(modulesData)
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Impossible de charger la formation.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
        <div className="container py-5 text-center">
          Chargement de la formation...
        </div>
    )
  }

  if (error || !formation) {
    return (
        <div className="container py-5 text-center">
          <h2 className="sh-section-title mb-3">Formation introuvable</h2>
          {error && <p className="mb-4 text-muted">{error}</p>}
          <Link to="/formations" className="sh-btn sh-btn--outline">
            Retour aux formations
          </Link>
        </div>
    )
  }

  const handleSuivre = () => {
    if (user) {
      navigate(`/apprendre/${formation.id}`)
      return
    }

    navigate('/')
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
                <span className={`sh-badge ${niveauConfig[niveauKey]?.cls || 'sh-badge-green'}`}>
                  {formation.niveau}
                </span>
            </div>
            <h1 className="sh-section-title--light mb-3">{formation.titre}</h1>
            <p className="sh-section-sub--light mb-4">{formation.description}</p>
            <div className="d-flex gap-4 flex-wrap" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
              <span>👤 Formateur : <strong style={{ color: '#fff' }}>{formation.formateur?.nom || 'SkillHub'}</strong></span>
              <span>👥 {formation.apprenants ?? 0} apprenants</span>
              <span>👁 {formation.vues ?? 0} vues</span>
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
                  {modules.map(module => (
                      <div
                          key={module.id || module.ordre}
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
                      <strong style={{ color: 'var(--brand-deep)' }}>{modules.length} modules</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Apprenants</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.apprenants ?? 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Formateur</span>
                      <strong style={{ color: 'var(--brand-deep)' }}>{formation.formateur?.nom || 'SkillHub'}</strong>
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

