import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkStyle = { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' };

  return (
    <nav style={{ padding: '1rem 2rem', background: '#0f0f1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a3e' }}>
      <Link to="/" style={{ color: '#e94560', fontWeight: 700, fontSize: '1.4rem', textDecoration: 'none' }}>
        BlogMS
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Blog</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {user?.name} <span style={{ color: '#e94560', fontSize: '0.75rem', textTransform: 'uppercase' }}>[{user?.role}]</span>
            </span>
            <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e94560', color: '#e94560', padding: '0.3rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ ...linkStyle, background: '#e94560', color: '#fff', padding: '0.35rem 1rem', borderRadius: '4px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
