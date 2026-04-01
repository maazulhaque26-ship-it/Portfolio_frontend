// ============================================================
// frontend/src/components/ProtectedRoute.jsx
// ============================================================
// Route guard HOC. Redirects unauthenticated users to the
// login route. Used when you need nested admin routes.
// ============================================================

import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-olivia-gold border-t-olivia-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/authenticate-master" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;