import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import usePosts from '../../hooks/usePosts';
import PostEditor from '../../components/posts/PostEditor';
import Spinner from '../../components/common/Spinner';
import getApiError from '../../utils/apiError';

export default function EditPost() {
  const { id } = useParams();
  const { updatePost } = usePosts();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get(`/posts/${id}`).then((r) => {
      setPost(r.data);
      setFetchLoading(false);
    }).catch(() => setFetchLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await updatePost(id, data);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(getApiError(err));
      setLoading(false);
    }
  };

  if (fetchLoading) return <Spinner />;
  if (!post) return <div style={{ color: '#888', textAlign: 'center', padding: '4rem' }}>Post not found.</div>;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Edit Post</h1>
      {error && <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
      <PostEditor initialData={post} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
