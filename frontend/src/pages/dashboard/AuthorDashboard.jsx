import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import usePosts from '../../hooks/usePosts';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export default function AuthorDashboard() {
  const { user } = useAuth();
  const { posts, pagination, loading, fetchPosts, deletePost, updatePostStatus } = usePosts();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPosts({ page, status: statusFilter || undefined, limit: 10 }, '/posts/user/my');
  }, [page, statusFilter, fetchPosts]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await deletePost(id);
  };

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await updatePostStatus(post._id, newStatus);
  };

  const statusBadge = (status) => ({
    background: status === 'published' ? '#1a3a2a' : '#3a2a00',
    color: status === 'published' ? '#4caf7d' : '#f0a500',
    padding: '0.15rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>My Posts</h1>
          <p style={{ color: '#888', marginTop: '0.25rem', fontSize: '0.9rem' }}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/posts/new">
          <Button>+ New Post</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['', 'published', 'draft'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{ background: statusFilter === s ? '#e94560' : '#2a2a3e', color: '#fff', border: 'none', padding: '0.35rem 0.9rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ background: '#1a1a2e', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a3e', background: '#0f0f1a' }}>
                  {['Title', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid #2a2a3e' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Link to={`/posts/${post._id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>{post.title}</Link>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}><span style={statusBadge(post.status)}>{post.status}</span></td>
                    <td style={{ padding: '0.85rem 1rem', color: '#888', fontSize: '0.85rem' }}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link to={`/posts/${post._id}/edit`} style={{ color: '#4fc3f7', fontSize: '0.85rem', textDecoration: 'none' }}>Edit</Link>
                        <button onClick={() => handleToggleStatus(post)} style={{ background: 'none', border: 'none', color: '#f0a500', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDelete(post._id)} style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No posts yet. <Link to="/posts/new" style={{ color: '#e94560' }}>Create your first post!</Link></p>}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} style={{ background: '#2a2a3e', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: pagination.hasPrev ? 'pointer' : 'not-allowed' }}>← Prev</button>
              <span style={{ color: '#888', lineHeight: '2rem', fontSize: '0.9rem' }}>{pagination.currentPage}/{pagination.totalPages}</span>
              <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} style={{ background: '#2a2a3e', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: pagination.hasNext ? 'pointer' : 'not-allowed' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
