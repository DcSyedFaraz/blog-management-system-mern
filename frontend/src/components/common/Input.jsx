import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.35rem', color: '#aaa', fontSize: '0.9rem' }}>{label}</label>}
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '0.65rem 0.75rem',
          background: '#1a1a2e',
          border: `1px solid ${error ? '#e94560' : '#444'}`,
          borderRadius: '4px',
          color: '#fff',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
          outline: 'none',
        }}
        {...props}
      />
      {error && <p style={{ color: '#e94560', margin: '0.25rem 0 0', fontSize: '0.82rem' }}>{error}</p>}
    </div>
  );
});

export default Input;
