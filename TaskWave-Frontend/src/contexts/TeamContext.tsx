import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { AxiosError } from 'axios';

// Import the team service and related types
import {
  teamService,
  Team,
  NewTeamPayload,
  UpdateTeamPayload,
} from '../services/TeamService';

// --- Type Definitions ---
type TeamsState = Record<number, Team>;

interface TeamsContextType {
  teams: TeamsState;
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  fetchTeamById: (teamId: number) => Promise<void>;
  addTeam: (payload: NewTeamPayload) => Promise<Team | null>;
  updateTeam: (teamId: number, payload: UpdateTeamPayload) => Promise<Team | null>;
  deleteTeam: (teamId: number) => Promise<boolean>;
}

const TeamsContext = createContext<TeamsContextType | null>(null);

interface TeamsProviderProps {
  children: ReactNode;
}

export const TeamsProvider: React.FC<TeamsProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<TeamsState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all teams
  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await teamService.getTeams();
      const teamsMap = fetched.reduce((acc, team) => {
        acc[team.id] = team;
        return acc;
      }, {} as TeamsState);
      setTeams(teamsMap);
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single team by ID
  const fetchTeamById = useCallback(async (teamId: number) => {
    setLoading(true);
    setError(null);
    try {
      const team = await teamService.getTeamById(teamId);
      if (team) {
        setTeams(prev => ({
          ...prev,
          [team.id]: team,
        }));
      }
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new team
  const addTeam = useCallback(
    async (payload: NewTeamPayload): Promise<Team | null> => {
      setLoading(true);
      setError(null);
      try {
        const newTeam = await teamService.createTeam(payload);
        setTeams(prev => ({
          ...prev,
          [newTeam.id]: newTeam,
        }));
        return newTeam;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to add team');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update a team
  const updateTeam = useCallback(
    async (teamId: number, payload: UpdateTeamPayload): Promise<Team | null> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await teamService.updateTeam(teamId, payload);
        setTeams(prev => ({
          ...prev,
          [teamId]: updated,
        }));
        return updated;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to update team');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a team
  const deleteTeam = useCallback(
    async (teamId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await teamService.deleteTeam(teamId);
        setTeams(prev => {
          const { [teamId]: _, ...rest } = prev;
          return rest;
        });
        return true;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to delete team');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      teams,
      loading,
      error,
      fetchTeams,
      fetchTeamById,
      addTeam,
      updateTeam,
      deleteTeam,
    }),
    [teams, loading, error, fetchTeams, fetchTeamById, addTeam, updateTeam, deleteTeam]
  );

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
};

export const useTeams = (): TeamsContextType => {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used within TeamsProvider');
  return ctx;
};
