import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

export default function PostDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [postRes, commentsRes] = await Promise.all([
        axiosInstance.get(`/posts/${id}`),
        axiosInstance.get(`/posts/${id}/comments`),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await axiosInstance.post(`/posts/${id}/comments`, { content: commentText });
    setComments((prev) => [data, ...prev]);
    setCommentText('');
  };

  if (loading) return <Spinner />;
  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
        Post not found. <Link to="/" style={{ color: 'var(--color-link)', fontWeight: 600 }}>Go back</Link>
      </div>
    );
  }

  const canEdit = user && (post.author?._id === user.id || user.role === 'admin');

  const statusStyle = {
    background: post.status === 'published' ? 'var(--color-success-bg)' : 'var(--color-warn-bg)',
    color: post.status === 'published' ? 'var(--color-success)' : 'var(--color-warn)',
    padding: '0.12rem 0.55rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {post.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                background: 'var(--tag-gradient)',
                color: 'var(--color-primary-muted)',
                padding: '0.2rem 0.7rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid rgba(91, 93, 240, 0.35)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 style={{ fontSize: '2rem', lineHeight: 1.3, marginBottom: '0.75rem', fontWeight: 800 }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-dim)', fontSize: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>By <strong style={{ color: 'var(--color-text-muted)' }}>{post.author?.name}</strong></span>
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          <span style={statusStyle}>{post.status}</span>
          {canEdit && (
            <Link to={`/posts/${id}/edit`} style={{ color: 'var(--color-link)', textDecoration: 'none', marginLeft: 'auto', fontWeight: 600 }}>
              ✎ Edit
            </Link>
          )}
        </div>
      </div>

      <div
        style={{
          lineHeight: '1.8',
          color: 'var(--color-text-muted)',
          fontSize: '1.05rem',
          whiteSpace: 'pre-wrap',
          marginBottom: '3rem',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
        }}
      >
        {post.content}
      </div>

      <section>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Comments ({comments.length})</h2>
        {isAuthenticated && (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--color-inset)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text)',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        )}
        {!isAuthenticated && (
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--color-link)', fontWeight: 600 }}>Sign in</Link> to add a comment.
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c._id}
            style={{
              background: 'var(--color-surface-solid)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.75rem',
              border: '1px solid var(--color-border)',
              borderLeft: '3px solid var(--color-accent)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{c.author?.name}</strong>
              <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.95rem' }}>{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>No comments yet.</p>}
      </section>
    </div>
  );
}
