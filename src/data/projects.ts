import type { Project } from '../types/index';

export const projects: Project[] = [
  {
    id: 'mymodels',
    title: 'mymodels',
    description:
      'personal pytorch models from scratch. currently a gpt-style decoder-only transformer trained on wikipedia for sentence completion, with bpe tokenization, training, and inference pipelines.',
    techStack: ['Python', 'PyTorch', 'Hugging Face', 'tokenizers', 'uv'],
    githubUrl: 'https://github.com/MeyerTalon/mymodels',
    featured: true,
  },
  {
    id: 'catan-bot',
    title: 'catan-bot',
    description:
      'full-stack catan app with fastapi, supabase postgres, and react (vite) on vercel. includes an llm-driven bot to choose moves from structured game state. [in progress]',
    techStack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Supabase', 'Docker', 'Vercel'],
    githubUrl: 'https://github.com/MeyerTalon/catan-bot',
    featured: true,
  },
  {
    id: 'ai-teacher',
    title: 'ai-teacher',
    description:
      'an ai teacher specializing in teaching disadvantaged kids basic math skills using humanistic conversational ai. client-server web app built with react.',
    techStack: ['JavaScript', 'React', 'CSS'],
    githubUrl: 'https://github.com/MeyerTalon/ai-teacher',
    featured: true,
  },
  {
    id: 'quantum-singular-value-transform',
    title: 'quantum singular value transform',
    description:
      'python implementation of quantum linear system solving using the qsvt framework. implements matrix inversion via polynomial transformation of singular values with pennylane and pyqsp.',
    techStack: ['Python', 'PennyLane', 'pyqsp', 'Jupyter'],
    githubUrl: 'https://github.com/MeyerTalon/quantum-singular-value-transform',
    featured: true,
  },
  {
    id: 'geo-dash-rl',
    title: 'geo-dash-rl',
    description:
      'reinforcement learning and automation for geometry dash. uses tesseract ocr for on-screen state and a custom built RL model for decision-making. [in progress]',
    techStack: ['Python', 'PyTorch', 'Jupyter'],
    githubUrl: 'https://github.com/MeyerTalon/geo-dash-rl',
    featured: false,
  },
  {
    id: 'auto-insta',
    title: 'autoinsta',
    description:
      'web app to schedule and automate instagram posts. users create posts, set upload times, and manage upcoming and past scheduled posts.',
    techStack: ['Node.js', 'Apollo', 'GraphQL', 'Express', 'Mongoose'],
    githubUrl: 'https://github.com/MeyerTalon/AutoInsta',
    featured: false,
  },
];
