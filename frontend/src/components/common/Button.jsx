const variants = {
  primary: {
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-glow-accent)',
  },
  secondary: {
    background: 'var(--color-surface-raised)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    background: 'var(--gradient-danger)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary-muted)',
    border: '1px solid var(--color-primary-muted)',
  },
};

export default function Button({ children, variant = 'primary', disabled, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...variants[variant],
        padding: '0.5rem 1.25rem',
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'opacity 0.2s, filter 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
