
import { Task, TaskStatus } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface TaskComponentProps {
  task: Task;
  onStatusChange: (newStatus: TaskStatus) => void;
}

const TaskComponent = ({ task, onStatusChange }: TaskComponentProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <div className="flex gap-1">
            <Badge className={cn('text-xs', getPriorityColor(task.priority))}>
              {task.priority}
            </Badge>
            <Badge className={cn('text-xs', getStatusColor(task.status))}>
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
        
        <div className="flex justify-between items-center text-xs mt-1">
          <span>Assignee: {task.assignee}</span>
          <span>Due: {format(task.dueDate, "MMM d")}</span>
        </div>
        
        <div className="mt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2 w-full justify-between">
                <span>Change Status</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange('not_started')}>
                Not Started
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('in_progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('review')}>
                Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('cancelled')}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default TaskComponent;
