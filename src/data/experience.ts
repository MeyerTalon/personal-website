import type { Experience, Education } from '../types/index';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Rippling',
    role: 'Machine Learning Engineer',
    startDate: 'Aug 2025',
    endDate: 'Dec 2025',
    description: [
      'co-led a team of six developers to create an ai-driven expense report evaluation workflow.',
      'built and deployed an end-to-end llm pipeline in databricks to parse, embed, and interpret policy documents using langchain orchestration and a custom semantic chunking algorithm.',
      'automated expense-policy validation workflows, reducing manual review workload by approximately 60%.',
    ],
    techStack: ['Python', 'LangChain', 'Databricks', 'LLMs'],
  },
  {
    id: 'exp-2',
    company: 'Adaptive Launch Solutions',
    role: 'Software Engineer',
    startDate: 'Sep 2023',
    endDate: 'Present',
    description: [
      'developed ivy, a multi-modal ml-powered platform for systems engineers that optimizes the systems engineering workflow, reducing labor cost by 20%.',
      'contributed to a scalable backend using python (fastapi, sqlalchemy, pydantic) and postgresql, an intuitive frontend built with flutter, secure auth with keycloak, and deployment on aws.',
      'led client-facing demos and contributed to marketing and business development efforts.',
    ],
    techStack: ['Python', 'FastAPI', 'Flutter', 'PostgreSQL', 'AWS', 'Keycloak'],
  },
];

export const research: Experience[] = [
  {
    id: 'res-1',
    company: 'B.E.S.T. Lab, UC Berkeley',
    role: 'Research — Computer Vision',
    startDate: 'Aug 2025',
    endDate: 'Present',
    description: [
      'collaborating with a multidisciplinary team and squishy robotics to develop computer vision models for detecting and attributing methane gas leak sources in oil and gas infrastructure.',
      'built a methane gas plume dataset by applying background subtraction, frame extraction, bounding box annotation, and image augmentation on the gasvid dataset.',
      'fine-tuned yolov8s for plume localization and leak source detection, achieving map50: 0.995 and map50-95: 0.985.',
    ],
    techStack: ['PyTorch', 'YOLOv8', 'Computer Vision', 'Python'],
  },
  {
    id: 'res-2',
    company: 'BAIR — Speech Group',
    role: 'Research — LLM Reasoning',
    startDate: 'May 2025',
    endDate: 'Aug 2025',
    description: [
      'evaluated llms on the pokerbench dataset to examine their reasoning and decision-making capabilities in high-variance, imperfect-information games.',
      'integrated a discounted cfr poker solver with the llm pipeline to enhance overall performance.',
      'developed a rust algorithm that generates complete game trees for any poker variant, output in a json format readable by llms.',
    ],
    techStack: ['Python', 'Rust', 'LLMs', 'PyTorch'],
  },
];

export const leadership: Experience[] = [
  {
    id: 'lead-1',
    company: 'Generative AI at Berkeley',
    role: 'President',
    startDate: 'Jan 2025',
    endDate: 'Present',
    description: [
      'scaled and led the largest student organization in the u.s. focused on generative ai, overseeing strategy, operations, and cross-functional teams.',
      'built industry partnerships with google, netflix, rippling, coffeespace, and more for collaborative technical projects and speaker events.',
      'recruited, mentored, and managed a leadership team across marketing, project management, recruitment, and outreach.',
    ],
  },
];

export const education: Education[] = [
  {
    id: 'edu-1',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field: 'Electrical Engineering and Computer Science',
    startDate: '2024',
    endDate: '2026',
    description: 'gpa: 3.8. focused on machine learning, ai systems, and software engineering.',
  },
  {
    id: 'edu-2',
    institution: 'MiraCosta College',
    degree: 'Associate of Science',
    field: 'Computer Science and Mathematics',
    startDate: '2022',
    endDate: '2024',
    description: 'gpa: 4.0.',
  },
];
