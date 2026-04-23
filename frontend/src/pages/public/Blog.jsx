import { useState, useEffect } from 'react';
import usePosts from '../../hooks/usePosts';
import PostList from '../../components/posts/PostList';

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
        <h1 style={{ margin: 0 }}>Blog</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={{ padding: '0.5rem 0.75rem', background: '#1a1a2e', border: '1px solid #444', borderRadius: '4px', color: '#fff', width: '220px' }}
          />
          <button type="submit" style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>
      <PostList posts={posts} loading={loading} pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
