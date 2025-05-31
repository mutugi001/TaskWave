
import { Task } from "@/types/task";
import { AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TaskAlertProps = {
  task: Task;
  onClose: () => void;
};

export function TaskAlert({ task, onClose }: TaskAlertProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed bottom-4 left-4 p-4 rounded-lg shadow-lg text-white ${getPriorityColor(task.priority)}`}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <div>
          <h4 className="font-bold">{task.title}</h4>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Due in {Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:bg-white/20 rounded-full"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
