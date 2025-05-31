
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play, RefreshCcw, X } from 'lucide-react';
import { TaskStatus } from '../types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  status: TaskStatus;
  count: number;
  onClick: () => void;
}

const statusConfig = {
  not_started: {
    icon: Clock,
    label: 'Not Started',
    color: 'bg-gray-100 hover:bg-gray-200',
    iconColor: 'text-gray-600'
  },
  in_progress: {
    icon: Play,
    label: 'In Progress',
    color: 'bg-blue-50 hover:bg-blue-100',
    iconColor: 'text-blue-600'
  },
  review: {
    icon: RefreshCcw,
    label: 'To Be Reviewed',
    color: 'bg-purple-50 hover:bg-purple-100',
    iconColor: 'text-purple-600'
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'bg-green-50 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
  cancelled: {
    icon: X,
    label: 'Cancelled',
    color: 'bg-red-50 hover:bg-red-100',
    iconColor: 'text-red-600'
  }
};

export { statusConfig };

const TaskCard = ({ status, count, onClick }: TaskCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'rounded-lg p-3 cursor-pointer transition-all duration-200',
        'border border-gray-200',
        'backdrop-blur-sm shadow-sm',
        config.color,
        'max-w-[240px]'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={cn('p-1.5 rounded-md', config.iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xl font-semibold">{count}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-900">{config.label}</h3>
      <p className="text-xs text-gray-500 mt-0.5">Click to view details</p>
    </motion.div>
  );
};

export default TaskCard;
