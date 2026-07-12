export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Demand = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Career {
  id: string;
  title: string;
  icon: string;
  avgSalary: string;
  demand: Demand;
  difficulty: Difficulty;
}

export interface LearningItem {
  id: string;
  title: string;
  provider: string;
  progress: number;
}

export interface Recommendation {
  id: string;
  title: string;
  icon: string;
  estimatedTime: string;
  difficulty: Difficulty;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  difficulty: Difficulty;
  duration: string;
  progress?: number;
}

export interface NewsItem {
  id: string;
  category: 'AI' | 'Cybersecurity' | 'Cloud' | 'Networking' | 'Programming';
  title: string;
  source: string;
  timeAgo: string;
}

export interface RoadmapStage {
  id: string;
  label: string;
  status: 'done' | 'active' | 'upcoming';
}
