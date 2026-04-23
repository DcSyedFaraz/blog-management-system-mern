import useAuth from '../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import AuthorDashboard from './AuthorDashboard';

// Routes to the right dashboard based on role
export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <AuthorDashboard />;
}
