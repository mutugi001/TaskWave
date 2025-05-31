
import { Project } from '../types/project';
import { Team } from '../types/team';

export const initialTeams: Team[] = [

  {
    id: "1",
    name: "Frontend Development",
    description: "Responsible for user interface and experience",
    members: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "Backend Development",
    description: "Handles server-side logic and databases",
    members: ["1", "4"],
  },
  {
    id: "3",
    name: "DevOps",
    description: "Manages deployment and infrastructure",
    members: ["2", "5"],
  }
];

export const initialProjects: Project[] = [
  //edit the projects to fetch projects from the fetch projects function to be displayed
  {
    id: "1",
    title: "Website Redesign",
    description: "Modernize the company website with new design and features",
    status: "active",
    progress: 75,
    teamId: "1",
    dueDate: new Date(2024, 5, 15),
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Create a cross-platform mobile application",
    status: "active",
    progress: 45,
    teamId: "2",
    dueDate: new Date(2024, 6, 30),
  },
  {
    id: "3",
    title: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    status: "completed",
    progress: 100,
    teamId: "3",
    dueDate: new Date(2024, 4, 1),
  },
  {
    id: "4",
    title: "API Integration",
    description: "Integrate third-party payment processing system",
    status: "active",
    progress: 30,
    teamId: "2",
    dueDate: new Date(2024, 7, 15),
  },
  {
    id: "5",
    title: "Security Audit",
    description: "Perform comprehensive security assessment",
    status: "on-hold",
    progress: 20,
    teamId: "1",
    dueDate: new Date(2024, 8, 1),
  }
];
