
export type TaskStatus = 'not_started' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
};
