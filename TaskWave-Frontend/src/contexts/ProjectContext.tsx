import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { AxiosError } from 'axios';

// --- Import the project service ---
import { projectService } from '../services/ProjectService'; // Adjust path as needed

// 1. Define the Project type based on your API response (ProjectResource)
// Ensure this matches the interface in apiService.ts and your API response
interface Project {
  id: number;
  project_name: string;
  description?: string;
  category?: string;
  objectives?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  // progress?: number;
}

type NewProjectPayload = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
  team_id?: number; // Optional if not required for creation
};

// 2. Define the shape of the context data
interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>; // fetchProjects typically doesn't need to return projects, it sets state
  addProject: (payload: NewProjectPayload) => Promise<Project | null>;
  updateProject: (id: number, payload: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
}

// 3. Create the Context
const ProjectsContext = createContext<ProjectsContextType | null>(null);

// 4. Create the Provider Component
interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Define the function to fetch projects using the projectService
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch projects via projectService..."); // Debug log

    try {
      // --- Use projectService.getProjects() ---
      const fetchedProjects = await projectService.getProjects();
      // The service function already extracts the data array and handles pagination structure
      console.log("Projects fetched successfully:", fetchedProjects);
      setProjects(fetchedProjects); // Set state with the returned array
    } catch (err) {
      // Service function might re-throw error, catch it here to set state
      const error = err as AxiosError | Error; // Can be AxiosError or other Error
      console.error("Error fetching projects via context:", error.message);
      setError('Failed to load projects.');
      // Optional: Handle specific errors like 401/403
      // if (axiosError.response && (axiosError.response.status === 401 || axiosError.response.status === 419)) {
      //   // Handle unauthorized access
      // }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for useCallback is fine here as it doesn't depend on component scope variables that change

  const addProject = useCallback(async (payload: NewProjectPayload): Promise<Project | null> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      // Use the service function to create the project via API
      const newProject = await projectService.createProject(payload);
      console.log("Project created via API:", newProject);
      // Refresh the projects list to include the new one
      await fetchProjects(); // Await fetch to ensure list is updated before returning
      return newProject; // Return the newly created project data
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to add project via context:", err.message);
      setError("Failed to add project."); // Set error state in context
      return null; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [fetchProjects]); // Depend on fetchProjects to ensure it is up-to-date

  const updateProject = useCallback(async (id: number, payload: Partial<Project>): Promise<Project | null> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      // Use the service function to update the project via API
      const updatedProject = await projectService.updateProject(id, payload);
      console.log("Project updated via API:", updatedProject);
      // Refresh the projects list to reflect the updated project
      await fetchProjects(); // Await fetch to ensure list is updated before returning
      return updatedProject; // Return the updated project data
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to update project via context:", err.message);
      setError("Failed to update project."); // Set error state in context
      return null; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [fetchProjects]); // Depend on fetchProjects to ensure it is up-to-date

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true); // Indicate loading state
    setError(null);
    try {
      // Use the service function to delete the project via API
      await projectService.deleteProject(id);
      console.log("Project deleted via API:", id);
      // Refresh the projects list to reflect the deletion
      await fetchProjects(); // Await fetch to ensure list is updated
      return true; // Indicate success
    } catch (error) {
      const err = error as AxiosError | Error;
      console.error("Failed to delete project via context:", err.message);
      setError("Failed to delete project."); // Set error state in context
      return false; // Indicate failure
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [fetchProjects]); // Depend on fetchProjects to ensure it is up-to-date

  // Fetch projects automatically when the provider mounts
  useEffect(() => {
    // Check if user is authenticated before fetching? Maybe get user from AuthContext here?
    // For now, fetch on mount assuming auth is handled by interceptor/protected routes
    fetchProjects();
  }, [fetchProjects]); // Depend on the stable fetchProjects function

  // Value provided by the context
  const value = useMemo(() => ({
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject, // Add deleteProject to the context value
  }), [projects, loading, error, fetchProjects, addProject, updateProject, deleteProject]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

// 5. Create a custom hook for easy consumption
export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
