import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="app-nav">
      <Link to="/" className="brand-logo">
        BlogMS
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" className="nav-link">Blog</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <span style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              {user?.name}{' '}
              <span
                style={{
                  color: 'var(--color-secondary-muted)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  marginLeft: '0.25rem',
                }}
              >
                [{user?.role}]
              </span>
            </span>
            <button type="button" onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link nav-link--cta">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
