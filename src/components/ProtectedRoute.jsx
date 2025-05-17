import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    // Redirect to login if there's no token or user data
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the current route matches the user's role
  const isAuthorized = () => {
    const path = location.pathname;
    if (user.role === 'student' && path.startsWith('/Student/Dashboard')) {
      return true;
    }
    if (user.role === 'professor' && path.startsWith('/Teacher/Dashboard')) {
      return true;
    }
    if (user.role === 'admin' && path.startsWith('/admin')) {
      return true;
    }
    return false;
  };

  if (!isAuthorized()) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'student':
        return <Navigate to={`/Student/Dashboard/${user.id}/Search`} replace />;
      case 'professor':
        return <Navigate to={`/Teacher/Dashboard/${user.id}/Home`} replace />;
      case 'admin':
        return <Navigate to={`/admin/${user.id}`} replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 