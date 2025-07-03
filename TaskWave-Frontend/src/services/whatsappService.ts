// src/services/apiService.ts (or keep as authService.ts / projectService.ts)

import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client
import Cookies from 'js-cookie';
import { AxiosError, AxiosResponse } from 'axios';
import { Whatsappinfo } from '@/types/whatsapp';

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
      console.log('Project not found.');
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
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    try {
      const response = await apiClient.post<Project>('/api/projects/store');
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
   // Interceptor adds Bearer token & CSRF might not be needed
   // const xsrfToken = Cookies.get('XSRF-TOKEN');
  try {
    // Use PUT or PATCH depending on your API design (PUT usually replaces)
    const response = await apiClient.put<Project>(`/api/projects/${projectId}`, payload /*, {
        headers: { 'X-XSRF-TOKEN': xsrfToken || '' } // Add if CSRF needed here
    }*/);
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
   // const xsrfToken = Cookies.get('XSRF-TOKEN');
  try {
    // Expecting 204 No Content on successful delete usually
    await apiClient.delete(`/api/projects/${projectId}` /*, {
        headers: { 'X-XSRF-TOKEN': xsrfToken || '' } // Add if CSRF needed here
    }*/);
    // No return value needed
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to delete project:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// --- Exports ---

// Export auth functions
export const authService = {
  // getCsrfCookie,
};

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

// --- WhatsApp Service Functions ---
const createwhatsapp = async (payload: Partial<Whatsappinfo>): Promise<Whatsappinfo> => {
  // Interceptor adds Bearer token & CSRF might not be needed if using token auth
  // const xsrfToken = Cookies.get('XSRF-TOKEN'); // Only needed if /api/projects requires CSRF
  //append user-id to payload if needed
 try {
   const xsrfToken = Cookies.get('XSRF-TOKEN');
   try {
     const response = await apiClient.post<Whatsappinfo>('/api/whatsapp/store', payload);
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

//method to update whatsapp info
const updatewhatsapp = async (payload: Partial<Whatsappinfo>): Promise<Whatsappinfo> => {
  // Interceptor adds Bearer token & CSRF might not be needed
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  try {
    // Use PUT or PATCH depending on your API design (PUT usually replaces)
    const response = await apiClient.put<Whatsappinfo>(`/api/whatsapp/update`, payload);
    return response.data; // Return the updated project data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to update whatsapp:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};
//method to fetch whatsapp info
const getwhatsappinfo = async (): Promise<Whatsappinfo> => {
  try {
    const response = await apiClient.get<Whatsappinfo>('/api/whatsapp/show');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to fetch WhatsApp info:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Fetch WhatsApp messages
interface WhatsAppMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const getWhatsAppMessages = async (): Promise<WhatsAppMessage[]> => {
  try {
    const response = await apiClient.get<WhatsAppMessage[]>('/api/whatsapp/messages');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to fetch WhatsApp messages:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Send a WhatsApp message
const sendWhatsAppMessage = async (payload: { to: string; message: string }): Promise<any> => {
  try {
    const response = await apiClient.post<WhatsAppMessage>('/api/whatsapp/send', payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to send WhatsApp message:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// Delete a WhatsApp message
const deleteWhatsAppMessage = async (messageId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/whatsapp/messages/${messageId}`);
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error('Failed to delete WhatsApp message:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};

// --- Exports ---

// Export WhatsApp functions
export const whatsappService = {
  getWhatsAppMessages,
  sendWhatsAppMessage,
  deleteWhatsAppMessage,
  createwhatsapp,
  getwhatsappinfo,
  updatewhatsapp
};
