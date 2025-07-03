import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, UserCog, Mail, Phone, Trash2, Filter, SortAsc } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useMembers } from "@/contexts/MemberContext";
import { useTeams } from "@/contexts/TeamContext"; // Import team service
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

export default function Users() {
  const { members, fetchAllMembers, addMember, deleteMember, updateMember, loading, error } = useMembers();
  const { teams, fetchTeams, addTeam, deleteTeam } = useTeams();
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterByRole, setFilterByRole] = useState<'Team Lead' | 'Member' | 'all'>('all');
  const countryCodes = [
    { code: "+1", label: "USA/Canada (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+254", label: "Kenya (+254)" },
    { code: "+91", label: "India (+91)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+27", label: "South Africa (+27)" },
    { code: "+81", label: "Japan (+81)" },
    { code: "+49", label: "Germany (+49)" },
    { code: "+234", label: "Nigeria (+234)" },
    { code: "+86", label: "China (+86)" },
    // ...add more as needed
  ];
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    phone: string;
    country_code: string;
    profile_picture?: File;
    role: "Team Lead" | "Member";
    team_ids: string[];
  }>({
    name: "",
    email: "",
    phone: "",
    country_code: "+254",
    role: "Member",
    team_ids: [],
  });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: number;
    name: string;
    email: string;
    phone: string;
    country_code?: string;
    profile_picture?: File;
    role: "Team Lead" | "Member";
    teams: [];
    team_ids?: string[];
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMembers();
      fetchTeams(); // Fetch available teams
    }
  }, [fetchAllMembers, fetchTeams, isAuthenticated]);


  const filteredAndSortedUsers = useMemo(() => {
    let filtered = Object.values(members);

    if (filterByRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterByRole);
    }

    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [members, filterByRole, sortOrder]);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone || newUser.team_ids.length === 0) {
      toast.error("Please fill in all required fields and select at least one team");
      return;
    }
    // Combine country code and phone for backend
    const userToSend = {
      ...newUser,
      phone: `${newUser.country_code}${newUser.phone.replace(/^0+/, "")}`,
    };
    try {
      await addMember(userToSend);
      setIsAddingUser(false);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        country_code: "+254",
        profile_picture: undefined,
        role: "Member",
        team_ids: [],
      });
      toast.success("User added successfully!");
    } catch {
      toast.error("Failed to add user");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteMember(userId);
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewUser((prev) => ({
          ...prev,
          profile_picture: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditUser = (userId: number) => {
    const user = members[userId];
    if (user) {
      // Try to extract country code from phone
      let code = "+254";
      let phone = user.phone || "";
      for (const c of countryCodes) {
        if (phone.startsWith(c.code)) {
          code = c.code;
          phone = phone.replace(c.code, "");
          break;
        }
      }
      setEditingUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: phone,
        country_code: code,
        profile_picture: undefined,
        role: user.role,
        teams: user.teams,
        team_ids: user.team_ids || [],
      });
      setIsEditingUser(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.name || !editingUser.email || !editingUser.phone || (editingUser.team_ids && editingUser.team_ids.length === 0)) {
      toast.error("Please fill in all required fields and select at least one team");
      return;
    }
    // Combine country code and phone for backend
    const userToSend = {
      ...editingUser,
      phone: `${editingUser.country_code || "+254"}${editingUser.phone.replace(/^0+/, "")}`,
    };
    try {
      await updateMember(editingUser.id, userToSend);
      setIsEditingUser(false);
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="p-6 relative">
      <AnimatePresence>
        {/* ...existing code for reward popup... */}
      </AnimatePresence>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-gray-500 mt-2">Manage user profiles and roles</p>
          </div>
          <Sheet open={isAddingUser} onOpenChange={setIsAddingUser}>
            <SheetTrigger asChild>
              <Button className="sm:w-auto w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New User</SheetTitle>
                <SheetDescription>
                  Create a new user by filling in their details
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newUser.country_code}
                      onValueChange={(value) => setNewUser({ ...newUser, country_code: value })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teams">Teams</Label>
                  <div className="space-y-2">
                    {Object.values(teams).map((team) => (
                      <div key={team.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`team-${team.id}`}
                          value={team.id.toString()}
                          checked={newUser.team_ids.includes(team.id.toString())}
                          onChange={(e) => {
                            const teamId = e.target.value;
                            setNewUser((prev) => ({
                              ...prev,
                              team_ids: e.target.checked
                                ? [...prev.team_ids, teamId.toString()]
                                : prev.team_ids.filter((id) => id !== teamId.toString()),
                            }));
                          }}
                        />
                        <label htmlFor={`team-${team.id}`} className="cursor-pointer">
                          {team.team_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile_picture">Profile Picture</Label>
                  <Input
                    id="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                  {newUser.profile_picture && (
                    <img
                      src={newUser.profile_picture ? URL.createObjectURL(newUser.profile_picture) : undefined}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full mt-2"
                    />
                  )}
                </div>
                <Button onClick={handleAddUser} className="mt-4">
                  Add User
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterByRole('all')}>
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterByRole('Team Lead')}>
                Team Leads
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterByRole('Member')}>
                Members
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
          >
            <SortAsc className="w-4 h-4 mr-2" />
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => handleEditUser(user.id)}
              >
                <UserCog className="w-4 h-4" />
              </Button>
              <Avatar className="w-24 h-24 mx-auto">
                {user.profile_picture ? (
                  <AvatarImage
                    src={user.profile_picture}
                    alt={`${user.name}'s profile picture`}
                  />
                ) : (
                  <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-medium mt-4">{user.name}</h3>
              <Badge className="mt-2">{user.role}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Teams</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Check for user.teams as array of objects or ids */}
                    {Array.isArray(user.teams) && user.teams.length > 0
                      ? user.teams.map((team: any) => {
                          // If team is an object with team_name, use it directly
                          if (typeof team === "object" && team.team_name) {
                            return (
                              <Badge key={team.id || team.team_id} className="bg-blue-100 text-blue-600">
                                {team.team_name}
                              </Badge>
                            );
                          }
                          // If team is an id, look up in teams context
                          const t = teams[team];
                          return t ? (
                            <Badge key={team} className="bg-blue-100 text-blue-600">
                              {t.team_name}
                            </Badge>
                          ) : null;
                        })
                      : // Fallback: check for user.team_ids
                        Array.isArray(user.team_ids) && user.team_ids.length > 0
                        ? user.team_ids.map((teamId: string) => {
                            const t = teams[teamId];
                            return t ? (
                              <Badge key={teamId} className="bg-blue-100 text-blue-600">
                                {t.team_name}
                              </Badge>
                            ) : null;
                          })
                        : <span className="text-xs text-gray-400">No teams</span>
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Contact</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleContactUser('email', user.email)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleContactUser('phone', user.phone || "")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 w-full mt-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
            {/* ...existing code... */}
          </div>
        );
      }
