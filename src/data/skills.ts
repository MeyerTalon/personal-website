import type { Skill } from '../types';

export const skills: Skill[] = [
  // ML / AI
  { name: 'PyTorch', category: 'ML / AI' },
  { name: 'LangChain', category: 'ML / AI' },
  { name: 'HuggingFace', category: 'ML / AI' },
  { name: 'Databricks', category: 'ML / AI' },
  { name: 'YOLOv8', category: 'ML / AI' },
  { name: 'Computer Vision', category: 'ML / AI' },
  { name: 'LLMs / NLP', category: 'ML / AI' },

  // Languages
  { name: 'Python', category: 'Languages' },
  { name: 'JavaScript / TypeScript', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'C / C++', category: 'Languages' },
  { name: 'Rust', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'Dart', category: 'Languages' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Flutter', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },

  // Backend
  { name: 'FastAPI', category: 'Backend' },
  { name: 'SQLAlchemy', category: 'Backend' },
  { name: 'Pydantic', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'RabbitMQ', category: 'Backend' },
  { name: 'Keycloak', category: 'Backend' },

  // Infrastructure
  { name: 'AWS', category: 'Infrastructure' },
  { name: 'Docker', category: 'Infrastructure' },
  { name: 'PostgreSQL', category: 'Infrastructure' },
  { name: 'Git', category: 'Infrastructure' },
  { name: 'Vercel', category: 'Infrastructure' },
];

export const skillCategories = [
  'ML / AI',
  'Languages',
  'Frontend',
  'Backend',
  'Infrastructure',
] as const;
