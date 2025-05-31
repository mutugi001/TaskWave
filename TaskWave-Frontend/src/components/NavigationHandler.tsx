import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavigationHandlerProps {
  children: React.ReactNode;
}

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/';

    if (!loading) {
      if (isAuthenticated) {
        navigate(lastVisitedPath, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, loading]);

  return <>{children}</>;
};

export default NavigationHandler;
