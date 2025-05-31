
import { Task } from '../types/task';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  status: string;
}

const TaskList = ({ tasks, status }: TaskListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="text-gray-500 mt-1">{task.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Assignee: {task.assignee}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    Due: {format(task.dueDate, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <Badge className={cn('ml-2', getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
