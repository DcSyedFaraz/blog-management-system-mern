import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

export default function PostDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
  if (!post) return <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Post not found. <Link to="/" style={{ color: '#e94560' }}>Go back</Link></div>;

  const canEdit = user && (post.author?._id === user.id || user.role === 'admin');

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {post.tags?.map((tag) => (
            <span key={tag} style={{ background: '#2a2a3e', color: '#aaa', padding: '0.2rem 0.7rem', borderRadius: '12px', fontSize: '0.8rem' }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: '2rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontSize: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>By <strong style={{ color: '#aaa' }}>{post.author?.name}</strong></span>
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          <span style={{ ...{ background: post.status === 'published' ? '#1a3a2a' : '#3a2a00', color: post.status === 'published' ? '#4caf7d' : '#f0a500' }, padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>{post.status}</span>
          {canEdit && <Link to={`/posts/${id}/edit`} style={{ color: '#4fc3f7', textDecoration: 'none', marginLeft: 'auto' }}>✎ Edit</Link>}
        </div>
      </div>

      <div style={{ lineHeight: '1.8', color: '#ccc', fontSize: '1.05rem', whiteSpace: 'pre-wrap', marginBottom: '3rem', borderTop: '1px solid #2a2a3e', paddingTop: '1.5rem' }}>
        {post.content}
      </div>

      <section>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Comments ({comments.length})</h2>
        {isAuthenticated && (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              style={{ width: '100%', padding: '0.75rem', background: '#1a1a2e', border: '1px solid #444', borderRadius: '4px', color: '#fff', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem', fontSize: '0.95rem' }}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        )}
        {!isAuthenticated && <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}><Link to="/login" style={{ color: '#e94560' }}>Sign in</Link> to add a comment.</p>}
        {comments.map((c) => (
          <div key={c._id} style={{ background: '#1a1a2e', padding: '1rem 1.25rem', borderRadius: '6px', marginBottom: '0.75rem', borderLeft: '3px solid #2a2a3e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{c.author?.name}</strong>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <p style={{ color: '#ccc', margin: 0, fontSize: '0.95rem' }}>{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: '#666', fontSize: '0.9rem' }}>No comments yet.</p>}
      </section>
    </div>
  );
}
