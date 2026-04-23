import Navbar from './Navbar';
import ErrorBoundary from '../common/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#16213e', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
