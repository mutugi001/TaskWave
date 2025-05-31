import React, { useEffect } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import AccountManagement from "./settings/AccountManagement";
import WhatsappManagement from "./settings/WhatsappManagement";
import { useTheme } from "@/components/ThemeProvider";
import { WhatsappProvider } from "@/contexts/WhatsappContext"; // Adjust path as needed
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch settings data or perform other authenticated actions here
    }
  }, [isAuthenticated]);

  const sidebarStyle = {
    width: "250px",
    backgroundColor: theme === "dark" ? "#1E1E1E" : "#f4f4f4",
    padding: "20px",
    borderRight: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#fff" : "#000" }}>
        <WhatsappProvider>
          <Routes>
            <Route path="account-management" element={<AccountManagement />} />
            <Route path="whatsapp-management" element={<WhatsappManagement />} />
            <Route path="*" element={<AccountManagement />} />
          </Routes>
        </WhatsappProvider>
      </div>
    </div>
  );
};

export default Settings;
