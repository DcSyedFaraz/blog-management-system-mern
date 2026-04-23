import PostCard from './PostCard';
import Spinner from '../common/Spinner';

const btnBase = {
  border: 'none',
  padding: '0.45rem 1.1rem',
  borderRadius: 'var(--radius-pill)',
  fontSize: '0.88rem',
  fontWeight: 600,
  transition: 'filter 0.2s, opacity 0.2s',
};

export default function PostList({ posts, loading, pagination, onPageChange }) {
  if (loading) return <Spinner />;
  if (!posts?.length) {
    return <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '3rem' }}>No posts found.</p>;
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            disabled={!pagination.hasPrev}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            style={{
              ...btnBase,
              background: pagination.hasPrev ? 'var(--color-surface-raised)' : 'var(--color-inset)',
              color: pagination.hasPrev ? 'var(--color-text)' : 'var(--color-text-dim)',
              cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
              border: '1px solid var(--color-border)',
              opacity: pagination.hasPrev ? 1 : 0.55,
            }}
          >
            ← Prev
          </button>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={!pagination.hasNext}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            style={{
              ...btnBase,
              background: pagination.hasNext ? 'var(--color-surface-raised)' : 'var(--color-inset)',
              color: pagination.hasNext ? 'var(--color-text)' : 'var(--color-text-dim)',
              cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
              border: '1px solid var(--color-border)',
              opacity: pagination.hasNext ? 1 : 0.55,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
