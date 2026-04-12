import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import { getFormationsApprenant, desinscrire } from '../services/enrollmentService'

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

function DashboardApprenant({ user }) {
  const [enrollments, setEnrollments]           = useState([])
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState(null)
  const [showConfirm, setShowConfirm]           = useState(false)
  const [idADesinscrire, setIdADesinscrire]     = useState(null)

  // useEffect AVANT les returns conditionnels
  useEffect(() => {
    if (!user || user.role !== 'apprenant') return

    const fetchFormations = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFormationsApprenant()
        // L'API retourne { formations: [...] }
        // Chaque item : { enrollment_id, progression, formation: { id, titre... } }
        const items = data.formations || data.data || data || []
        setEnrollments(items)
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }
    fetchFormations()
  }, [user])

  // Redirections APRES le useEffect
  if (!user) return <Navigate to="/" />
  if (user.role !== 'apprenant') return <Navigate to="/dashboard/formateur" />

  const demanderDesinscription = (formationId) => {
    setIdADesinscrire(formationId)
    setShowConfirm(true)
  }

  const confirmerDesinscription = async () => {
    try {
      await desinscrire(idADesinscrire)
      setEnrollments(prev => prev.filter(e => e.formation?.id !== idADesinscrire))
    } catch (err) {
      setError(err.message || 'Erreur lors de la désinscription.')
    } finally {
      setShowConfirm(false)
      setIdADesinscrire(null)
    }
  }

  const progressionColor = (p) => {
    if (p >= 80) return 'var(--green-text)'
    if (p >= 40) return 'var(--amber-text)'
    return 'var(--red-text)'
  }

  const progressionMoyenne = enrollments.length > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + (e.progression || 0), 0) / enrollments.length)
      : 0

  return (
      <div>
        {/* En-tête */}
        <section className="sh-section--dark py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="sh-section-title--light mb-1">
                  Bonjour, {user.name || user.email} 👋
                </h1>
                <p className="sh-section-sub--light">
                  Suivez vos formations et gérez vos inscriptions
                </p>
              </div>
              <Link to="/formations" className="sh-btn sh-btn--white">
                Découvrir des formations
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-4" style={{ background: 'var(--brand-mid)' }}>
          <div className="container">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{enrollments.length}</div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Formations suivies</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {enrollments.filter(e => (e.progression || 0) === 100).length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Terminées</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{progressionMoyenne}%</div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Progression moyenne</div>
              </div>
            </div>
          </div>
        </section>

        {/* Liste formations */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title mb-4">Mes formations</h2>

            {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: 'var(--brand-main)' }} role="status" />
                  <p className="mt-3 small" style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && enrollments.length === 0 && (
                <div className="text-center py-5">
                  <p className="fs-5 fw-semibold" style={{ color: 'var(--brand-deep)' }}>
                    Vous ne suivez aucune formation
                  </p>
                  <p className="small mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Explorez le catalogue et inscrivez-vous à votre première formation.
                  </p>
                  <Link to="/formations" className="sh-btn sh-btn--primary">
                    Voir les formations
                  </Link>
                </div>
            )}

            {!loading && !error && enrollments.length > 0 && (
                <div className="row g-4">
                  {enrollments.map(e => {
                    const f = e.formation || e
                    return (
                        <div className="col-md-4" key={e.enrollment_id || f.id}>
                          <div className="sh-formation-card">
                            <div className="sh-formation-card-top">
                              <span className="sh-cat-tag">{f.categorie}</span>
                              <span className={`sh-badge ${niveauConfig[f.niveau]?.cls || 'sh-badge-green'}`}>{f.niveau}</span>
                            </div>
                            <h6 className="sh-formation-title">{f.titre}</h6>
                            <p className="sh-formation-desc">{f.description}</p>

                            {/* Progression */}
                            <div className="mb-2">
                              <div className="d-flex justify-content-between mb-1">
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progression</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: progressionColor(e.progression || 0) }}>
                                                        {e.progression || 0}%
                                                    </span>
                              </div>
                              <div style={{ height: 6, background: 'var(--brand-border)', borderRadius: 999 }}>
                                <div style={{
                                  height: '100%',
                                  width: `${e.progression || 0}%`,
                                  background: (e.progression || 0) >= 80 ? 'var(--green-text)' : (e.progression || 0) >= 40 ? '#f59e0b' : 'var(--brand-main)',
                                  borderRadius: 999,
                                  transition: 'width 0.3s ease',
                                }} />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex gap-2 mt-2">
                              <Link
                                  to={`/apprendre/${f.id}`}
                                  className="sh-btn sh-btn--primary flex-fill"
                                  style={{ fontSize: 12, padding: '7px 10px' }}
                              >
                                Suivre
                              </Link>
                              <button
                                  className="sh-btn flex-fill"
                                  style={{ fontSize: 12, padding: '7px 10px', background: 'var(--red-bg)', color: 'var(--red-text)', borderRadius: '999px' }}
                                  onClick={() => demanderDesinscription(f.id)}
                              >
                                Ne plus suivre
                              </button>
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </div>
        </section>

        {/* Modal confirmation */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la désinscription</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Êtes-vous sûr de vouloir vous désinscrire de cette formation ? Votre progression sera perdue.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={confirmerDesinscription}>
              Se désinscrire
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default DashboardApprenant