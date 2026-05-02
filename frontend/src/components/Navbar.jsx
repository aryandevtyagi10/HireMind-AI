import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <nav className="navbar" style={transparent ? { background: 'transparent', backdropFilter: 'none', borderBottom: 'none' } : {}}>
      <div className="nav-logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
        <div className="nav-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
        </div>
        <span className="nav-logo-text">HireMind<span>.AI</span></span>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <div className="credits-pill"><div className="credits-dot"/>{user.credits ?? 0} credits</div>
            <div className="nav-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
            <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '50px' }} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => navigate('/register')}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  )
}
