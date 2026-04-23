import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import usePosts from '../../hooks/usePosts';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const surface = {
  background: 'var(--color-surface-solid)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-card)',
};

const tabBtn = (active) => ({
  background: active ? 'var(--gradient-primary)' : 'var(--color-surface-raised)',
  color: '#fff',
  border: active ? 'none' : '1px solid var(--color-border)',
  padding: '0.38rem 1rem',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  boxShadow: active ? 'var(--shadow-glow-accent)' : 'none',
});

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
    background: status === 'published' ? 'var(--color-success-bg)' : 'var(--color-warn-bg)',
    color: status === 'published' ? 'var(--color-success)' : 'var(--color-warn)',
    padding: '0.15rem 0.65rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>My Posts</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem', fontSize: '0.9rem' }}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/posts/new">
          <Button>+ New Post</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['', 'published', 'draft'].map((s) => (
          <button key={s || 'all'} type="button" onClick={() => { setStatusFilter(s); setPage(1); }} style={tabBtn(statusFilter === s)}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ ...surface, overflow: 'hidden', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-inset)' }}>
                  {['Title', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Link to={`/posts/${post._id}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>{post.title}</Link>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}><span style={statusBadge(post.status)}>{post.status}</span></td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link to={`/posts/${post._id}/edit`} style={{ color: 'var(--color-link)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Edit</Link>
                        <button type="button" onClick={() => handleToggleStatus(post)} style={{ background: 'none', border: 'none', color: 'var(--color-warn)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontWeight: 600 }}>
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button type="button" onClick={() => handleDelete(post._id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && (
            <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '2rem' }}>
              No posts yet. <Link to="/posts/new" style={{ color: 'var(--color-link)', fontWeight: 700 }}>Create your first post!</Link>
            </p>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
              <button type="button" disabled={!pagination.hasPrev} onClick={() => setPage((p) => p - 1)} style={{ ...tabBtn(false), opacity: pagination.hasPrev ? 1 : 0.45, cursor: pagination.hasPrev ? 'pointer' : 'not-allowed' }}>← Prev</button>
              <span style={{ color: 'var(--color-text-muted)', lineHeight: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>{pagination.currentPage}/{pagination.totalPages}</span>
              <button type="button" disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)} style={{ ...tabBtn(false), opacity: pagination.hasNext ? 1 : 0.45, cursor: pagination.hasNext ? 'pointer' : 'not-allowed' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
