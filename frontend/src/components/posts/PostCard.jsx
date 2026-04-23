import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PostCard({ post }) {
  return (
    <div
      style={{
        background: 'var(--color-surface-solid)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-glow)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card), 0 0 28px rgba(91, 93, 240, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {post.tags?.map((tag) => (
          <span
            key={tag}
            style={{
              background: 'var(--tag-gradient)',
              color: 'var(--color-primary-muted)',
              padding: '0.15rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid rgba(91, 93, 240, 0.35)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        <Link to={`/posts/${post._id}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
          {post.title}
        </Link>
      </h2>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          marginBottom: '1rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {post.content}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
        <span>By {post.author?.name}</span>
        <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
      </div>
    </div>
  );
}
