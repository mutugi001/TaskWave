import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
        navigate('/login', { replace: true });
      } else if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password')) {
        navigate('/', { replace: true });
      }
      setAuthChecked(true);
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading || !authChecked) {
    return <div>Loading...</div>; // Or a spinner
  }

  return <>{children}</>;
};

export default AuthCheck;
