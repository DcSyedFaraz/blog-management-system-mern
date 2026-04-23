import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import getApiError from '../../utils/apiError';

const alertStyle = {
  background: 'var(--color-alert-bg)',
  border: '1px solid var(--color-alert-border)',
  color: 'var(--color-accent)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  marginBottom: '1rem',
  fontSize: '0.9rem',
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ error: '', loading: false });

  const onSubmit = async (data) => {
    setState({ error: '', loading: true });
    try {
      await login(data);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setState({ error: getApiError(err), loading: false });
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto' }} className="auth-card-glow">
      <h1 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Sign In</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Welcome back to BlogMS</p>
      {state.error && <div style={alertStyle}>{state.error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
        <Button type="submit" disabled={state.loading} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
          {state.loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        No account? <Link to="/register" style={{ color: 'var(--color-link)', fontWeight: 600 }}>Register here</Link>
      </p>
    </div>
  );
}
