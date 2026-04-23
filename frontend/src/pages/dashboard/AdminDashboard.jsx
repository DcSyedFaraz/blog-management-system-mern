import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import usePosts from '../../hooks/usePosts';
import useApi from '../../hooks/useApi';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

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

  const statCard = (label, value, color = '#fff') => (
    <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '1.25rem', border: '1px solid #2a2a3e', flex: 1, minWidth: '140px' }}>
      <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ color, fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{value ?? '—'}</p>
    </div>
  );

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
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard/users"><Button style={{ background: '#2a2a3e', color: '#4fc3f7' }}>Manage Users</Button></Link>
          <Link to="/posts/new"><Button>+ New Post</Button></Link>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {statCard('Total Posts', stats.totalPosts)}
          {statCard('Published', stats.publishedPosts, '#4caf7d')}
          {statCard('Drafts', stats.draftPosts, '#f0a500')}
        </div>
      )}

      {stats?.topAuthors?.length > 0 && (
        <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid #2a2a3e' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Authors</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {stats.topAuthors.map((a, i) => (
              <div key={i} style={{ background: '#0f0f1a', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                <strong>{a.name}</strong>
                <span style={{ color: '#888', marginLeft: '0.5rem' }}>{a.postCount} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['all', 'All Posts'], ['my', 'My Posts']].map(([tab, label]) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
            style={{ background: activeTab === tab ? '#e94560' : '#2a2a3e', color: '#fff', border: 'none', padding: '0.4rem 1.1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ background: '#1a1a2e', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a3e', background: '#0f0f1a' }}>
                  {['Title', 'Author', 'Status', 'Created', 'Actions'].map((h) => (
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
                    <td style={{ padding: '0.85rem 1rem', color: '#aaa', fontSize: '0.85rem' }}>{post.author?.name}</td>
                    <td style={{ padding: '0.85rem 1rem' }}><span style={statusBadge(post.status)}>{post.status}</span></td>
                    <td style={{ padding: '0.85rem 1rem', color: '#888', fontSize: '0.85rem' }}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/posts/${post._id}/edit`} style={{ color: '#4fc3f7', fontSize: '0.85rem', textDecoration: 'none' }}>Edit</Link>
                        <button onClick={() => handleDelete(post._id)} style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No posts found.</p>}
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
