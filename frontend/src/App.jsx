import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Formations from './pages/Formations'
import FormationDetail from './pages/FormationDetail'
import DashboardFormateur from './pages/DashboardFormateur'
import DashboardApprenant from './pages/DashboardApprenant'
import SuiviFormation from './pages/SuiviFormation'
import LoginModal from './modals/LoginModal'
import RegisterModal from './modals/RegisterModal'

const STORAGE_KEY = 'skillhub_user'

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY)
        return savedUser ? JSON.parse(savedUser) : null
    })
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [preferredRole, setPreferredRole] = useState('apprenant')

    const handleLogin = (loggedUser) => {
        setUser(loggedUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
        setShowLogin(false)
    }

    const handleRegister = (registeredUser) => {
        setUser(registeredUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUser))
        setShowRegister(false)
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    const openRegister = (role = 'apprenant') => {
        setPreferredRole(role)
        setShowRegister(true)
    }

    return (
        <BrowserRouter>
            <Navbar
                user={user}
                onOpenLogin={() => setShowLogin(true)}
                onOpenRegister={openRegister}
                onLogout={handleLogout}
            />
            <Routes>
                <Route path="/" element={<Home user={user} onOpenLogin={() => setShowLogin(true)} onOpenRegister={openRegister} />} />
                <Route path="/formations" element={<Formations />} />
                <Route path="/formation/:id" element={<FormationDetail user={user} onOpenLogin={() => setShowLogin(true)} />} />
                <Route path="/dashboard/formateur" element={<DashboardFormateur user={user} />} />
                <Route path="/dashboard/apprenant" element={<DashboardApprenant user={user} />} />
                <Route path="/apprendre/:id" element={<SuiviFormation user={user} />} />
            </Routes>
            <Footer />

            <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onLogin={handleLogin} />
            <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} onRegister={handleRegister} defaultRole={preferredRole} />
        </BrowserRouter>
    )
}

export default App