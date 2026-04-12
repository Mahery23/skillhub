import { Link, NavLink } from 'react-router-dom'

function Navbar({ user, onOpenLogin, onOpenRegister, onLogout }) {
    const profilePath = user?.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/apprenant'

    return (
        <nav className="navbar navbar-expand-lg sticky-top skillhub-navbar">
            <div className="container">
                <Link className="navbar-brand fw-semibold skillhub-brand" to="/">SkillHub</Link>
                <div className="d-flex gap-2 ms-auto align-items-center">
                    <NavLink
                        className={({ isActive }) => `nav-link skillhub-nav-link ${isActive ? 'active' : ''}`}
                        to="/formations"
                    >
                        Formations
                    </NavLink>

                    {user ? (
                        <>
                            <Link className="btn btn-sm skillhub-btn-secondary" to={profilePath}>
                                {user.name || 'Mon profil'}
                            </Link>
                            <button className="btn btn-sm skillhub-btn-ghost" onClick={onLogout}>
                                Se deconnecter
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-sm skillhub-btn-ghost" onClick={onOpenLogin}>Se connecter</button>
                            <button className="btn btn-sm skillhub-btn-primary" onClick={() => onOpenRegister('apprenant')}>S'inscrire</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar