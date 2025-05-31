import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { AxiosError } from 'axios';

// Import the member service and related types
import {
  memberService,
  Member,
  NewMemberPayload,
  UpdateMemberPayload,
} from '../services/MemberService';

// --- Type Definitions ---
type MembersState = Record<number, Member>;

interface MembersContextType {
  members: MembersState;
  loading: boolean;
  error: string | null;
  fetchAllMembers: () => Promise<void>;
  fetchMembersByTeamId: (teamId: number) => Promise<void>;
  fetchMembers: (teamId: number) => Promise<void>;
  fetchMemberById: (memberId: number) => Promise<void>;
  addMember: (payload: NewMemberPayload) => Promise<Member | null>;
  updateMember: (memberId: number, payload: UpdateMemberPayload) => Promise<Member | null>;
  deleteMember: (memberId: number) => Promise<boolean>;
}

const MembersContext = createContext<MembersContextType | null>(null);

interface MembersProviderProps {
  children: ReactNode;
}

export const MembersProvider: React.FC<MembersProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<MembersState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all members for a specific team
  // const fetchMembers = useCallback(async (teamId: number) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const fetched = await memberService.getMembers(teamId);
  //     const membersMap = fetched.reduce((acc, member) => {
  //       acc[member.id] = member;
  //       return acc;
  //     }, {} as MembersState);
  //     setMembers(membersMap);
  //   } catch (err) {
  //     const e = err as AxiosError | Error;
  //     setError(e.message || 'Failed to load members');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  //fetch all members of the user
  const fetchAllMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await memberService.getAllMembers();
      const membersMap = fetched.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
      }, {} as MembersState);
      setMembers(membersMap);
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  //fetch member by team id
  const fetchMembersByTeamId = useCallback(async (teamId: number) => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await memberService.getMembersByTeamId(teamId);
      const membersMap = fetched.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
      }, {} as MembersState);
      setMembers(membersMap);
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }
  , []);

  //Fetch a single member by ID
  const fetchMemberById = useCallback(async (memberId: number) => {
    setLoading(true);
    setError(null);
    try {
      const member = await memberService.getMemberById(memberId);
      if (member) {
        setMembers(prev => ({
          ...prev,
          [member.id]: member,
        }));
      }
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load member');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new member
  const addMember = useCallback(
    async (payload: NewMemberPayload): Promise<Member | null> => {
      setLoading(true);
      setError(null);
      try {
        console.log('Adding member:', payload);
        const newMember = await memberService.createMember(payload);
        setMembers(prev => ({
          ...prev,
          [newMember.id]: newMember,
        }));
        return newMember;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to add member');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update a member
  const updateMember = useCallback(
    async (memberId: number, payload: UpdateMemberPayload): Promise<Member | null> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await memberService.updateMember(memberId, payload);
        setMembers(prev => ({
          ...prev,
          [memberId]: updated,
        }));
        return updated;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to update member');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a member
  const deleteMember = useCallback(
    async (memberId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await memberService.deleteMember(memberId);
        setMembers(prev => {
          const { [memberId]: _, ...rest } = prev;
          return rest;
        });
        return true;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to delete member');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      members,
      loading,
      error,
      fetchMembers: fetchMembersByTeamId,
      fetchAllMembers,
      fetchMemberById,
      fetchMembersByTeamId,
      addMember,
      updateMember,
      deleteMember,
    }),
    [members, loading, error, fetchAllMembers, fetchMembersByTeamId, fetchMemberById, addMember, updateMember, deleteMember]
  );

  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
};

export const useMembers = (): MembersContextType => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
};
