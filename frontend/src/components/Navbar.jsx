import { Link, NavLink } from 'react-router-dom'

function Navbar({ user, onOpenLogin, onOpenRegister, onLogout }) {
    const profilePath = user?.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/apprenant'
    const profileLabel = user?.role === 'formateur' ? 'Dashboard formateur' : 'Mon dashboard'

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
                            <span className="skillhub-nav-link text-white small" style={{ fontSize: 13 }}>
                                Bonjour, {user.name}
                            </span>
                            <Link className="btn btn-sm skillhub-btn-secondary" to={profilePath}>
                                {profileLabel}
                            </Link>
                            <button className="btn btn-sm skillhub-btn-ghost" onClick={onLogout}>
                                Se déconnecter
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