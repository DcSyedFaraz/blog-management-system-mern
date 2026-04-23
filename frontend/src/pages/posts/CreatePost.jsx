import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import usePosts from '../../hooks/usePosts';
import PostEditor from '../../components/posts/PostEditor';

const alertStyle = {
  background: 'var(--color-alert-bg)',
  border: '1px solid var(--color-alert-border)',
  color: 'var(--color-accent)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
};

export default function CreatePost() {
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await createPost(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>Create New Post</h1>
      {error && <div style={alertStyle}>{error}</div>}
      <PostEditor onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
