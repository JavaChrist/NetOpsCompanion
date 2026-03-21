import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function AuthGuard() {
  const { user, initialized, hasAccess } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // /pricing est accessible même sans abonnement actif
  if (location.pathname === '/pricing') return <Outlet />;

  if (!hasAccess()) return <Navigate to="/pricing" replace />;

  return <Outlet />;
}
