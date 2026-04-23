const variants = {
  primary: { background: '#e94560', color: '#fff', border: 'none' },
  secondary: { background: '#444', color: '#fff', border: 'none' },
  danger: { background: '#c0392b', color: '#fff', border: 'none' },
  ghost: { background: 'transparent', color: '#e94560', border: '1px solid #e94560' },
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
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontSize: '0.95rem',
        fontWeight: 500,
        transition: 'opacity 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
