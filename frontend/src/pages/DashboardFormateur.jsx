import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import {
  getFormationsFormateur,
  creerFormation,
  modifierFormation,
  supprimerFormation,
} from '../services/formationService'

const NIVEAUX    = ["Débutant", "Intermédiaire", "Avancé"]
const CATEGORIES = ["Développement web", "DevOps", "Design", "Data", "Marketing"]

const niveauConfig = {
  'Débutant':      { cls: 'sh-badge-green' },
  'Intermédiaire': { cls: 'sh-badge-amber' },
  'Avancé':        { cls: 'sh-badge-red'   },
}

const FORM_VIDE = { titre: '', niveau: 'Débutant', categorie: 'Développement web', description: '' }

function DashboardFormateur({ user }) {
  const [formations, setFormations]               = useState([])
  const [loading, setLoading]                     = useState(true)
  const [error, setError]                         = useState(null)
  const [showModal, setShowModal]                 = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [formData, setFormData]                   = useState(FORM_VIDE)
  const [formationEnCours, setFormationEnCours]   = useState(null)
  const [idASupprimer, setIdASupprimer]           = useState(null)
  const [saving, setSaving]                       = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'formateur') return

    const fetchFormations = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFormationsFormateur()
        const items = data.data || data || []
        // Filtrer seulement les formations du formateur connecté
        const mesFomations = items.filter(f =>
            f.formateur?.id === user.id || f.formateur_id === user.id
        )
        setFormations(mesFomations)
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }
    fetchFormations()
  }, [user])

  if (!user) return <Navigate to="/" />
  if (user.role !== 'formateur') return <Navigate to="/dashboard/apprenant" />

  const ouvrirCreation = () => {
    setFormationEnCours(null)
    setFormData(FORM_VIDE)
    setShowModal(true)
  }

  const ouvrirModification = (formation) => {
    setFormationEnCours(formation)
    setFormData({
      titre:       formation.titre,
      niveau:      formation.niveau,
      categorie:   formation.categorie,
      description: formation.description,
    })
    setShowModal(true)
  }

  const sauvegarder = async () => {
    if (!formData.titre.trim() || !formData.description.trim()) return
    setSaving(true)
    try {
      if (formationEnCours) {
        const data = await modifierFormation(formationEnCours.id, formData)
        const updated = data.formation || data
        setFormations(prev => prev.map(f => f.id === formationEnCours.id ? { ...f, ...updated } : f))
      } else {
        const data = await creerFormation(formData)
        const created = data.formation || data
        setFormations(prev => [...prev, created])
      }
      setShowModal(false)
      setFormData(FORM_VIDE)
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const demanderSuppression = (id) => {
    setIdASupprimer(id)
    setShowConfirmDelete(true)
  }

  const confirmerSuppression = async () => {
    try {
      await supprimerFormation(idASupprimer)
      setFormations(prev => prev.filter(f => f.id !== idASupprimer))
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.')
    } finally {
      setShowConfirmDelete(false)
      setIdASupprimer(null)
    }
  }

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
                  Gérez vos formations et suivez vos apprenants
                </p>
              </div>
              <button className="sh-btn sh-btn--white" onClick={ouvrirCreation}>
                + Créer une formation
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-4" style={{ background: 'var(--brand-mid)' }}>
          <div className="container">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{formations.length}</div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Formations</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {formations.reduce((acc, f) => acc + (f.apprenants || 0), 0)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Apprenants</div>
              </div>
              <div className="col-4">
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>
                  {formations.reduce((acc, f) => acc + (f.vues || 0), 0)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Vues totales</div>
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

            {!loading && error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && formations.length === 0 && (
                <div className="text-center py-5">
                  <p className="fs-5 fw-semibold" style={{ color: 'var(--brand-deep)' }}>
                    Vous n'avez pas encore de formation
                  </p>
                  <p className="small mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Créez votre première formation en cliquant sur le bouton ci-dessus.
                  </p>
                  <button className="sh-btn sh-btn--primary" onClick={ouvrirCreation}>
                    + Créer une formation
                  </button>
                </div>
            )}

            {!loading && !error && formations.length > 0 && (
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
                          <div className="sh-formation-meta">
                            <span>👥 {f.apprenants || 0} apprenants</span>
                            <span>👁 {f.vues || 0} vues</span>
                          </div>
                          <div className="d-flex gap-2 mt-2">
                            <Link
                                to={`/formation/${f.id}`}
                                className="sh-btn sh-btn--outline flex-fill"
                                style={{ fontSize: 12, padding: '7px 10px' }}
                            >
                              Voir
                            </Link>
                            <button
                                className="sh-btn sh-btn--outline flex-fill"
                                style={{ fontSize: 12, padding: '7px 10px' }}
                                onClick={() => ouvrirModification(f)}
                            >
                              Modifier
                            </button>
                            <button
                                className="sh-btn flex-fill"
                                style={{ fontSize: 12, padding: '7px 10px', background: 'var(--red-bg)', color: 'var(--red-text)', borderRadius: '999px' }}
                                onClick={() => demanderSuppression(f.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* Modal création / modification */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{formationEnCours ? 'Modifier la formation' : 'Créer une formation'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control type="text" placeholder="Titre de la formation" value={formData.titre} onChange={e => setFormData({ ...formData, titre: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Select value={formData.categorie} onChange={e => setFormData({ ...formData, categorie: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Niveau</Form.Label>
                <Form.Select value={formData.niveau} onChange={e => setFormData({ ...formData, niveau: e.target.value })}>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Description de la formation" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button variant="primary" onClick={sauvegarder} disabled={!formData.titre.trim() || !formData.description.trim() || saving}>
              {saving ? 'Enregistrement...' : formationEnCours ? 'Enregistrer' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal suppression */}
        <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirmDelete(false)}>Annuler</Button>
            <Button variant="danger" onClick={confirmerSuppression}>Supprimer</Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default DashboardFormateur