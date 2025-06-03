import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash2, Share2, Filter, SortAsc, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react"; // Keep useEffect for initial data fetch
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Import Context Hooks ---
import { useProjects } from '@/contexts/ProjectContext'; // Adjust import path
import { useTasks } from '@/contexts/TaskContext'; // Adjust import path
import { Task } from '@/services/TaskService'; // <-- Import Task type from apiService
import { useTeams } from '@/contexts/TeamContext'; // Adjust import path
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

// --- Task Component Placeholder ---
// TODO: Replace with your actual TaskComponent import and implementation
const TaskComponent: React.FC<{ task: Task, onStatusChange: (newStatus: Task['status']) => void }> = ({ task }) => {
  const { deleteTask, markTaskAsCompleted, fetchTasksForProject } = useTasks();
  const { toast } = useToast();

  const handleDelete = async (taskId: number) => {
    try {
      const success = await deleteTask(task.project_id, taskId);
      if (success) {
        toast({ title: "Task Deleted", description: "Task deleted successfully." });
        // Optionally refresh tasks for the project after deletion
        if (task.project_id) {
          fetchTasksForProject(task.project_id);
        }
      } else {
        toast({ title: "Error", description: "Failed to delete task.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while deleting task.", variant: "destructive" });
    }
  };

  const handleMarkCompleted = async (taskId: number) => {
    try {
      const updatedTask = await markTaskAsCompleted(taskId);
      if (updatedTask) {
        toast({ title: "Success", description: "Task marked as completed!" });
        // Fetch tasks for the project to get updated info
        if (task.project_id) {
          fetchTasksForProject(task.project_id);
        }
      } else {
        toast({ title: "Error", description: "Failed to mark task as completed.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while marking task as completed.", variant: "destructive" });
    }
  };

  return (
    <div className="p-2 border rounded mb-2 bg-muted/40 flex justify-between items-start gap-2">
      <div>
        <p className="font-semibold">{task.title}</p>
        <p className="text-sm text-muted-foreground">{task.description || 'No description'}</p>
        <p className="text-xs mt-1">Status: {task.status}</p>
        {/* Example: Button to mark as completed */}
        <Button
          size="sm"
          variant="outline"
          className="mt-1"
          onClick={() => handleMarkCompleted(task.id)}
          disabled={task.status === 'completed'}
        >
          Mark Completed
        </Button>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="text-red-500 hover:text-red-700"
        title="Delete Task"
        onClick={() => handleDelete(task.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
// -----------------------------

const statusColors: { [key: string]: string } = {
  active: "bg-[#28C76F]",
  completed: "bg-[#4A90E2]",
  "on-hold": "bg-[#F4A261]",
};

interface NewProjectFormState {
  id: number;
  project_name: string;
  category: string;
  objectives: string;
  start_date: string;
  end_date: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

export default function Projects() {
  // --- Use Contexts ---
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject, // <-- Import deleteProject from context
  } = useProjects();

  const { isAuthenticated } = useAuth(); // Get authentication status

  const {
    tasksByProject,
    loading: tasksLoading,
    error: tasksError,
    fetchTasksForProject,
    addTaskToProject,
    updateTask,
    deleteTask,
    markTaskAsCompleted, // <-- Import markTaskAsCompleted from TaskContext
  } = useTasks();

  const { teams, fetchTeams, loading: teamsLoading, error: teamsError } = useTeams();

  const { toast } = useToast();

  // Fetch projects on mount, but only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [fetchProjects, isAuthenticated]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  console.log("teams on page: ", teams);


  // --- Local UI State ---
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const initialNewProjectState: NewProjectFormState = {
    id: 0,
    project_name: "", category: "", objectives: "",
    start_date: format(new Date(), "yyyy-MM-dd"), end_date: format(new Date(), "yyyy-MM-dd"),
    description: "", status: "active",
  };
  const [newProject, setNewProject] = useState<NewProjectFormState>(initialNewProjectState);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "project_id" | "id"> & { dependencies?: number[] | null }>({
    title: "",
    due_date: "",
    priority: "low",
    assigned_team: "",
    description: "",
    status: "not_started",
    dependencies: null,
  });  // --------------------
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<NewProjectFormState | null>(null);

  // --- CRUD Handlers ---
  const handleAddProject = async () => {
    if (!newProject.project_name || !newProject.description /* ... */) {
      toast({ title: "Missing Fields", description: "Please fill in all project details.", variant: "destructive" });
      return;
    }
    setIsSubmittingProject(true);
    try {
      const createdProject = await addProject(newProject);
      if (createdProject) {
        toast({ title: "Success", description: "Project created successfully!" });
        setIsAddingProject(false);
        setNewProject(initialNewProjectState);
      } else {
        toast({ title: "Error", description: `Failed to create project: ${projectsError || 'Unknown error'}`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Unexpected error during handleAddProject:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleAddTask = async () => {
    if (!selectedProject || !newTask.title) {
      toast({ title: "Missing Fields", description: "Please select a project and enter a task title.", variant: "destructive" });
      return;
    }
    try {
      const dependenciesToSend = Array.isArray(newTask.dependencies) && newTask.dependencies.length > 0 ? newTask.dependencies : null;
      const createdTask = await addTaskToProject(selectedProject, { ...newTask, dependencies: dependenciesToSend });
      if (createdTask) {
        toast({ title: "Success", description: "Task added successfully!" });
        setIsAddingTask(false);
        setNewTask({ title: "", description: "", status: "not_started", assigned_team: "", due_date: "", priority: "low", dependencies: null });
        // Fetch tasks for the project to get updated info
        fetchTasksForProject(selectedProject);
      } else {
        toast({ title: "Error", description: `Failed to add task: ${tasksError || 'Unknown error'}`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Unexpected error during handleAddTask:", error);
      toast({ title: "Error", description: "An unexpected error occurred adding task.", variant: "destructive" });
    }
  };

  const handleEditProject = (id: number) => {
    const projectToEdit = projects.find((project) => project.id === id);
    if (projectToEdit) {
      setEditingProject({
        id: projectToEdit.id, // Set the project ID
        project_name: projectToEdit.project_name,
        category: projectToEdit.category || "",
        objectives: projectToEdit.objectives || "",
        start_date: projectToEdit.start_date || format(new Date(), "yyyy-MM-dd"),
        end_date: projectToEdit.end_date || format(new Date(), "yyyy-MM-dd"),
        description: projectToEdit.description || "",
        status: projectToEdit.status as 'active' | 'completed' | 'on-hold',
      });
      setIsEditingProject(true);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.project_name || !editingProject.description) {
      toast({ title: "Missing Fields", description: "Please fill in all project details.", variant: "destructive" });
      return;
    }
    try {
      console.log("Updating project:", editingProject);
      const updatedProject = await updateProject(editingProject.id, editingProject); // Pass the project ID and updated data
      if (updatedProject) {
        toast({ title: "Success", description: "Project updated successfully!" });
        setIsEditingProject(false);
        setEditingProject(null);
      } else {
        toast({ title: "Error", description: `Failed to update project: ${projectsError || 'Unknown error'}`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Unexpected error during handleUpdateProject:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (id: number) => {
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this project?",
      action: (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              try {
                const success = await deleteProject(id);
                if (success) {
                  toast({ title: "Success", description: "Project deleted successfully!" });
                } else {
                  toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
                }
              } catch (error) {
                console.error("Unexpected error during handleDeleteProject:", error);
                toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
              }
            }}
          >
            Delete
          </Button>
          <Button variant="outline" size="sm">Cancel</Button>
        </div>
      ),
    });
  };

  // --- Task Fetching on Expand ---
  const toggleProjectExpand = (projectId: number) => {
    const newExpandedProjectId = expandedProject === projectId ? null : projectId;
    setExpandedProject(newExpandedProjectId);

    if (newExpandedProjectId !== null && !tasksByProject[newExpandedProjectId] && !tasksLoading) {
      fetchTasksForProject(newExpandedProjectId);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    const updatedTask = await updateTask(taskId, { status: newStatus });
    if (updatedTask) {
      toast({ title: "Task Updated", description: `Task status set to ${newStatus}` });
    } else {
      toast({ title: "Error", description: `Failed to update task status: ${tasksError || 'Unknown error'}`, variant: "destructive" });
    }
  };

  const handleMarkTaskAsCompleted = async (taskId: number) => {
    try {
      const updatedTask = await markTaskAsCompleted(taskId);
      if (updatedTask) {
        toast({ title: "Success", description: "Task marked as completed!" });
      } else {
        toast({ title: "Error", description: "Failed to mark task as completed.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Unexpected error during handleMarkTaskAsCompleted:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
  };

  // --- Helper Functions ---
  const calculateProjectProgress = (projectId: number): number => {
    const tasks = tasksByProject[projectId] || [];
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const totalTasks = tasks.length;

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (projectsLoading && (!projects || projects.length === 0)) {
    return <div className="p-6">Loading projects...</div>;
  }

  if (projectsError) {
    return (
      <div className="p-6 text-red-600">
        Error loading projects: {projectsError}
        <Button onClick={fetchProjects} variant="outline" className="ml-4" disabled={projectsLoading}>
          {projectsLoading ? 'Retrying...' : 'Retry'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {projects?.filter(p => p.status === 'active').length || 0} Active &bull;{' '}
              {projects?.filter(p => p.status === 'completed').length || 0} Completed &bull;{' '}
              {projects?.filter(p => p.status === 'on-hold').length || 0} On Hold &bull;{' '}
              Total {projects?.length || 0}
            </p>
          </div>
          <Sheet open={isAddingProject} onOpenChange={setIsAddingProject}>
            <SheetTrigger asChild>
              <Button className="sm:w-auto w-full" disabled={projectsLoading}>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Add New Project</SheetTitle><SheetDescription>Create a new project...</SheetDescription></SheetHeader>
              <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
                <div className="grid gap-4 py-4 pr-6">
                  <div className="space-y-2"><Label htmlFor="project_name">Title</Label><Input id="project_name" value={newProject.project_name} onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="objectives">Objectives</Label><Input id="objectives" value={newProject.objectives} onChange={(e) => setNewProject({ ...newProject, objectives: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="start_date">Start Date</Label><Input type="date" id="start_date" value={newProject.start_date} onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="end_date">Due Date</Label><Input type="date" id="end_date" value={newProject.end_date} onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={newProject.status} onValueChange={(value: 'active' | 'completed' | 'on-hold') => setNewProject({ ...newProject, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent></Select></div>
                </div>
                <Button onClick={handleAddProject} className="mt-4" disabled={isSubmittingProject}>{isSubmittingProject ? 'Creating...' : 'Create Project'}</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Filter/Sort Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button variant="outline" size="sm"><SortAsc className="w-4 h-4 mr-2" /> Sort</Button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.length > 0 ? (
          projects.map((project) => {
            const dueDate = project.end_date ? parseISO(project.end_date) : null;
            const formattedDueDate = dueDate instanceof Date && !isNaN(dueDate.valueOf())
              ? format(dueDate, "MMM d, yyyy")
              : 'N/A';
            const status = project.status || 'active';
            const isExpanded = expandedProject === project.id;
            const currentProjectTasks = tasksByProject[project.id] || [];

            return (
              <Card
                key={project.id}
                className={`hover:shadow-lg transition-all flex flex-col ${
                  isExpanded ? 'col-span-3' : '' // Expanded card spans full width
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between"><Badge className={`${statusColors[status] || 'bg-gray-400'} text-white capitalize`}>{status.replace('_', ' ')}</Badge><span className="text-sm text-gray-500 dark:text-gray-400">Due {formattedDueDate}</span></div>
                  <CardTitle className="mt-2">{project.project_name}</CardTitle>
                  <CardDescription>{project.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 flex flex-col">
                  <div className="flex-grow">
                    <Label>Progress</Label>
                    <Progress value={calculateProjectProgress(project.id)} className="h-2" />
                  </div>

                  {/* --- Task Section --- */}
                  <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tasks ({tasksByProject[project.id] ? currentProjectTasks.length : '?'})</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProject(project.id); setIsAddingTask(true); }}>
                          <Plus className="w-3 h-3 mr-1" /> Add Task
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleProjectExpand(project.id)} disabled={tasksLoading && expandedProject === project.id}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {/* --- Expanded Task Area --- */}
                    {isExpanded && (
                      <div className="mt-2 space-y-3 pt-3 min-h-[50px]">
                        {tasksLoading && expandedProject === project.id && <p className="text-sm text-muted-foreground italic">Loading tasks...</p>}
                        {!tasksLoading && tasksError && expandedProject === project.id && <p className="text-sm text-red-600 italic">Error loading tasks: {tasksError}</p>}
                        {!tasksLoading && !tasksError && (
                          currentProjectTasks.length > 0 ? (
                            currentProjectTasks.map(task => (
                              <TaskComponent
                                key={task.id}
                                task={task}
                                onStatusChange={(newStatus) => handleUpdateTaskStatus(task.id, newStatus)}
                              />
                            ))
                          ) : (
                            tasksByProject[project.id] && <p className="text-sm text-gray-500 italic">No tasks found for this project.</p>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project.id)}><FileEdit className="w-4 h-4 mr-2" /> Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleShareProject(project.id)}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#FF6B6B] hover:text-[#FF6B6B]/90"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-500 italic">No projects available.</p>
        )}
      </div>

      {/* Add Task Sheet */}

      <Sheet open={isAddingTask} onOpenChange={setIsAddingTask}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
            <SheetDescription>Create a new task for project ID: {selectedProject ?? 'N/A'}</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input type="date" id="task-due-date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assigned Team</Label>
                <Select value={newTask.assigned_team} onValueChange={(value: Task['assigned_team']) => setNewTask({ ...newTask, assigned_team: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teamsLoading && <SelectItem value="loading" disabled>Loading teams...</SelectItem>}
                    {teamsError && <SelectItem value="error" disabled>Error: {teamsError}</SelectItem>}
                    {!teamsLoading && !teamsError && teams && typeof teams === 'object' && Object.keys(teams).length > 0 ? (
                      Object.entries(teams).map(([teamId, team]: [string, any]) => (
                        <SelectItem key={teamId} value={teamId}>{team.team_name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-teams" disabled>No teams available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Input id="task-description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              {/* --- Dependencies Multi-Select Dropdown --- */}
              <div className="space-y-2">
                <Label htmlFor="task-dependencies">Dependencies</Label>
                <Select
                  open={undefined}
                  value=""
                  onValueChange={() => {}}
                  // Dummy handlers to satisfy Select API, actual logic below
                >
                  <SelectTrigger>
                    <span>
                      {selectedProject &&
                      tasksByProject[selectedProject] &&
                      Array.isArray(newTask.dependencies) &&
                      newTask.dependencies.length > 0
                        ? tasksByProject[selectedProject]
                            .filter(task => newTask.dependencies?.includes(task.id))
                            .map(task => task.title)
                            .join(", ")
                        : "Select dependencies"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {/* Option for None */}
                    <div
                      key="none"
                      className="flex items-center px-2 py-1 cursor-pointer hover:bg-muted rounded"
                      onClick={e => {
                        e.preventDefault();
                        setNewTask({ ...newTask, dependencies: null });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!Array.isArray(newTask.dependencies) || newTask.dependencies.length === 0}
                        readOnly
                        className="mr-2"
                      />
                      <span>None</span>
                    </div>
                    {selectedProject &&
                    tasksByProject[selectedProject] &&
                    tasksByProject[selectedProject].length > 0 ? (
                      tasksByProject[selectedProject].map((task, idx) => (
                        <div
                          key={task.id ?? idx}
                          className="flex items-center px-2 py-1 cursor-pointer hover:bg-muted rounded"
                          onClick={e => {
                            e.preventDefault();
                            const deps = Array.isArray(newTask.dependencies) ? newTask.dependencies : [];
                            if (deps.includes(task.id)) {
                              const updated = deps.filter(id => id !== task.id);
                              setNewTask({ ...newTask, dependencies: updated.length > 0 ? updated : null });
                            } else {
                              setNewTask({ ...newTask, dependencies: [...deps, task.id] });
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!(Array.isArray(newTask.dependencies) && newTask.dependencies.includes(task.id))}
                            readOnly
                            className="mr-2"
                          />
                          <span>{task.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-muted-foreground text-sm">
                        {selectedProject ? "No tasks available" : "Select a project first"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">Select tasks this task depends on (optional)</span>
              </div>
              {/* --- Status Dropdown with Dependency Logic --- */}
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                {(() => {
                  // Check if any dependency is not completed
                  let hasIncompleteDependency = false;
                  if (
                    selectedProject &&
                    tasksByProject[selectedProject] &&
                    Array.isArray(newTask.dependencies) &&
                    newTask.dependencies.length > 0
                  ) {
                    const depTasks = tasksByProject[selectedProject].filter(task =>
                      newTask.dependencies?.includes(task.id)
                    );
                    hasIncompleteDependency = depTasks.some(task => task.status !== "completed");
                  }
                  // If any dependency is not completed, force status to not_started and lock dropdown
                  if (hasIncompleteDependency && newTask.status !== "not_started") {
                    setTimeout(() => setNewTask(nt => ({ ...nt, status: "not_started" })), 0);
                  }
                  return (
                    <Select
                      value={newTask.status}
                      onValueChange={(value: Task['status']) => {
                        if (!hasIncompleteDependency) setNewTask({ ...newTask, status: value });
                      }}
                      disabled={hasIncompleteDependency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress" disabled={hasIncompleteDependency}>In Progress</SelectItem>
                        <SelectItem value="review" disabled={hasIncompleteDependency}>Review</SelectItem>
                        <SelectItem value="completed" disabled={hasIncompleteDependency}>Completed</SelectItem>
                        <SelectItem value="cancelled" disabled={hasIncompleteDependency}>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                })()}
                {selectedProject && Array.isArray(newTask.dependencies) && newTask.dependencies.length > 0 && (() => {
                  const depTasks = tasksByProject[selectedProject]?.filter(task =>
                    newTask.dependencies?.includes(task.id)
                  ) || [];
                  const incomplete = depTasks.filter(task => task.status !== "completed");
                  return incomplete.length > 0 ? (
                    <span className="text-xs text-red-500">
                      All dependencies must be completed before changing status.
                    </span>
                  ) : null;
                })()}
              </div>
              <Button onClick={handleAddTask} className="mt-4">Create Task</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Project Sheet */}
      <Sheet open={isEditingProject} onOpenChange={setIsEditingProject}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Project</SheetTitle>
            <SheetDescription>Update the project details below.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
            <div className="grid gap-4 py-4 pr-6">
              <div className="space-y-2">
                <Label htmlFor="edit-project_name">Title</Label>
                <Input
                  id="edit-project_name"
                  value={editingProject?.project_name || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, project_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingProject?.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingProject?.category || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-objectives">Objectives</Label>
                <Input
                  id="edit-objectives"
                  value={editingProject?.objectives || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, objectives: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Start Date</Label>
                <Input
                  type="date"
                  id="edit-start_date"
                  value={editingProject?.start_date || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">Due Date</Label>
                <Input
                  type="date"
                  id="edit-end_date"
                  value={editingProject?.end_date || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, end_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingProject?.status || "active"}
                  onValueChange={(value: 'active' | 'completed' | 'on-hold') =>
                    setEditingProject({ ...editingProject, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateProject} className="mt-4">
              Update Project
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
