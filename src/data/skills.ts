import type { Skill } from '../types';

export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'Go', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'HTML/CSS', category: 'Languages' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'React Native', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'WebSocket', category: 'Backend' },

  // Databases
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'Prisma', category: 'Databases' },

  // DevOps
  { name: 'Docker', category: 'DevOps' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'GitHub Actions', category: 'DevOps' },
  { name: 'Vercel', category: 'DevOps' },
  { name: 'Linux', category: 'DevOps' },

  // Tools
  { name: 'Git', category: 'Tools' },
  { name: 'VS Code', category: 'Tools' },
  { name: 'Figma', category: 'Tools' },
  { name: 'Jira', category: 'Tools' },
  { name: 'Postman', category: 'Tools' },
];

export const skillCategories = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'DevOps',
  'Tools',
] as const;
