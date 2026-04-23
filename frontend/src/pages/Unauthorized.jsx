import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h1
        style={{
          fontSize: '3.5rem',
          marginBottom: '1rem',
          fontWeight: 900,
          background: 'var(--gradient-brand-text)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        403
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>You don&apos;t have permission to access this page.</p>
      <Link to="/dashboard" style={{ color: 'var(--color-link)', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>← Back to Dashboard</Link>
    </div>
  );
}
