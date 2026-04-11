import { Modal, Button, Form } from 'react-bootstrap'
import { useState } from 'react'

function LoginModal({ show, onHide, onLogin, isLoading, setIsLoading }) {
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = (formData.get('email') || '').toString().trim().toLowerCase()
        const password = (formData.get('password') || '').toString()
        const role = (formData.get('role') || 'apprenant').toString()

        try {
            await onLogin({ email, password, role })
        } catch (submitError) {
            setError(submitError.message || 'Connexion impossible.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Se connecter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="email" placeholder="votre@email.com" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control name="password" type="password" placeholder="********" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rôle</Form.Label>
                        <Form.Select name="role" defaultValue="apprenant">
                            <option value="apprenant">Apprenant</option>
                            <option value="formateur">Formateur</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" className="w-100" type="submit" disabled={isLoading}>
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LoginModal