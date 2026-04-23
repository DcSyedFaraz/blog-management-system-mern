import Navbar from './Navbar';
import ErrorBoundary from '../common/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
