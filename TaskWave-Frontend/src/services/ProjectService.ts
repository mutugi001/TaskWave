// src/services/apiService.ts (or keep as authService.ts / projectService.ts)

import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client
import Cookies from 'js-cookie';
import { AxiosError, AxiosResponse } from 'axios';

// --- Type Definitions ---

// Token type expected from login (adjust if backend sends object)
// Assuming the token itself is the string in response.data
type AuthToken = string;

// User type based on API response
export interface User {
  id: number;
  company_name: string; // Keep if needed, ensure backend provides it
  username: string;     // Keep if needed, ensure backend provides it (maps to 'name'?)
  name?: string;        // Add 'name' if backend sends it (standard Laravel)
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Project type based on ProjectResource
export interface Project {
  id: number;
  project_name: string; // Use the name from ProjectResource
  description?: string;
  category?: string;
  objectives?: string;
  start_date?: string; // API likely sends string dates
  end_date?: string;
  status?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  // Add other fields from your ProjectResource
}

// Structure for Laravel Paginated Responses
interface PaginatedResponse<T> {
    data: T[];
    links: { first: string | null; last: string | null; prev: string | null; next: string | null; };
    meta: { current_page: number; from: number | null; last_page: number; path: string; per_page: number; to: number | null; total: number; };
}


// Payloads
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  company_name: string; // Ensure backend handles this
  username: string;     // Ensure backend handles this (maps to 'name'?)
  name?: string;        // Add if backend expects 'name' instead of/as well as username
  email: string;
  password: string;
  password_confirmation: string;
}

// API Error Structure
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// --- Authentication Service Functions ---

// const getCsrfCookie = async (): Promise<void> => {
//   try {
//     // No token needed for this request usually
//     await apiClient.get('/sanctum/csrf-cookie');
//   } catch (error) {
//     const axiosError = error as AxiosError<ApiError>;
//     console.error('Error fetching CSRF cookie:', axiosError.response?.data?.message || axiosError.message);
//     throw error;
//   }
// };

// --- Project Service Functions ---

// Fetch projects (handles pagination)
const getProjects = async (): Promise<PaginatedResponse<Project>> => {
  // Interceptor adds Bearer token

  try {
    // Expecting the PaginatedResponse structure from Laravel API Resource Collection
    const response = await apiClient.get<PaginatedResponse<Project>>('/api/projects/index');
    return response.data; // Return the actual projects array
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to fetch projects:', axiosError.response?.data || axiosError.message);
    throw error; // Re-throw to be handled by caller (e.g., ProjectsContext)
  }
};

// Fetch a single project by ID
const getProjectById = async (projectId: number): Promise<Project | null> => {
  // Interceptor adds Bearer token
  try {
    const response = await apiClient.get<Project>(`/api/projects/${projectId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to fetch project:', axiosError.response?.data || axiosError.message);
    if (axiosError.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Create a new project
// Input payload uses Partial<Project> allowing subset of fields potentially
// Backend validation will enforce required fields
const createProject = async (payload: Partial<Project>): Promise<Project> => {
   // Interceptor adds Bearer token & CSRF might not be needed if using token auth
   // const xsrfToken = Cookies.get('XSRF-TOKEN'); // Only needed if /api/projects requires CSRF
   //append user-id to payload if needed
  try {
    try {
      const response = await apiClient.post<Project>('/api/projects/store', payload);
      return response.data; // Return the created project data from API
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('Failed to create project:', axiosError.response?.data || axiosError.message);
      throw error;
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to create project:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Update an existing project
const updateProject = async (projectId: number, payload: Partial<Project>): Promise<Project> => {
  try {
    // Use PUT or PATCH depending on your API design
    const response = await apiClient.post<Project>(`/api/projects/${projectId}/update`, payload);
    return response.data; // Return the updated project data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to update project:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Delete a project
const deleteProject = async (projectId: number): Promise<void> => {
   // Interceptor adds Bearer token & CSRF might not be needed
  try {
    // Expecting 204 No Content on successful delete usually
    await apiClient.delete(`/api/projects/${projectId}/destroy`);
    // No return value needed
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to delete project:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// --- Exports ---

// Export auth functions
// export const authService = {
//   getCsrfCookie,
// };

// Export project functions
export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

// Or export all combined if preferred:
// export const apiService = { ...authService, ...projectService };

