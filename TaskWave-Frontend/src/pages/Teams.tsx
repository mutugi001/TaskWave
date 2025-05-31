import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Settings, Trash2, Users as UsersIcon, Filter, SortAsc, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeams } from "@/contexts/TeamContext"; // Use TeamsContext
import { useMembers } from "@/contexts/MemberContext"; // Use MembersContext
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

export default function Teams() {
  const { teams, loading: teamsLoading, error: teamsError, fetchTeams, addTeam, deleteTeam } = useTeams();
  const { fetchMembersByTeamId, members, loading: membersLoading } = useMembers(); // Use MembersContext
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    team_name: "",
    description: "",
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterByMembers, setFilterByMembers] = useState<'all' | 'withMembers' | 'withoutMembers'>('all');
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTeamsAndMembers = async () => {
        await fetchTeams();
        Object.values(teams).forEach(team => fetchMembersByTeamId(team.id));
      };
      fetchTeamsAndMembers();
    }
  }, [fetchTeams, fetchMembersByTeamId, isAuthenticated]);

  const handleAddTeam = async () => {
    if (!newTeam.team_name || !newTeam.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const createdTeam = await addTeam(newTeam);
      if (createdTeam) {
        toast.success("Team created successfully!");
        setIsAddingTeam(false);
        setNewTeam({ team_name: "", description: "" });
      }
    } catch (err) {
      toast.error("Failed to create team");
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      const success = await deleteTeam(teamId);
      if (success) {
        toast.success("Team deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete team");
    }
  };

  const toggleTeamExpand = (teamId: number) => {
    const newExpandedTeamId = expandedTeam === teamId ? null : teamId;
    console.log("Toggling team expand:", newExpandedTeamId);
    setExpandedTeam(newExpandedTeamId);

    if (newExpandedTeamId !== null && !Object.values(members).some(member => member.teams?.some(team => team.id === newExpandedTeamId))) {
      fetchMembersByTeamId(newExpandedTeamId); // Fetch members when expanding
    }
  };

  const filteredAndSortedTeams = useMemo(() => {
    let filtered = Object.values(teams);

    if (filterByMembers !== 'all') {
      filtered = filtered.filter(team => {
        const hasMembers = Object.values(members).some(member => member.teams?.some(team => team.id === team.id));
        return filterByMembers === 'withMembers' ? hasMembers : !hasMembers;
      });
    }

    filtered.sort((a, b) => {
      const comparison = a.team_name.localeCompare(b.team_name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [teams, members, filterByMembers, sortOrder]);

  return (
    <div className="p-6">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-gray-500 mt-2">Manage team structures and members</p>
          </div>
          <Sheet open={isAddingTeam} onOpenChange={setIsAddingTeam}>
            <SheetTrigger asChild>
              <Button className="sm:w-auto w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New Team</SheetTitle>
                <SheetDescription>
                  Set up a new team by providing the details below
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="team_name"
                    placeholder="Enter team name"
                    value={newTeam.team_name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, team_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter team description"
                    value={newTeam.description}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, description: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleAddTeam} className="mt-4">
                  Create Team
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
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterByMembers('all')}>
                All Teams
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterByMembers('withMembers')}>
                With Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterByMembers('withoutMembers')}>
                Without Members
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

      {teamsLoading ? (
        <p>Loading teams...</p>
      ) : teamsError ? (
        <p className="text-red-500">{teamsError}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedTeams.map((team) => {
            const isExpanded = expandedTeam === team.id;
            const currentTeamMembers = Object.values(members).filter(
              (member) => member.teams.some((teamObj) => teamObj.id === team.id)
            );
            return (
              <Card
                key={team.id}
                className={`hover:shadow-lg transition-all flex flex-col ${
                  isExpanded ? 'col-span-3' : '' // Expanded card spans full width
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.team_name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTeamExpand(team.id)}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-gray-500 mt-1">{team.description}</p>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Members ({currentTeamMembers.length})</span>
                      </div>
                      {membersLoading ? (
                        <p className="text-sm text-muted-foreground italic">Loading members...</p>
                      ) : (
                        <div className="space-y-2">
                          {currentTeamMembers.length > 0 ? (
                            currentTeamMembers.map(member => (
                              <div key={member.id} className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.profile_picture || ""} />
                                  <AvatarFallback>
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 italic">No members found for this team.</p>
                          )}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 w-full mt-4"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
