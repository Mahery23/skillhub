import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

function RegisterModal({ show, onHide, onRegister, defaultRole = 'apprenant' }) {
    const [role, setRole] = useState(defaultRole)

    useEffect(() => {
        if (show) {
            setRole(defaultRole)
        }
    }, [defaultRole, show])

    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const name = (formData.get('name') || 'Utilisateur').toString().trim()
        const email = (formData.get('email') || '').toString().trim().toLowerCase()

        onRegister({ name, email, role })
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Créer un compte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                    <Button variant="primary" className="w-100" type="submit">S'inscrire</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterModal