import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, FolderKanban, Users, UserCircle, Settings, LogOut, BarChart2, AlertCircle, ChevronDown, ArrowRight, PieChart, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    description: "Overview of all task activities"
  },
  {
    title: "Projects",
    icon: FolderKanban,
    url: "/projects",
    description: "Manage your project workflows"
  },
  {
    title: "Teams",
    icon: Users,
    url: "/teams",
    description: "Collaborate with team members"
  },
  {
    title: "Users",
    icon: UserCircle,
    url: "/users",
    description: "User management and roles"
  },
  {
    title: "Insights",
    icon: PieChart,
    url: "/insights",
    description: "Visual analytics and reports"
  },
  {
    title: "Chat",
    icon: MessageCircle,
    url: "/chat",
    description: "Communication hub"
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    ;
  };

  return (
    <>
      {/* Top Navbar with Animated Logo */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 px-4">
        <div className="flex items-center justify-between h-full w-full mx-auto max-w-screen-2xl">
          <div className="flex items-center space-x-6">
            {/* Animated Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="h-8 w-1 bg-blue-600 rounded-full animate-pulse" />
                <div className="h-8 w-1 bg-purple-600 rounded-full animate-pulse [animation-delay:200ms]" />
                <div className="h-8 w-1 bg-green-600 rounded-full animate-pulse [animation-delay:400ms]" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 animate-pulse">TaskWave</h1>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              {menuItems.map(item => (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={location.pathname === item.url ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all",
                        location.pathname === item.url && "shadow-md"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 animate-in fade-in-0 zoom-in-95">
                    <Link to={item.url}>
                      <DropdownMenuItem className="flex flex-col items-start py-3">
                        <div className="flex items-center gap-2 font-medium">
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>

          {/* Task Reporting Features */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-2" asChild>
              <Link to="/projects">
                <BarChart2 className="w-4 h-4" />
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-warning flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>3 Pending</span>
            </Button>
            <div className="h-8 w-px bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <UserCircle className="w-4 h-4" />
                    {user?.username || user?.email || "User Profile"}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {user?.email}
                  </span>
                </DropdownMenuItem>
                <Link to="/settings">
                  <DropdownMenuItem className="flex flex-col items-start py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <Settings className="w-4 h-4" />
                      Settings
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Configure your preferences
                    </span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="flex flex-col items-start py-3" onClick={handleLogout}>
                  <div className="flex items-center gap-2 font-medium">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    Sign out of your account
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Kept Compact */}
      <Sidebar className="md:hidden">
        <SidebarContent className="pt-16">
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors",
                        location.pathname === item.url
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
