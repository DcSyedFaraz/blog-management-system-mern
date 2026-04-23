import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import usePosts from '../../hooks/usePosts';
import PostEditor from '../../components/posts/PostEditor';
import getApiError from '../../utils/apiError';

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
      setError(getApiError(err));
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create New Post</h1>
      {error && <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
      <PostEditor onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
