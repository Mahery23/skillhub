import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

function LoginModal({ show, onHide, onLogin, isLoading, setIsLoading }) {
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = (formData.get('email') || '').toString().trim().toLowerCase()
        const password = (formData.get('password') || '').toString()

        try {
            await onLogin({ email, password })
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
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="email" placeholder="votre@email.com" required />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control name="password" type="password" placeholder="••••••••" required />
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