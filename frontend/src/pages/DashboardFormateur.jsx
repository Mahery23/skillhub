import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import { createFormation, deleteFormation, updateFormation, getMyFormations } from '../services/formationService'

const NIVEAUX    = ['Débutant', 'Intermédiaire', 'Avancé']
const CATEGORIES = ['Développement web', 'DevOps', 'Design', 'Data', 'Marketing']

const niveauConfig = {
  debutant:      { cls: 'sh-badge-green',  label: 'Débutant' },
  intermediaire: { cls: 'sh-badge-amber',  label: 'Intermédiaire' },
  avance:        { cls: 'sh-badge-red',    label: 'Avancé' },
}

const FORM_VIDE = { titre: '', niveau: 'Débutant', categorie: 'Développement web', description: '' }

const normalizeNiveau = (niveau = '') =>
  niveau.toLowerCase().normalize('NFD').replaceAll(/\p{Diacritic}/gu, '')

const normalizeFormation = (f = {}) => ({
  id:          f.id ?? null,
  titre:       f.titre || '',
  niveau:      f.niveau || 'Débutant',
  categorie:   f.categorie || '',
  description: f.description || '',
  apprenants:  f.apprenants ?? 0,
  vues:        f.vues ?? 0,
})

function DashboardFormateur({ user }) {
  const [formations, setFormations]             = useState([])
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState('')
  const [actionError, setActionError]           = useState('')
  const [isSaving, setIsSaving]                 = useState(false)
  const [showModal, setShowModal]               = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [formData, setFormData]                 = useState(FORM_VIDE)
  const [formationEnCours, setFormationEnCours] = useState(null)
  const [formationASupprimer, setFormationASupprimer] = useState(null)

  useEffect(() => {
    if (user?.role !== 'formateur') return

    let active = true

    const loadFormations = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyFormations()
        const mesFomations = data.filter(f => f.formateur?.id === user.id || f.formateur_id === user.id)
        if (active) setFormations(mesFomations.map(normalizeFormation))
      } catch (err) {
        if (active) setError(err.message || 'Impossible de charger vos formations.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadFormations()
    return () => { active = false }
  }, [user])

  if (!user) return <Navigate to="/" />
  if (user.role !== 'formateur') return <Navigate to="/dashboard/apprenant" />

  const refreshFormations = async () => {
    const data = await getMyFormations()
    const mesFomations = data.filter(f => f.formateur?.id === user.id || f.formateur_id === user.id)
    setFormations(mesFomations.map(normalizeFormation))
  }

  const ouvrirCreation = () => {
    setFormationEnCours(null)
    setFormData(FORM_VIDE)
    setActionError('')
    setShowModal(true)
  }

  const ouvrirModification = (formation) => {
    setFormationEnCours(formation)
    setFormData({ titre: formation.titre, niveau: formation.niveau, categorie: formation.categorie, description: formation.description })
    setActionError('')
    setShowModal(true)
  }

  const sauvegarder = async () => {
    if (!formData.titre.trim() || !formData.description.trim()) return

    try {
      setIsSaving(true)
      setActionError('')
      if (formationEnCours) {
        await updateFormation(formationEnCours.id, formData)
      } else {
        await createFormation(formData)
      }
      await refreshFormations()
      setShowModal(false)
      setFormationEnCours(null)
      setFormData(FORM_VIDE)
    } catch (err) {
      setActionError(err.message || 'Impossible d\'enregistrer la formation.')
    } finally {
      setIsSaving(false)
    }
  }

  const demanderSuppression = (formation) => {
    setFormationASupprimer(formation)
    setActionError('')
    setShowConfirmDelete(true)
  }

  const confirmerSuppression = async () => {
    if (!formationASupprimer?.id) return

    try {
      setIsSaving(true)
      setActionError('')
      await deleteFormation(formationASupprimer.id)
      await refreshFormations()
      setShowConfirmDelete(false)
      setFormationASupprimer(null)
    } catch (err) {
      setActionError(err.message || 'Impossible de supprimer la formation.')
    } finally {
      setIsSaving(false)
    }
  }

  const stats = {
    formations: formations.length,
    apprenants: formations.reduce((acc, f) => acc + (f.apprenants ?? 0), 0),
    vues:       formations.reduce((acc, f) => acc + (f.vues ?? 0), 0),
  }

  const saveButtonLabel = isSaving ? 'Enregistrement...' : formationEnCours ? 'Enregistrer' : 'Créer'

  let content

  if (loading) {
    content = <div className="text-center py-5">Chargement de vos formations...</div>
  } else if (error) {
    content = <div className="alert alert-warning">{error}</div>
  } else if (formations.length === 0) {
    content = (
      <div className="text-center py-5">
        <p className="fs-5 fw-semibold" style={{ color: 'var(--brand-deep)' }}>Vous n'avez pas encore de formation</p>
        <p className="small mt-2 mb-4" style={{ color: 'var(--text-secondary)' }}>Créez votre première formation.</p>
        <button className="sh-btn sh-btn--primary" onClick={ouvrirCreation}>+ Créer une formation</button>
      </div>
    )
  } else {
    content = (
      <div className="row g-4">
        {formations.map((formation) => {
          const niveauKey = normalizeNiveau(formation.niveau)
          return (
            <div className="col-md-4" key={formation.id}>
              <div className="sh-formation-card">
                <div className="sh-formation-card-top">
                  <span className="sh-cat-tag">{formation.categorie}</span>
                  <span className={`sh-badge ${niveauConfig[niveauKey]?.cls || 'sh-badge-green'}`}>
                    {niveauConfig[niveauKey]?.label || formation.niveau}
                  </span>
                </div>
                <h6 className="sh-formation-title">{formation.titre}</h6>
                <p className="sh-formation-desc">{formation.description}</p>
                <div className="sh-formation-meta">
                  <span>👥 {formation.apprenants} apprenants</span>
                  <span>👁 {formation.vues} vues</span>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Link to={`/formation/${formation.id}`} className="sh-btn sh-btn--outline flex-fill" style={{ fontSize: 12, padding: '7px 10px' }}>Voir</Link>
                  <button className="sh-btn sh-btn--outline flex-fill" style={{ fontSize: 12, padding: '7px 10px' }} onClick={() => ouvrirModification(formation)}>Modifier</button>
                  <button className="sh-btn flex-fill" style={{ fontSize: 12, padding: '7px 10px', background: 'var(--red-bg)', color: 'var(--red-text)', borderRadius: '999px' }} onClick={() => demanderSuppression(formation)}>Supprimer</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <section className="sh-section--dark py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="sh-section-title--light mb-1">Bonjour, {user.nom || user.email} 👋</h1>
              <p className="sh-section-sub--light">Gérez vos formations et suivez vos apprenants</p>
            </div>
            <button className="sh-btn sh-btn--white" onClick={ouvrirCreation}>+ Créer une formation</button>
          </div>
        </div>
      </section>

      <section className="py-4" style={{ background: 'var(--brand-mid)' }}>
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-4">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{stats.formations}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Formations</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{stats.apprenants}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Apprenants</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{stats.vues}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-soft)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Vues totales</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sh-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h2 className="sh-section-title mb-0">Mes formations</h2>
            <button className="sh-btn sh-btn--primary" onClick={ouvrirCreation}>+ Créer une formation</button>
          </div>
          {actionError && <div className="alert alert-danger">{actionError}</div>}
          {content}
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formationEnCours ? 'Modifier la formation' : 'Créer une formation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <label htmlFor="formation-titre" className="form-label">Titre</label>
              <Form.Control id="formation-titre" type="text" placeholder="Titre" value={formData.titre} onChange={e => setFormData({ ...formData, titre: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <label htmlFor="formation-categorie" className="form-label">Catégorie</label>
              <Form.Select id="formation-categorie" value={formData.categorie} onChange={e => setFormData({ ...formData, categorie: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <label htmlFor="formation-niveau" className="form-label">Niveau</label>
              <Form.Select id="formation-niveau" value={formData.niveau} onChange={e => setFormData({ ...formData, niveau: e.target.value })}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <label htmlFor="formation-description" className="form-label">Description</label>
              <Form.Control id="formation-description" as="textarea" rows={3} placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} disabled={isSaving}>Annuler</Button>
          <Button variant="primary" onClick={sauvegarder} disabled={isSaving || !formData.titre.trim() || !formData.description.trim()}>{saveButtonLabel}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.</p>
          {formationASupprimer && <p className="mb-0 small text-muted">Formation : <strong>{formationASupprimer.titre}</strong></p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirmDelete(false)} disabled={isSaving}>Annuler</Button>
          <Button variant="danger" onClick={confirmerSuppression} disabled={isSaving}>{isSaving ? 'Suppression...' : 'Supprimer'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DashboardFormateur