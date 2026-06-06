export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  category: 'Frontend' | 'Full-Stack' | 'API' | 'Other';
  coverGradient: string;
  order: number;
}

export interface Skill {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Databases' | 'Tools';
  proficiency: number;
  icon: string;
  isPrimary: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; param: string }>;
}
