import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
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
import {
    getStoredUser,
    getProfile,
    login as loginUser,
    logout as logoutUser,
    register as registerUser,
} from './services/authService'

function AppContent() {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => getStoredUser() || null)
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [preferredRole, setPreferredRole] = useState('apprenant')
    const [isLoading, setIsLoading] = useState(false)

    // Vérifier le token au démarrage
    useEffect(() => {
        const verifySession = async () => {
            const storedUser = getStoredUser()
            if (!storedUser) return
            try {
                const freshUser = await getProfile()
                if (freshUser) setUser(freshUser)
                else setUser(null)
            } catch {
                setUser(null)
            }
        }
        verifySession()
    }, [])

    const redirectAfterAuth = (loggedUser) => {
        if (loggedUser.role === 'formateur') {
            navigate('/dashboard/formateur')
        } else {
            navigate('/dashboard/apprenant')
        }
    }

    const handleLogin = async (credentials) => {
        const session = await loginUser(credentials)
        setUser(session.user)
        setShowLogin(false)
        redirectAfterAuth(session.user)
    }

    const handleRegister = async (payload) => {
        const session = await registerUser(payload)
        setUser(session.user)
        setShowRegister(false)
        redirectAfterAuth(session.user)
    }

    const handleLogout = () => {
        logoutUser()
        setUser(null)
        navigate('/')
    }

    const openRegister = (role = 'apprenant') => {
        setPreferredRole(role)
        setShowRegister(true)
    }

    return (
        <>
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

            <LoginModal
                show={showLogin}
                onHide={() => setShowLogin(false)}
                onLogin={handleLogin}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
            <RegisterModal
                show={showRegister}
                onHide={() => setShowRegister(false)}
                onRegister={handleRegister}
                defaultRole={preferredRole}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App