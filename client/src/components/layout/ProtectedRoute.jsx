import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white p-10">Loading...</div>;

  // If no user is logged in, kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires admin, but the user is not an admin, kick them to home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If they pass the checks, render the page
  return <Outlet />;
}