import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Компонент-обёртка для ленивой загрузки
interface ProtectedPageProps {
  Component: React.ComponentType<any>;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ Component }) => {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
};
