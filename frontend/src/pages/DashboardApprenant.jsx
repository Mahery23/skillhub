import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'

const FORMATIONS_INIT = [
  { id: 1, titre: "Introduction à React", niveau: "Débutant", categorie: "Développement web", description: "Apprenez les bases de React.js et construisez vos premières interfaces modernes.", progression: 60 },
  { id: 2, titre: "Laravel & API REST", niveau: "Intermédiaire", categorie: "Backend", description: "Construisez une API REST complète avec authentification JWT et bonnes pratiques.", progression: 30 },
  { id: 4, titre: "UI/UX Design Figma", niveau: "Débutant", categorie: "Design", description: "Créez des interfaces utilisateur modernes et intuitives avec Figma.", progression: 90 },
]

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

function DashboardApprenant({ user }) {
  const [formations, setFormations]             = useState(FORMATIONS_INIT)
  const [showConfirm, setShowConfirm]           = useState(false)
  const [idADesinscrire, setIdADesinscrire]     = useState(null)

  // Redirection si non connecté ou mauvais rôle
  if (!user) return <Navigate to="/" />
  if (user.role !== 'apprenant') return <Navigate to="/dashboard/formateur" />

  const demanderDesinscription = (id) => {
    setIdADesinscrire(id)
    setShowConfirm(true)
  }

  const confirmerDesinscription = () => {
    setFormations(prev => prev.filter(f => f.id !== idADesinscrire))
    setShowConfirm(false)
    setIdADesinscrire(null)
  }

  const progressionColor = (p) => {
    if (p >= 80) return 'var(--green-text)'
    if (p >= 40) return 'var(--amber-text)'
    return 'var(--red-text)'
  }

  return (
      <div>
        {/* En-tête */}
        <section className="sh-section--dark py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="sh-section-title--light mb-1">
                  Bonjour, {user.nom || user.email} 👋
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

        {/* Stats rapides */}
        <section className="py-4" style={{ background: 'var(--brand-mid)' }}>
          <div className="container">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {formations.length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Formations suivies
                </div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {formations.filter(f => f.progression === 100).length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Terminées
                </div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {formations.length > 0
                      ? Math.round(formations.reduce((acc, f) => acc + f.progression, 0) / formations.length)
                      : 0}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Progression moyenne
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des formations */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title mb-4">Mes formations</h2>

            {formations.length === 0 ? (
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
            ) : (
                <div className="row g-4">
                  {formations.map(f => (
                      <div className="col-md-4" key={f.id}>
                        <div className="sh-formation-card">
                          <div className="sh-formation-card-top">
                            <span className="sh-cat-tag">{f.categorie}</span>
                            <span className={`sh-badge ${niveauConfig[f.niveau].cls}`}>{f.niveau}</span>
                          </div>
                          <h6 className="sh-formation-title">{f.titre}</h6>
                          <p className="sh-formation-desc">{f.description}</p>

                          {/* Barre de progression */}
                          <div className="mb-2">
                            <div className="d-flex justify-content-between mb-1">
                              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progression</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: progressionColor(f.progression) }}>
                          {f.progression}%
                        </span>
                            </div>
                            <div style={{ height: 6, background: 'var(--brand-border)', borderRadius: 999 }}>
                              <div style={{
                                height: '100%',
                                width: `${f.progression}%`,
                                background: f.progression >= 80 ? 'var(--green-text)' : f.progression >= 40 ? '#f59e0b' : 'var(--brand-main)',
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
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* Modal confirmation désinscription */}
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