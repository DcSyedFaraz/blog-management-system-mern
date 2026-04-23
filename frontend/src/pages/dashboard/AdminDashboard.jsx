import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import usePosts from '../../hooks/usePosts';
import useApi from '../../hooks/useApi';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

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
  padding: '0.4rem 1.15rem',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  boxShadow: active ? 'var(--shadow-glow-accent)' : 'none',
});

export default function AdminDashboard() {
  const { posts, pagination, loading, fetchPosts, deletePost } = usePosts();
  const { request } = useApi();
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const endpoint = activeTab === 'all' ? '/posts/admin/all' : '/posts/user/my';
    fetchPosts({ page, limit: 10 }, endpoint);
  }, [page, activeTab, fetchPosts]);

  useEffect(() => {
    request('get', '/stats/posts').then(setStats).catch(() => {});
  }, [request]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await deletePost(id);
  };

  const statCard = (label, value, color = 'var(--color-text)') => (
    <div style={{ ...surface, padding: '1.25rem', flex: 1, minWidth: '140px' }}>
      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
      <p style={{ color, fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>{value ?? '—'}</p>
    </div>
  );

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
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard/users">
            <Button variant="secondary" style={{ color: 'var(--color-link)', borderColor: 'var(--color-link)' }}>Manage Users</Button>
          </Link>
          <Link to="/posts/new"><Button>+ New Post</Button></Link>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {statCard('Total Posts', stats.totalPosts)}
          {statCard('Published', stats.publishedPosts, 'var(--color-success)')}
          {statCard('Drafts', stats.draftPosts, 'var(--color-warn)')}
        </div>
      )}

      {stats?.topAuthors?.length > 0 && (
        <div style={{ ...surface, padding: '1.25rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Top Authors</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {stats.topAuthors.map((a, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-inset)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <strong>{a.name}</strong>
                <span style={{ color: 'var(--color-text-dim)', marginLeft: '0.5rem' }}>{a.postCount} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['all', 'All Posts'], ['my', 'My Posts']].map(([tab, label]) => (
          <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); }} style={tabBtn(activeTab === tab)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ ...surface, overflow: 'hidden', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-inset)' }}>
                  {['Title', 'Author', 'Status', 'Created', 'Actions'].map((h) => (
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
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{post.author?.name}</td>
                    <td style={{ padding: '0.85rem 1rem' }}><span style={statusBadge(post.status)}>{post.status}</span></td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/posts/${post._id}/edit`} style={{ color: 'var(--color-link)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Edit</Link>
                        <button type="button" onClick={() => handleDelete(post._id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '2rem' }}>No posts found.</p>}
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
