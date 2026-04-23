import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h1 style={{ color: '#e94560', fontSize: '3rem', marginBottom: '1rem' }}>403</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>You don't have permission to access this page.</p>
      <Link to="/dashboard" style={{ color: '#e94560', textDecoration: 'none' }}>← Back to Dashboard</Link>
    </div>
  );
}
