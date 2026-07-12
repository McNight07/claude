export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Demand = 'Low' | 'Medium' | 'High' | 'Very High';

export interface SalaryRange {
  entry: number;
  average: number;
  senior: number;
}

export interface ResourceLink {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Course' | 'Book' | 'Lab' | 'Docs' | 'Practice Exam' | 'GitHub';
  url: string;
  free: boolean;
}

export interface Career {
  id: string;
  title: string;
  icon: string;
  industry: string;
  description: string;
  salary: SalaryRange;
  jobOutlook: string;
  demand: Demand;
  difficulty: Difficulty;
  educationRequired: string;
  skillsRequired: string[];
  certificationIds: string[];
  dailyTasks: string[];
  workEnvironment: string;
  careerGrowth: string;
  remote: boolean;
  resources: ResourceLink[];
  traits: TraitVector;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  vendor: string;
  description: string;
  examCost: number;
  difficulty: Difficulty;
  durationWeeks: number;
  prerequisites: string[];
  examObjectives: string[];
  studyResources: ResourceLink[];
  practiceTests: ResourceLink[];
  careerIds: string[];
}

export interface RoadmapStep {
  id: string;
  label: string;
  description: string;
  type: 'topic' | 'certification' | 'project';
  certificationId?: string;
  estimatedWeeks: number;
  resources: ResourceLink[];
}

export interface RoadmapPath {
  id: string;
  title: string;
  description: string;
  careerId: string;
  level: Difficulty;
  steps: RoadmapStep[];
}

export type QuizDimension =
  | 'interests'
  | 'problemSolving'
  | 'creativity'
  | 'analytical'
  | 'communication'
  | 'leadership'
  | 'math'
  | 'programming'
  | 'workStyle'
  | 'environment';

export type TraitVector = Partial<Record<QuizDimension, number>>;

export interface QuizOption {
  id: string;
  label: string;
  weights: TraitVector;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  dimension: QuizDimension;
  options: QuizOption[];
}

export interface QuizMatch {
  careerId: string;
  matchPercent: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  takenAt: string;
  traits: TraitVector;
  matches: QuizMatch[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUri?: string;
  experienceLevel?: Difficulty;
  interests: string[];
  preferredFields: string[];
  createdAt: string;
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  careerId: string;
  createdAt: string;
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  certificationId: string;
  createdAt: string;
}

export interface CertificationProgress {
  id: string;
  userId: string;
  certificationId: string;
  progress: number;
  examDate?: string;
  completedAt?: string;
}

export interface RoadmapProgress {
  id: string;
  userId: string;
  roadmapId: string;
  completedStepIds: string[];
  startedAt: string;
}

export interface StudyLogEntry {
  id: string;
  userId: string;
  date: string;
  minutes: number;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}
