import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '0.65rem 0.75rem',
          background: 'var(--color-inset)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-text)',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        {...props}
      />
      {error && <p style={{ color: 'var(--color-danger)', margin: '0.25rem 0 0', fontSize: '0.82rem' }}>{error}</p>}
    </div>
  );
});

export default Input;
