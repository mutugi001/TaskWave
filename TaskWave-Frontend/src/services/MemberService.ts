// src/services/apiService.ts

import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client
import Cookies from 'js-cookie';
import { AxiosError, AxiosResponse } from 'axios';

// --- Type Definitions ---

// Token type expected from login
type AuthToken = string;

// User type based on API response
// Structure for Laravel Paginated Responses
interface PaginatedResponse<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null; };
    meta: { current_page: number; from: number | null; last_page: number; path: string; per_page: number; to: number | null; total: number; };
}


// API Error Structure
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// --- Authentication Service Functions ---

const getCsrfCookie = async (): Promise<void> => {
  try {
    await apiClient.get('/sanctum/csrf-cookie');
    console.log('CSRF cookie fetched');
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Error fetching CSRF cookie:', axiosError.response?.data?.message || axiosError.message);
    throw error;
  }
};
// --- Member Type Definitions ---

export interface Member {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'Team Lead' | 'Member';
    teams: Array<Team>; // Corrected type to reference a Team interface
    profile_picture?: string;
    created_at?: string;
    updated_at?: string;
}

// Define the Team interface
export interface Team {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

// Payload for creating a new member
export type NewMemberPayload = Omit<Member, 'id' | 'created_at' | 'updated_at'>;

// Payload for updating a member
export type UpdateMemberPayload = Partial<Omit<Member, 'id' | 'created_at' | 'updated_at'>>;

// --- Member Service Functions ---

/**
 * Fetches all members for a specific team.
 * @param teamId The ID of the team whose members are to be fetched.
 * @returns Promise<Member[]> An array of members.
 */
const getAllMembers = async (): Promise<Member[]> => {
    try {
        const response = await apiClient.get<Member[]>(`/api/members/allMembers`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error('Failed to fetch members:', axiosError.response?.data || axiosError.message);
        throw error;
    }
};

/**
 * Fetches a single member by their ID.
 * @param memberId The ID of the member to fetch.
 * @returns Promise<Member | null> The member data or null if not found.
 */
const getMemberById = async (memberId: number): Promise<Member | null> => {
    try {
        const response = await apiClient.get<Member>(`/api/members/${memberId}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error(`Failed to fetch member ${memberId}:`, axiosError.response?.data || axiosError.message);
        if (axiosError.response?.status === 404) {
            return null;
        }
        throw error;
    }
};
//fetch members by teamId
/**
 * Fetches members for a specific team.
 * @param teamId The ID of the team whose members are to be fetched.
 * @returns Promise<Member[]> An array of members for the team.
 */
const getMembersByTeamId = async (teamId: number): Promise<Member[]> => {
    try {
        const response = await apiClient.get<Member[]>(`/api/members/${teamId}/index`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error('Failed to fetch members:', axiosError.response?.data || axiosError.message);
        throw error;
    }
};

const getMembers = async (teamId: number): Promise<Member[]> => {
    try {
        const response = await apiClient.get<Member[]>(`/api/members/${teamId}/members`);
        console.log('Members fetched for team:', response.data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error('Failed to fetch members:', axiosError.response?.data || axiosError.message);
        throw error;
    }
};

/**
 * Creates a new member.
 * @param payload The data for the new member (matching NewMemberPayload).
 * @returns Promise<Member> The newly created member data from the API.
 */
const createMember = async (payload: NewMemberPayload): Promise<Member> => {
    const formData = new FormData();

    // Append fields to FormData
    Object.entries(payload).forEach(([key, value]) => {
        if (key === 'profile_picture' && value instanceof File) {
            formData.append(key, value); // Append file
        } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item)); // Handle arrays
        } else {
            formData.append(key, value as string);
        }
    });

    try {
        const response = await apiClient.post<Member>('/api/members/store', formData);
        console.log('Member created:', response.data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error('Failed to create member:', axiosError.response?.data || axiosError.message);
        throw error;
    }
};

/**
 * Updates an existing member.
 * @param memberId The ID of the member to update.
 * @param payload The data to update (matching UpdateMemberPayload).
 * @returns Promise<Member> The updated member data from the API.
 */
const updateMember = async (memberId: number, payload: UpdateMemberPayload): Promise<Member> => {
  console.log('Payload for updating member:', payload); // Debug log
    try {
        const response = await apiClient.post<Member>(`/api/members/${memberId}/update`, payload);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error(`Failed to update member ${memberId}:`, axiosError.response?.data || axiosError.message);
        throw error;
    }
};

/**
 * Deletes a member by their ID.
 * @param memberId The ID of the member to delete.
 * @returns Promise<void>
 */
const deleteMember = async (memberId: number): Promise<void> => {
    try {
        await apiClient.delete(`/api/members/${memberId}/destroy`);
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        console.error(`Failed to delete member ${memberId}:`, axiosError.response?.data || axiosError.message);
        throw error;
    }
};

// --- Exports ---

export const authService = {
  getCsrfCookie,

};


// --- Export Task Service ---

// --- Export Team Service ---


// --- Export Member Service ---
export const memberService = {
    getAllMembers,
    getMembersByTeamId,
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
};

// Or export all combined if preferred:
// export const apiService = { ...authService, ...projectService, ...taskService, ...teamService, ...memberService };

