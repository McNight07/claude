export interface NewsItem {
  id: string;
  category: 'AI' | 'Cybersecurity' | 'Cloud' | 'Networking' | 'Programming';
  title: string;
  source: string;
  timeAgo: string;
}

export const techNews: NewsItem[] = [
  { id: 'n1', category: 'AI', title: 'AI agents are reshaping how teams ship software', source: 'TechDaily', timeAgo: '2h ago' },
  { id: 'n2', category: 'Cybersecurity', title: 'New phishing techniques target remote workers', source: 'SecWatch', timeAgo: '4h ago' },
  { id: 'n3', category: 'Cloud', title: 'Multi-cloud strategies gain traction in 2026', source: 'CloudWire', timeAgo: '6h ago' },
  { id: 'n4', category: 'Networking', title: 'What the next-gen Wi-Fi standard means for IT', source: 'NetPulse', timeAgo: '8h ago' },
  { id: 'n5', category: 'Programming', title: 'Why typed languages keep winning enterprise teams', source: 'DevBrief', timeAgo: '10h ago' },
];
