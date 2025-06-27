import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  FolderKanban,
  Users,
  UserCircle,
  Settings,
  LogOut,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/"
  },
  {
    title: "Projects",
    icon: FolderKanban,
    url: "/projects"
  },
  {
    title: "Teams",
    icon: Users,
    url: "/teams"
  },
  {
    title: "Users",
    icon: UserCircle,
    url: "/users"
  },
  {
    title: "Insight",
    icon: BarChart2,
    url: "/insights"
  },
];

const bottomMenuItems = [
  {
    title: "Settings",
    icon: Settings,
    url: "/settings"
  },
  {
    title: "Logout",
    icon: LogOut,
    action: "logout"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b z-50 px-4">
        <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                <div className="h-8 w-1 bg-purple-600 rounded-full opacity-70" />
                <div className="h-8 w-1 bg-green-600 rounded-full opacity-40" />
              </div>
              <h1 className="text-xl font-bold">TaskWave</h1>
            </div>
          </div>

          {/* Right items */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-yellow-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>3 Pending</span>
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-6 w-1 bg-blue-600 rounded-full" />
              <div className="h-6 w-1 bg-purple-600 rounded-full opacity-70" />
              <div className="h-6 w-1 bg-green-600 rounded-full opacity-40" />
            </div>
            <h2 className="text-lg font-semibold">TaskWave</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === item.url
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu>
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.action === "logout" ? (
                      <button
                        onClick={async () => {
                          try {
                            await logout();
                            navigate("/login");
                          } catch (error) {
                            console.error("Logout failed:", error);
                          }
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </button>
                    ) : (
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          location.pathname === item.url
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
