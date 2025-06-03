import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import ResetPassword from "./pages/ResetPassword";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProjectsProvider } from "./contexts/ProjectContext"; // <-- Import ProjectsProvider
import { TasksProvider } from '@/contexts/TaskContext'; // <-- 1. Import TasksProvider
import { TeamsProvider } from "@/contexts/TeamContext"; // Import TeamsProvider
import { MembersProvider } from "./contexts/MemberContext";
import { useEffect, useState } from "react"; // Import useState

const queryClient = new QueryClient();

const App = () => {
  // --- Auth state initialization/loading ---
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Efficiently check for auth state in localStorage/sessionStorage
    // Example: check for a token or user object
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    // Optionally, you can dispatch/init context here if needed
    // If your AuthProvider does this automatically, just wait a tick
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    // Show loading screen while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    // Assuming queryClient is defined
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              {/* 2. Wrap AppRoutes (or relevant part) with ProjectsProvider */}
              {/* Place it INSIDE AuthProvider */}
              <ProjectsProvider>
                <TasksProvider>
                  <TeamsProvider>
                    <MembersProvider>
                      <NavigationHandler>
                        <AppRoutes />
                      </NavigationHandler>
                    </MembersProvider>
                  </TeamsProvider>
                </TasksProvider>
              </ProjectsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth(); // useAuth was called outside AuthProvider
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastVisitedPath', location.pathname);
  }, [location]);

  if (!isAuthenticated) { // isAuthenticated was called outside AuthProvider
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route component - redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth(); // isAuthenticated was called outside AuthProvider

  if (isAuthenticated) { // isAuthenticated was called outside AuthProvider
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/';
    return <Navigate to={lastVisitedPath} replace />;
  }

  return <>{children}</>;
};

// App layout with sidebar for authenticated routes
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>

    <div className="flex flex-col min-h-screen w-full">
      <AppSidebar />
      <main className="pt-16 container mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8 py-4">
        {children}
      </main>
    </div>
  </SidebarProvider>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout><Index /></AppLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><AppLayout><Teams /></AppLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><AppLayout><Users /></AppLayout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><AppLayout><Insights /></AppLayout></ProtectedRoute>} />
      <Route path="/settings/*" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute>} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NavigationHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/';
    if (!isAuthenticated) {
      // Only redirect to /login if not already on a public path
      if (!publicPaths.includes(location.pathname)) {
        localStorage.setItem('lastVisitedPath', location.pathname);
        navigate('/login', { replace: true });
      }
    } else {
      if (publicPaths.includes(location.pathname)) {
        navigate(lastVisitedPath, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return <>{children}</>;
};
