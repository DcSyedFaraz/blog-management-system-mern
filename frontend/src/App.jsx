import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Blog from './pages/public/Blog';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PostDetail from './pages/posts/PostDetail';
import CreatePost from './pages/posts/CreatePost';
import EditPost from './pages/posts/EditPost';
import Unauthorized from './pages/Unauthorized';
import UsersManagement from './pages/dashboard/UsersManagement';

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/posts/new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/posts/:id/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/dashboard/users" element={<ProtectedRoute requiredRole="admin"><UsersManagement /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PostProvider>
    </AuthProvider>
  );
}
