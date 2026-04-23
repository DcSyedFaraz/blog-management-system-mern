import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// HOC: wraps a component and protects it with optional role check
const withAuth = (WrappedComponent, requiredRole = null) => {
  return function WithAuthWrapper(props) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (requiredRole && user?.role !== requiredRole) return <Navigate to="/unauthorized" replace />;
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
