export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    image?: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
  }
  
  export interface Skill {
    name: string;
    category: SkillCategory;
    icon?: string;
  }
  
  export type SkillCategory =
    | 'ML / AI'
    | 'DevOps'
    | 'Languages'
    | 'Frontend'
    | 'Backend'
    | 'Infrastructure';
  
  export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[];
    techStack?: string[];
  }
  
  export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
  }
  
  export interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  export interface NavItem {
    label: string;
    path: string;
  }

  export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
  }

  export interface Letter {
    id: string;
    title: string;
    date: string;
    /** Plain text body. Use blank lines for paragraphs. */
    content?: string;
    /** Optional scanned/handwritten letter image (imported asset URL). */
    image?: string;
  }
  
  export type Theme = 'light' | 'dark';