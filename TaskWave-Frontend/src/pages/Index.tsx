import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import TaskList from '../components/TaskList';
import { Task, TaskStatus } from '../types/task';
import { Project } from '../types/project';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Clock, Target, Eye, ListChecks, User } from 'lucide-react';
import { statusConfig } from '../components/TaskCard';
import { cn } from '@/lib/utils';
import { format, set } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { taskService } from '@/services/TaskService';
import { projectService } from '@/services/ProjectService';
import { authService } from '@/services/authservice';
// import { User } from '@/types/user';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(true);

//use the get user method in authservice to get the user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getUser();
        console.log('Fetched user:', user);
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const fetchedTasks = await taskService.getAllTasks();
          const fetchedProjects = await projectService.getProjects();
          setTasks(fetchedTasks);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  // Project stats
  const getTotalProjects = () => projects.length;
  const getActiveProjects = () => projects.filter(p => p.status === 'active').length;
  const getCompletedProjects = () => projects.filter(p => p.status === 'completed').length;
  const getOnHoldProjects = () => projects.filter(p => p.status === 'on-hold').length;
  const getAverageProgress = () => {
    if (!projects.length) return 0;
    const total = projects.reduce((acc, proj) => acc + proj.progress, 0);
    return Math.round(total / projects.length);
  };

  // Task stats
  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);
  const getTotalTasks = () => tasks.length;
  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => task.dueDate && new Date(task.dueDate) < today && !['completed','cancelled'].includes(task.status)).length;
  };
  const getHighPriorityTasks = () => tasks.filter(task => task.priority === 'high' && !['completed','cancelled'].includes(task.status)).length;
  const getCompletionRate = () => {
    const completed = getTasksByStatus('completed').length;
    return getTotalTasks() ? ((completed / getTotalTasks()) * 100).toFixed(1) : '0.0';
  };
  const getAverageTaskDuration = () => {
    const completedTasks = getTasksByStatus('completed');
    if (!completedTasks.length) return 0;
    const totalDays = completedTasks.reduce((acc, task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const created = task.createdAt ? new Date(task.createdAt) : null;
        if (created) {
          const diff = (dueDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return acc + Math.abs(diff);
        }
      }
      return acc;
    }, 0);
    return Math.round(totalDays / completedTasks.length);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
              <Target className="w-6 h-6 text-purple-600" />
              <Eye className="w-6 h-6 text-blue-600" />
              <ListChecks className="w-6 h-6 text-green-600" />
              <div className="flex flex-col items-start">
                <span className="font-bold text-xl text-gray-900">TaskWave</span>
                <span className="text-xs text-gray-500">identify • monitor • manage</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{user.company_name} Dashboard</h1>
            {/* Company Name */}
          </div>
          <div className="flex gap-4">
            {getOverdueTasks() > 0 && <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm">{getOverdueTasks()} overdue tasks</div>}
            {getHighPriorityTasks() > 0 && <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">{getHighPriorityTasks()} high priority tasks</div>}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg"><BarChart3 className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold text-gray-900">Completion Rate</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
            <p className="text-sm text-gray-500">Of total tasks completed</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              <h3 className="font-semibold text-gray-900">Active Tasks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => !['completed','cancelled'].includes(t.status)).length}</p>
            <p className="text-sm text-gray-500">Tasks in progress</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div>
              <h3 className="font-semibold text-gray-900">Average Duration</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getAverageTaskDuration()} days</p>
            <p className="text-sm text-gray-500">Per completed task</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {['not_started','in_progress','review','completed','cancelled'].map(status => (
            <TaskCard
              key={status}
              status={status as TaskStatus}
              count={getTasksByStatus(status as TaskStatus).length}
              onClick={() => setSelectedStatus(status as TaskStatus)}
            />
          ))}
          <div className="rounded-lg p-3 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-4 h-4 flex items-center justify-center text-lg font-bold">Σ</div>
              <span className="text-xl font-semibold">{getTotalTasks()}</span>
            </div>
            <h3 className="text-sm font-medium">Total Tasks</h3>
            <p className="text-xs text-gray-300">System overview</p>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedStatus && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedStatus(null)}
                className="fixed inset-0 bg-black cursor-pointer z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
                style={{ maxHeight: 'calc(100vh - 4rem)', margin: '2rem auto' }}
              >
                <div className="sticky top-0 flex justify-between items-center p-4 bg-gray-50 border-b backdrop-blur-sm bg-opacity-90">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{statusConfig[selectedStatus].label}</h2>
                    <p className="text-sm text-gray-500">{getTasksByStatus(selectedStatus).length} tasks in this status</p>
                  </div>
                  <button onClick={() => setSelectedStatus(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                  <TaskList tasks={getTasksByStatus(selectedStatus)} status={selectedStatus} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Summary Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
            <div className="space-y-3">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{config.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', config.color)} />
                    <span className="text-sm font-medium">{((getTasksByStatus(status as TaskStatus).length / getTotalTasks()) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {tasks
                .filter(task => !['completed','cancelled'].includes(task.status) && task.dueDate)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{task.title}</span>
                    <span className="text-sm font-medium">{format(new Date(task.dueDate), 'MMM dd')}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
