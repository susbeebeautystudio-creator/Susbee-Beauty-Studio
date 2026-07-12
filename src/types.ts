export interface BlogPost {
  id: string;
  cat: 'skincare' | 'makeup' | 'hair' | 'bridal' | 'nails';
  catLabel: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  body: string;
  emoji: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  description: string;
  skills: string[];
  emoji: string;
  colorClass: string;
}

export interface Course {
  id: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  duration: string;
  timing: string;
  hasCertificate: boolean;
  price: string;
  features: string[];
}

export interface Review {
  stars: number;
  text: string;
  author: string;
  location: string;
}

export interface Transformation {
  id: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  tags: string[];
}
