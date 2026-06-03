import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8c00bd] border-t-transparent"></div>
          <p className="text-lg font-semibold text-[#5f5071]">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save path for post-login redirect
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(`[ProtectedRoute] Access blocked for role: ${user.role}. Allowed: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return children;
}
