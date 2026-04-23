import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({ error: '', loading: false });

  const onSubmit = async (data) => {
    setState({ error: '', loading: true });
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      setState({ error: getApiError(err), loading: false });
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto' }} className="auth-card-glow">
      <h1 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Create Account</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Join BlogMS today</p>
      {state.error && <div style={alertStyle}>{state.error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
        <Button type="submit" disabled={state.loading} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
          {state.loading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-link)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}
