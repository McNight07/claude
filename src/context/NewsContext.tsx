import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NewsItem, techNews } from '../data/news';
import { getDoc, setDoc } from '../db/localDb';
import { fetchLatestTechNews } from '../services/hackerNewsService';

const CACHE_COLLECTION = 'newsCache';
const CACHE_DOC_ID = 'latest';
const STALE_AFTER_MS = 15 * 60 * 1000;
const AUTO_REFRESH_MS = 15 * 60 * 1000;

interface NewsCacheRecord {
  items: NewsItem[];
  fetchedAt: string;
}

interface NewsContextValue {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isLive: boolean;
  refresh: () => Promise<void>;
}

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(techNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const loadingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const items = await fetchLatestTechNews(24);
      const fetchedAt = new Date().toISOString();
      setNews(items);
      setLastUpdated(fetchedAt);
      setIsLive(true);
      setError(null);
      await setDoc<NewsCacheRecord>(CACHE_COLLECTION, CACHE_DOC_ID, { items, fetchedAt });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the news feed.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await getDoc<NewsCacheRecord>(CACHE_COLLECTION, CACHE_DOC_ID);
      if (cached) {
        setNews(cached.items);
        setLastUpdated(cached.fetchedAt);
        setIsLive(true);
      }
      const isStale = !cached || Date.now() - new Date(cached.fetchedAt).getTime() > STALE_AFTER_MS;
      if (isStale) refresh();
    })();

    const interval = setInterval(refresh, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const value: NewsContextValue = { news, loading, error, lastUpdated, isLive, refresh };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews(): NewsContextValue {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNews must be used within a NewsProvider');
  return ctx;
}
