import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import getApiError from '../../utils/apiError';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(getApiError(err));
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Create Account</h1>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Join BlogMS today</p>
      {error && <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#e94560' }}>Sign in</Link>
      </p>
    </div>
  );
}
