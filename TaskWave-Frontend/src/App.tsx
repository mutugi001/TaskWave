import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Teams from "./pages/Teams";
import Docs from "./pages/Docs";
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
import { ProjectsProvider } from "./contexts/ProjectContext";
import { TasksProvider } from "@/contexts/TaskContext";
import { TeamsProvider } from "@/contexts/TeamContext";
import { MembersProvider } from "./contexts/MemberContext";
import { PaymentProvider } from "./contexts/PaymentContext";

const queryClient = new QueryClient();

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ProjectsProvider>
                <TasksProvider>
                  <TeamsProvider>
                    <MembersProvider>
                      <PaymentProvider>
                        <NavigationHandler>
                          <AppRoutes />
                        </NavigationHandler>
                      </PaymentProvider>
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

// --- Protected Routes ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastVisitedPath', location.pathname);
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// --- Public Routes ---
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/';
    return <Navigate to={lastVisitedPath} replace />;
  }

  return <>{children}</>;
};

// --- App Layout with Sidebar ---
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full overflow-x-auto">
      <AppSidebar />
      <main className="flex-1 pt-16 container mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8 py-4">
        {children}
      </main>
    </div>
  </SidebarProvider>
);

// --- All Routes ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/Docs" element={<PublicRoute><Docs /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      {/* Protected routes (with sidebar) */}
      <Route path="/" element={<ProtectedRoute><AppLayout><Index /></AppLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><AppLayout><Teams /></AppLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><AppLayout><Users /></AppLayout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><AppLayout><Insights /></AppLayout></ProtectedRoute>} />
      <Route path="/settings/*" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute>} />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// --- Auth-aware Navigation Handler ---
const NavigationHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = ['/login', '/Docs', '/signup', '/forgot-password', '/reset-password'];
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/';

    if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
      localStorage.setItem('lastVisitedPath', location.pathname);
      navigate('/login', { replace: true });
    } else if (isAuthenticated && publicPaths.includes(location.pathname)) {
      navigate(lastVisitedPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return <>{children}</>;
};
