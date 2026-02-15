import type { Experience, Education } from '../types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Tech Company',
    role: 'Senior Software Engineer',
    startDate: 'Jan 2024',
    endDate: 'Present',
    description: [
      'Led development of a microservices architecture serving 100k+ daily active users',
      'Mentored a team of 4 junior developers, conducting code reviews and pair programming sessions',
      'Reduced API response times by 40% through database query optimization and caching strategies',
      'Implemented CI/CD pipelines that decreased deployment time from hours to minutes',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    id: 'exp-2',
    company: 'Startup Inc.',
    role: 'Full Stack Developer',
    startDate: 'Jun 2022',
    endDate: 'Dec 2023',
    description: [
      'Built and launched a customer-facing SaaS platform from concept to production',
      'Designed and implemented RESTful APIs handling 50k+ requests per day',
      'Developed real-time collaboration features using WebSocket technology',
      'Collaborated with UX designers to implement responsive, accessible UI components',
    ],
    techStack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'MongoDB', 'Redis'],
  },
  {
    id: 'exp-3',
    company: 'Digital Agency',
    role: 'Frontend Developer',
    startDate: 'Aug 2020',
    endDate: 'May 2022',
    description: [
      'Developed responsive web applications for diverse clients across multiple industries',
      'Migrated legacy jQuery applications to modern React architecture',
      'Implemented comprehensive unit and integration testing, achieving 90%+ code coverage',
      'Optimized web performance resulting in 50% improvement in Lighthouse scores',
    ],
    techStack: ['React', 'JavaScript', 'Vue.js', 'Tailwind CSS', 'GraphQL'],
  },
];

export const education: Education[] = [
  {
    id: 'edu-1',
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2016',
    endDate: '2020',
    description:
      'Graduated with honors. Focused on software engineering, algorithms, and distributed systems.',
  },
];
