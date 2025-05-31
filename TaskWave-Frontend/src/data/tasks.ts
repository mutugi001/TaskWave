
import { Task } from '../types/task';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system for the new product',
    status: 'not_started',
    dueDate: new Date('2024-04-20'),
    priority: 'high',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate third-party payment API',
    status: 'in_progress',
    dueDate: new Date('2024-04-15'),
    priority: 'high',
    assignee: 'John Smith'
  },
  {
    id: '3',
    title: 'User Authentication Flow',
    description: 'Implement secure user authentication',
    status: 'review',
    dueDate: new Date('2024-04-10'),
    priority: 'high',
    assignee: 'Maria Garcia'
  },
  {
    id: '4',
    title: 'Database Optimization',
    description: 'Optimize database queries for better performance',
    status: 'completed',
    dueDate: new Date('2024-04-05'),
    priority: 'medium',
    assignee: 'Alex Kim'
  },
  {
    id: '5',
    title: 'Mobile Responsiveness',
    description: 'Ensure application works well on mobile devices',
    status: 'cancelled',
    dueDate: new Date('2024-04-01'),
    priority: 'medium',
    assignee: 'Emma Wilson'
  },
  {
    id: '6',
    title: 'Documentation Update',
    description: 'Update API documentation',
    status: 'not_started',
    dueDate: new Date('2024-04-25'),
    priority: 'low',
    assignee: 'James Brown'
  },
  {
    id: '7',
    title: 'Security Audit',
    description: 'Conduct security audit of the application',
    status: 'in_progress',
    dueDate: new Date('2024-04-18'),
    priority: 'high',
    assignee: 'Lisa Chen'
  },
  {
    id: '8',
    title: 'Performance Testing',
    description: 'Run performance tests on new features',
    status: 'review',
    dueDate: new Date('2024-04-12'),
    priority: 'medium',
    assignee: 'David Miller'
  },
];
