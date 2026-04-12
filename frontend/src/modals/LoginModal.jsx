import { Modal, Button, Form } from 'react-bootstrap'

function LoginModal({ show, onHide, onLogin }) {
    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = (formData.get('email') || '').toString().trim().toLowerCase()
        const role = (formData.get('role') || 'apprenant').toString()
        const name = email ? email.split('@')[0] : 'Utilisateur'

        onLogin({ name, email, role })
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Se connecter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                    <Button variant="primary" className="w-100" type="submit">Se connecter</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LoginModal