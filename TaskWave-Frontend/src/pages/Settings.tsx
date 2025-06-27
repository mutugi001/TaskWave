import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import AccountManagement from "./settings/AccountManagement";
import WhatsappManagement from "./settings/WhatsappManagement";
import Payments from "./settings/Payments";
import { useTheme } from "@/components/ThemeProvider";
import { WhatsappProvider } from "@/contexts/WhatsappContext";

const Settings: React.FC = () => {
  const { theme } = useTheme();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : theme === "dark"
        ? "text-white hover:bg-gray-700"
        : "text-black hover:bg-gray-200"
    }`;

  return (
    <div className="space-y-6">
      {/* Internal Settings Navigation */}
      <div className="flex gap-2 border-b pb-2">
        <NavLink to="account-management" className={linkClasses}>
          Account Management
        </NavLink>
        <NavLink to="whatsapp-management" className={linkClasses}>
          Whatsapp Management
        </NavLink>
        <NavLink to="payments" className={linkClasses}>
          Payments
        </NavLink>
      </div>

      {/* Render selected section */}
      <div>
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
