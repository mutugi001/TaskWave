import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { AxiosError } from 'axios';

// Import the task service and related types
import {
  taskService,
  Task,
  NewTaskPayload,
  UpdateTaskPayload,
} from '../services/TaskService';

// --- Type Definitions ---
type TasksState = Record<number, Task[]>;

interface TasksContextType {
  tasksByProject: TasksState;
  loading: boolean;
  error: string | null;
  fetchTasksForProject: (projectId: number) => Promise<void>;
  addTaskToProject: (projectId: number, payload: NewTaskPayload) => Promise<Task | null>;
  updateTask: (taskId: number, payload: UpdateTaskPayload) => Promise<Task | null>;
  deleteTask: (projectId: number, taskId: number) => Promise<boolean>;
  markTaskAsCompleted: (taskId: number) => Promise<Task | null>;
}

const TasksContext = createContext<TasksContextType | null>(null);

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasksByProject, setTasksByProject] = useState<TasksState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasksForProject = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await taskService.getTasksForProject(projectId);
      setTasksByProject(prev => ({
        ...prev,
        [projectId]: fetched || [],
      }));
    } catch (err) {
      const e = err as AxiosError | Error;
      setError(e.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add task
  const addTaskToProject = useCallback(
    async (projectId: number, payload: NewTaskPayload): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      try {
        const newTask = await taskService.createTaskForProject(projectId, payload);
        setTasksByProject(prev => ({
          ...prev,
          [projectId]: [...(prev[projectId] || []), newTask],
        }));
        return newTask;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to add task');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update task
  const updateTask = useCallback(
    async (taskId: number, payload: UpdateTaskPayload): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await taskService.updateTask(taskId, payload);
        setTasksByProject(prev => {
          const projectId = updated.project_id;
          if (!prev[projectId]) return prev;
          return {
            ...prev,
            [projectId]: prev[projectId].map(t => (t.id === taskId ? updated : t)),
          };
        });
        return updated;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to update task');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete task
  const deleteTask = useCallback(
    async (projectId: number, taskId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await taskService.deleteTask(taskId);
        setTasksByProject(prev => ({
          ...prev,
          [projectId]: (prev[projectId] || []).filter(t => t.id !== taskId),
        }));
        return true;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to delete task');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Mark task as completed
  const markTaskAsCompleted = useCallback(
    async (taskId: number): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedTask = await taskService.changeTaskStatus(taskId, 'completed');
        setTasksByProject(prev => {
          const projectId = updatedTask.project_id;
          if (!prev[projectId]) return prev;
          return {
            ...prev,
            [projectId]: prev[projectId].map(t => (t.id === taskId ? updatedTask : t)),
          };
        });
        return updatedTask;
      } catch (err) {
        const e = err as AxiosError | Error;
        setError(e.message || 'Failed to mark task as completed');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      tasksByProject,
      loading,
      error,
      fetchTasksForProject,
      addTaskToProject,
      updateTask,
      deleteTask,
      markTaskAsCompleted,
    }),
    [tasksByProject, loading, error, fetchTasksForProject, addTaskToProject, updateTask, deleteTask, markTaskAsCompleted]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextType => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};
