import {
  Career,
  Certification,
  LearningItem,
  NewsItem,
  Recommendation,
  RoadmapStage,
} from '../types';

export const featuredCareers: Career[] = [
  { id: 'sw-dev', title: 'Software Developer', icon: '💻', avgSalary: '$110k', demand: 'Very High', difficulty: 'Intermediate' },
  { id: 'sec-analyst', title: 'Cybersecurity Analyst', icon: '🛡️', avgSalary: '$102k', demand: 'Very High', difficulty: 'Intermediate' },
  { id: 'net-eng', title: 'Network Engineer', icon: '📡', avgSalary: '$95k', demand: 'High', difficulty: 'Intermediate' },
  { id: 'cloud-eng', title: 'Cloud Engineer', icon: '☁️', avgSalary: '$125k', demand: 'Very High', difficulty: 'Advanced' },
  { id: 'data-analyst', title: 'Data Analyst', icon: '📊', avgSalary: '$85k', demand: 'High', difficulty: 'Beginner' },
  { id: 'ai-eng', title: 'AI Engineer', icon: '🤖', avgSalary: '$145k', demand: 'Very High', difficulty: 'Advanced' },
  { id: 'devops', title: 'DevOps Engineer', icon: '⚙️', avgSalary: '$130k', demand: 'High', difficulty: 'Advanced' },
  { id: 'uxui', title: 'UX/UI Designer', icon: '🎨', avgSalary: '$92k', demand: 'Medium', difficulty: 'Beginner' },
];

export const continueLearning: LearningItem[] = [
  { id: 'ccna', title: 'Cisco CCNA', provider: 'Networking', progress: 0.65 },
  { id: 'aplus', title: 'CompTIA A+', provider: 'IT Fundamentals', progress: 0.4 },
  { id: 'secplus', title: 'Security+', provider: 'Cybersecurity', progress: 0.2 },
  { id: 'aws-cp', title: 'AWS Cloud Practitioner', provider: 'Cloud', progress: 0.1 },
];

export const recommendations: Recommendation[] = [
  { id: 'networking', title: 'Learn Networking', icon: '📡', estimatedTime: '3h 20m', difficulty: 'Beginner' },
  { id: 'cybersecurity', title: 'Start Cybersecurity', icon: '🛡️', estimatedTime: '4h 10m', difficulty: 'Beginner' },
  { id: 'cloud', title: 'Cloud Fundamentals', icon: '☁️', estimatedTime: '2h 45m', difficulty: 'Intermediate' },
  { id: 'python', title: 'Python for Beginners', icon: '🐍', estimatedTime: '5h', difficulty: 'Beginner' },
];

export const certifications: Certification[] = [
  { id: 'aplus', code: 'A+', name: 'CompTIA A+', difficulty: 'Beginner', duration: '6 weeks', progress: 0.4 },
  { id: 'netplus', code: 'N+', name: 'Network+', difficulty: 'Beginner', duration: '5 weeks' },
  { id: 'secplus', code: 'S+', name: 'Security+', difficulty: 'Intermediate', duration: '6 weeks', progress: 0.2 },
  { id: 'ccna', code: 'CCNA', name: 'CCNA', difficulty: 'Intermediate', duration: '8 weeks', progress: 0.65 },
  { id: 'aws', code: 'AWS', name: 'AWS Cloud Practitioner', difficulty: 'Beginner', duration: '4 weeks', progress: 0.1 },
  { id: 'azure', code: 'AZ', name: 'Azure Fundamentals', difficulty: 'Beginner', duration: '4 weeks' },
  { id: 'google-it', code: 'GIT', name: 'Google IT Support', difficulty: 'Beginner', duration: '6 weeks' },
];

export const roadmapStages: RoadmapStage[] = [
  { id: 'beginner', label: 'Beginner', status: 'done' },
  { id: 'intermediate', label: 'Intermediate', status: 'active' },
  { id: 'advanced', label: 'Advanced', status: 'upcoming' },
  { id: 'professional', label: 'Professional', status: 'upcoming' },
];

export const techNews: NewsItem[] = [
  { id: 'n1', category: 'AI', title: 'AI agents are reshaping how teams ship software', source: 'TechDaily', timeAgo: '2h ago' },
  { id: 'n2', category: 'Cybersecurity', title: 'New phishing techniques target remote workers', source: 'SecWatch', timeAgo: '4h ago' },
  { id: 'n3', category: 'Cloud', title: 'Multi-cloud strategies gain traction in 2026', source: 'CloudWire', timeAgo: '6h ago' },
  { id: 'n4', category: 'Networking', title: 'What the next-gen Wi-Fi standard means for IT', source: 'NetPulse', timeAgo: '8h ago' },
  { id: 'n5', category: 'Programming', title: 'Why typed languages keep winning enterprise teams', source: 'DevBrief', timeAgo: '10h ago' },
];
