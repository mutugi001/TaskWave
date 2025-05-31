import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const AccountManagement: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        setUserData({ name: user?.username || '', email: user?.email || '', password: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [user, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      alert("User data updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div>
      <h2>Account Management</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" name="email" value={userData.email} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AccountManagement;
