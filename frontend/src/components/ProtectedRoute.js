import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--color-bg)'
      }}>
        <div className="loader" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />;

  return children;
}

export default ProtectedRoute;
