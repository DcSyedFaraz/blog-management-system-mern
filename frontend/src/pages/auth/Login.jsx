import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import getApiError from '../../utils/apiError';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const message = getApiError(err);
      setLoading(false);
      setError(message);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Sign In</h1>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Welcome back to BlogMS</p>
      {error && <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
        No account? <Link to="/register" style={{ color: '#e94560' }}>Register here</Link>
      </p>
    </div>
  );
}
