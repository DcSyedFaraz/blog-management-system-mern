import PostCard from './PostCard';
import Spinner from '../common/Spinner';

export default function PostList({ posts, loading, pagination, onPageChange }) {
  if (loading) return <Spinner />;
  if (!posts?.length) return <p style={{ color: '#666', textAlign: 'center', padding: '3rem' }}>No posts found.</p>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <button
            disabled={!pagination.hasPrev}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            style={{ background: '#2a2a3e', color: pagination.hasPrev ? '#fff' : '#555', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: pagination.hasPrev ? 'pointer' : 'not-allowed' }}
          >
            ← Prev
          </button>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNext}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            style={{ background: '#2a2a3e', color: pagination.hasNext ? '#fff' : '#555', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: pagination.hasNext ? 'pointer' : 'not-allowed' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
