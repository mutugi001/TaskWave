import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { authService, User } from '../services/authservice'; // Import User type

// Interface for the data/functions provided by the context
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  loading: boolean;
  login: (payload: Parameters<typeof authService.login>[0]) => Promise<boolean>; // Use Parameters<> for payload type
  register: (payload: Parameters<typeof authService.register>[0]) => Promise<boolean>;
  logout: () => Promise<void>; // Logout in context might not need to return boolean here
  checkAuthStatus: () => Promise<void>;
  isAuthenticated: boolean; // Add isAuthenticated property
}

// Interface for the AuthProvider component's props
interface AuthProviderProps {
  children: ReactNode; // Standard type for children prop
}

// Create context with initial value null, explicitly typed
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add isAuthenticated state

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const currentUser = await authService.getUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser); // Set isAuthenticated based on currentUser
    } catch (error) {
      console.error("Auth check failed in context:", error);
      setUser(null);
      setIsAuthenticated(false); // Set isAuthenticated to false on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (payload: Parameters<typeof authService.login>[0]): Promise<boolean> => {
    setLoading(true);
    const success = await authService.login(payload);
    if (success) {
      await checkAuthStatus(); // Re-fetch user data
    } else {
       setUser(null); // Ensure user is cleared on failure
       setLoading(false);
    }
    // setLoading(false) is handled by checkAuthStatus on success
    return success;
  };

  const register = async (payload: Parameters<typeof authService.register>[0]): Promise<boolean> => {
    setLoading(true);
    const success = await authService.register(payload);
    // Optional: auto-login after register
    if (success) { await login({ email: payload.email, password: payload.password }); }
    setLoading(false); // Set loading false here as we don't call checkAuthStatus
    return success;
  };


  const logout = async (): Promise<void> => {
    setLoading(true);
    await authService.logout(); // Call the service logout
    setUser(null); // Clear user state immediately
    setIsAuthenticated(false); // Set isAuthenticated to false on logout
    setLoading(false);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    user,
    setUser,
    isLoggedIn: !!user,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated // Add isAuthenticated to context value
  }), [user, loading, checkAuthStatus, isAuthenticated]); // Add dependencies used in value creation

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context, with type safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
