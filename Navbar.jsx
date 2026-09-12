import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import StatusIndicator from './StatusIndicator.jsx'

const PUBLIC_LINKS = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/vocabulary', label: 'Vocabulary' },
]

const APP_LINKS = [
  { to: '/sign-to-text', label: 'Sign to Text' },
  { to: '/text-to-sign', label: 'Text to Sign' },
  { to: '/communication', label: 'Communication' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/vocabulary', label: 'Vocabulary' },
]

export default function Navbar() {
  const { isAuthenticated, session, apiStatus, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const links = isAuthenticated ? APP_LINKS : PUBLIC_LINKS

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className={`navbar-inner ${menuOpen ? 'menu-open' : ''}`}>
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12h6M14 12h6M10 12a2 2 0 104 0 2 2 0 00-4 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          SignBridge AI
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <StatusIndicator status={apiStatus} compact />
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm">
                {session?.user?.fullName || session?.user?.email || 'Profile'}
              </Link>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-icon nav-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
