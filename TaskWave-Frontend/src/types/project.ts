
export type Project = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  teamId: string;
  dueDate: Date;
  taskIds?: string[]; // Optional array of task IDs associated with this project
};
