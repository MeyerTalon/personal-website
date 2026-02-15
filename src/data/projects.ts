import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce application with real-time inventory management, payment processing, and an admin dashboard.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description:
      'A collaborative task management tool with real-time updates, drag-and-drop organization, and team workspaces.',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'WebSocket', 'Tailwind CSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'Weather Dashboard',
    description:
      'A responsive weather dashboard with location-based forecasts, interactive maps, and severe weather alerts.',
    techStack: ['React', 'TypeScript', 'OpenWeather API', 'Chart.js', 'CSS Modules'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'project-4',
    title: 'DevOps Pipeline Tool',
    description:
      'A CI/CD pipeline visualization and management tool for monitoring deployments and build statuses.',
    techStack: ['React', 'Go', 'Docker', 'GitHub Actions', 'PostgreSQL'],
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    id: 'project-5',
    title: 'AI Chat Interface',
    description:
      'A modern chat interface for interacting with LLMs, supporting markdown rendering and conversation history.',
    techStack: ['React', 'TypeScript', 'Python', 'FastAPI', 'OpenAI API'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'project-6',
    title: 'Portfolio Website',
    description:
      'This very portfolio — a modern, responsive developer portfolio built with React, TypeScript, and Tailwind CSS.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    githubUrl: 'https://github.com',
    featured: false,
  },
];
