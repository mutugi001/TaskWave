import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import AccountManagement from "./settings/AccountManagement";
import WhatsappManagement from "./settings/WhatsappManagement";
import Payments from "./settings/Payments"; // Import Payments component
import { useTheme } from "@/components/ThemeProvider";
import { WhatsappProvider } from "@/contexts/WhatsappContext"; // Adjust path as needed
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Menu } from 'lucide-react'; // Import the Menu icon

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch settings data or perform other authenticated actions here
    }
  }, [isAuthenticated]);

  const sidebarStyle = {
    width: isSidebarOpen ? "250px" : "0",
    backgroundColor: theme === "dark" ? "#1E1E1E" : "#f4f4f4",
    padding: "20px",
    borderRight: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
    overflowX: 'hidden' as const, // Hide content when sidebar is closed
    transition: "width 0.3s ease", // Add transition for smooth animation
    height: "100%", // Make sidebar full height
    position: "fixed" as const, // Fix the sidebar to the side
    top: "60px", // Adjust top position to start below the navbar
    left: 0, // Align to the left
    zIndex: 10, // Ensure it's above other content
  };

  const mainContentStyle = {
    flex: 1,
    padding: "20px",
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    marginLeft: isSidebarOpen ? "250px" : "0", // Adjust margin based on sidebar state
    transition: "margin-left 0.3s ease", // Add transition for smooth animation
    minHeight: "100vh", // Ensure main content takes at least full viewport height
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "block",
    padding: "10px",
    marginBottom: "8px",
    textDecoration: "none",
    color: isActive ? "blue" : theme === "dark" ? "#f0f0f0" : "black",
    borderRadius: "5px",
    backgroundColor: isActive ? (theme === "dark" ? "#333" : "#ddd") : "transparent",
    transition: "background-color 0.3s ease",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2>Settings</h2>
        <nav>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <NavLink style={navLinkStyle} to="account-management">
                Account Management
              </NavLink>
            </li>
            <li>
              <NavLink style={navLinkStyle} to="whatsapp-management">
                Whatsapp Management
              </NavLink>
            </li>
            <li>
              <NavLink style={navLinkStyle} to="payments">
                Payments
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <button onClick={toggleSidebar}>
          <Menu /> {/* Use the Menu icon */}
        </button>
        <WhatsappProvider>
          <Routes>
            <Route path="account-management" element={<AccountManagement />} />
            <Route path="whatsapp-management" element={<WhatsappManagement />} />
            <Route path="payments" element={<Payments />} />
            <Route path="*" element={<AccountManagement />} />
          </Routes>
        </WhatsappProvider>
      </div>
    </div>
  );
};

export default Settings;
