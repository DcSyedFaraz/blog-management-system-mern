import { useState, useEffect } from 'react';
import usePosts from '../../hooks/usePosts';
import PostList from '../../components/posts/PostList';

const inputStyle = {
  padding: '0.55rem 0.9rem',
  background: 'var(--color-inset)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-pill)',
  color: 'var(--color-text)',
  width: '220px',
  fontSize: '0.95rem',
  outline: 'none',
};

export default function Blog() {
  const { posts, pagination, loading, fetchPosts } = usePosts();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts({ page, search: search || undefined, limit: 9 });
  }, [page, search, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--gradient-brand-text)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Blog
        </h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              background: 'var(--gradient-primary)',
              color: '#fff',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-glow-accent)',
            }}
          >
            Search
          </button>
        </form>
      </div>
      <PostList posts={posts} loading={loading} pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
