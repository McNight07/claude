import { NewsCategory, NewsItem } from '../data/news';

const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const itemUrl = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

interface HnItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  descendants?: number;
  time?: number;
  type?: string;
  deleted?: boolean;
  dead?: boolean;
}

const CATEGORY_KEYWORDS: Array<[NewsCategory, RegExp]> = [
  ['AI', /\b(ai|artificial intelligence|llm|gpt|machine learning|neural|chatgpt|claude|gemini)\b/i],
  ['Cybersecurity', /\b(security|breach|hack|vulnerab|exploit|malware|ransomware|cve|phishing)\b/i],
  ['Cloud', /\b(cloud|aws|azure|gcp|kubernetes|serverless)\b/i],
  ['Networking', /\b(network|wifi|5g|dns|protocol|router|bandwidth)\b/i],
  ['Programming', /\b(programming|language|framework|library|compiler|open.?source|github|code|developer|api)\b/i],
  ['Business', /\b(startup|funding|acquir|ipo|layoff|valuation|revenue)\b/i],
];

function classify(title: string): NewsCategory {
  for (const [category, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(title)) return category;
  }
  return 'Other';
}

function timeAgo(unixSeconds: number): string {
  const diffMs = Date.now() - unixSeconds * 1000;
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function toNewsItem(item: HnItem | null): NewsItem | null {
  if (!item || item.deleted || item.dead || !item.title) return null;
  const url = item.url ?? `https://news.ycombinator.com/item?id=${item.id}`;
  let domain = 'news.ycombinator.com';
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    // keep default
  }
  return {
    id: String(item.id),
    category: classify(item.title),
    title: item.title,
    source: domain,
    timeAgo: timeAgo(item.time ?? Date.now() / 1000),
    url,
    points: item.score ?? 0,
    commentsCount: item.descendants ?? 0,
    publishedAt: new Date((item.time ?? Date.now() / 1000) * 1000).toISOString(),
  };
}

export async function fetchLatestTechNews(limit = 24): Promise<NewsItem[]> {
  const idsRes = await fetch(TOP_STORIES_URL);
  if (!idsRes.ok) throw new Error(`Hacker News request failed (${idsRes.status})`);
  const ids: number[] = await idsRes.json();

  const candidates = ids.slice(0, limit * 2);
  const items = await Promise.all(
    candidates.map(async (id) => {
      try {
        const res = await fetch(itemUrl(id));
        if (!res.ok) return null;
        return (await res.json()) as HnItem;
      } catch {
        return null;
      }
    })
  );

  return items
    .map(toNewsItem)
    .filter((item): item is NewsItem => item !== null)
    .slice(0, limit);
}
