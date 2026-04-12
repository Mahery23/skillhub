import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

function RegisterModal({ show, onHide, onRegister, defaultRole = 'apprenant', isLoading, setIsLoading }) {
    const [role, setRole] = useState(defaultRole)
    const [error, setError] = useState('')

    useEffect(() => {
        if (show) {
            setRole(defaultRole)
        }
    }, [defaultRole, show])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const name = (formData.get('name') || 'Utilisateur').toString().trim()
        const email = (formData.get('email') || '').toString().trim().toLowerCase()
        const password = (formData.get('password') || '').toString()

        try {
            await onRegister({ name, email, password, role })
        } catch (submitError) {
            setError(submitError.message || 'Inscription impossible.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Créer un compte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Nom complet</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Jean Dupont" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="email" placeholder="votre@email.com" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control name="password" type="password" placeholder="********" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Je suis</Form.Label>
                        <Form.Select name="role" value={role} onChange={(event) => setRole(event.target.value)}>
                            <option value="apprenant">Apprenant</option>
                            <option value="formateur">Formateur</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" className="w-100" type="submit" disabled={isLoading}>
                        {isLoading ? 'Inscription...' : "S'inscrire"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterModal