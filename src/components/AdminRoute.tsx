import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import useUserRoles from '@/hooks/useUserRoles';

interface AdminRouteProps {
  children?: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { isAdmin, isLoading, isFetching } = useUserRoles();

  const isBusy = loading || isLoading || isFetching;

  if (isBusy) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default AdminRoute;
