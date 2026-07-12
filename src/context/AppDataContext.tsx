import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getCollection, newId, setDoc, deleteDoc, updateDoc } from '../db/localDb';
import { seedDatabase } from '../db/seed';
import {
  BookmarkRecord,
  Career,
  Certification,
  CertificationProgress,
  FavoriteRecord,
  QuizMatch,
  QuizQuestion,
  QuizResult,
  RoadmapPath,
  RoadmapProgress,
  StudyLogEntry,
  TraitVector,
} from '../types';

interface AppDataContextValue {
  careers: Career[];
  certifications: Certification[];
  roadmaps: RoadmapPath[];
  quizQuestions: QuizQuestion[];
  loading: boolean;

  favorites: FavoriteRecord[];
  isFavorite: (careerId: string) => boolean;
  toggleFavorite: (careerId: string) => Promise<void>;

  bookmarks: BookmarkRecord[];
  isBookmarked: (certificationId: string) => boolean;
  toggleBookmark: (certificationId: string) => Promise<void>;

  certProgress: CertificationProgress[];
  getCertProgress: (certificationId: string) => CertificationProgress | undefined;
  setCertProgressValue: (certificationId: string, progress: number) => Promise<void>;
  setCertExamDate: (certificationId: string, examDate: string | undefined) => Promise<void>;

  roadmapProgress: RoadmapProgress[];
  getRoadmapProgress: (roadmapId: string) => RoadmapProgress | undefined;
  toggleRoadmapStep: (roadmapId: string, stepId: string) => Promise<void>;

  quizResults: QuizResult[];
  latestQuizResult: QuizResult | null;
  saveQuizResult: (traits: TraitVector, matches: QuizMatch[]) => Promise<QuizResult>;

  studyLog: StudyLogEntry[];
  logStudy: (minutes: number, note?: string) => Promise<void>;

  compareIds: string[];
  toggleCompare: (careerId: string) => void;
  clearCompare: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [careers, setCareers] = useState<Career[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapPath[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [certProgress, setCertProgress] = useState<CertificationProgress[]>([]);
  const [roadmapProgress, setRoadmapProgress] = useState<RoadmapProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [studyLog, setStudyLog] = useState<StudyLogEntry[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      await seedDatabase();
      const [c, cert, rm, qq] = await Promise.all([
        getCollection<Career>('careers'),
        getCollection<Certification>('certifications'),
        getCollection<RoadmapPath>('roadmaps'),
        getCollection<QuizQuestion>('quizQuestions'),
      ]);
      setCareers(c);
      setCertifications(cert);
      setRoadmaps(rm);
      setQuizQuestions(qq);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setBookmarks([]);
      setCertProgress([]);
      setRoadmapProgress([]);
      setQuizResults([]);
      setStudyLog([]);
      setCompareIds([]);
      return;
    }
    (async () => {
      const [fav, bm, cp, rp, qr, sl] = await Promise.all([
        getCollection<FavoriteRecord>('favorites'),
        getCollection<BookmarkRecord>('bookmarks'),
        getCollection<CertificationProgress>('certProgress'),
        getCollection<RoadmapProgress>('roadmapProgress'),
        getCollection<QuizResult>('quizResults'),
        getCollection<StudyLogEntry>('studyLog'),
      ]);
      setFavorites(fav.filter((r) => r.userId === userId));
      setBookmarks(bm.filter((r) => r.userId === userId));
      setCertProgress(cp.filter((r) => r.userId === userId));
      setRoadmapProgress(rp.filter((r) => r.userId === userId));
      setQuizResults(qr.filter((r) => r.userId === userId).sort((a, b) => b.takenAt.localeCompare(a.takenAt)));
      setStudyLog(sl.filter((r) => r.userId === userId));
    })();
  }, [userId]);

  const isFavorite = useCallback((careerId: string) => favorites.some((f) => f.careerId === careerId), [favorites]);

  const toggleFavorite = useCallback(
    async (careerId: string) => {
      if (!userId) return;
      const existing = favorites.find((f) => f.careerId === careerId);
      if (existing) {
        await deleteDoc('favorites', existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const record: FavoriteRecord = { id: newId('fav'), userId, careerId, createdAt: new Date().toISOString() };
        await setDoc('favorites', record.id, record);
        setFavorites((prev) => [...prev, record]);
      }
    },
    [favorites, userId]
  );

  const isBookmarked = useCallback(
    (certificationId: string) => bookmarks.some((b) => b.certificationId === certificationId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (certificationId: string) => {
      if (!userId) return;
      const existing = bookmarks.find((b) => b.certificationId === certificationId);
      if (existing) {
        await deleteDoc('bookmarks', existing.id);
        setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
      } else {
        const record: BookmarkRecord = { id: newId('bm'), userId, certificationId, createdAt: new Date().toISOString() };
        await setDoc('bookmarks', record.id, record);
        setBookmarks((prev) => [...prev, record]);
      }
    },
    [bookmarks, userId]
  );

  const getCertProgress = useCallback(
    (certificationId: string) => certProgress.find((p) => p.certificationId === certificationId),
    [certProgress]
  );

  const upsertCertProgress = useCallback(
    async (certificationId: string, patch: Partial<CertificationProgress>) => {
      if (!userId) return;
      const existing = certProgress.find((p) => p.certificationId === certificationId);
      if (existing) {
        const updated = await updateDoc<CertificationProgress>('certProgress', existing.id, patch);
        setCertProgress((prev) => prev.map((p) => (p.id === existing.id ? updated : p)));
      } else {
        const record: CertificationProgress = {
          id: newId('cp'),
          userId,
          certificationId,
          progress: 0,
          ...patch,
        };
        await setDoc('certProgress', record.id, record);
        setCertProgress((prev) => [...prev, record]);
      }
    },
    [certProgress, userId]
  );

  const setCertProgressValue = useCallback(
    (certificationId: string, progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      return upsertCertProgress(certificationId, {
        progress: clamped,
        completedAt: clamped >= 1 ? new Date().toISOString() : undefined,
      });
    },
    [upsertCertProgress]
  );

  const setCertExamDate = useCallback(
    (certificationId: string, examDate: string | undefined) => upsertCertProgress(certificationId, { examDate }),
    [upsertCertProgress]
  );

  const getRoadmapProgress = useCallback(
    (roadmapId: string) => roadmapProgress.find((r) => r.roadmapId === roadmapId),
    [roadmapProgress]
  );

  const toggleRoadmapStep = useCallback(
    async (roadmapId: string, stepId: string) => {
      if (!userId) return;
      const existing = roadmapProgress.find((r) => r.roadmapId === roadmapId);
      if (!existing) {
        const record: RoadmapProgress = {
          id: newId('rp'),
          userId,
          roadmapId,
          completedStepIds: [stepId],
          startedAt: new Date().toISOString(),
        };
        await setDoc('roadmapProgress', record.id, record);
        setRoadmapProgress((prev) => [...prev, record]);
        return;
      }
      const hasStep = existing.completedStepIds.includes(stepId);
      const completedStepIds = hasStep
        ? existing.completedStepIds.filter((id) => id !== stepId)
        : [...existing.completedStepIds, stepId];
      const updated = await updateDoc<RoadmapProgress>('roadmapProgress', existing.id, { completedStepIds });
      setRoadmapProgress((prev) => prev.map((r) => (r.id === existing.id ? updated : r)));
    },
    [roadmapProgress, userId]
  );

  const saveQuizResult = useCallback(
    async (traits: TraitVector, matches: QuizMatch[]) => {
      if (!userId) throw new Error('Must be signed in to save quiz results.');
      const record: QuizResult = {
        id: newId('quiz'),
        userId,
        takenAt: new Date().toISOString(),
        traits,
        matches,
      };
      await setDoc('quizResults', record.id, record);
      setQuizResults((prev) => [record, ...prev]);
      return record;
    },
    [userId]
  );

  const logStudy = useCallback(
    async (minutes: number, note?: string) => {
      if (!userId) return;
      const record: StudyLogEntry = {
        id: newId('log'),
        userId,
        date: new Date().toISOString(),
        minutes,
        note,
      };
      await setDoc('studyLog', record.id, record);
      setStudyLog((prev) => [record, ...prev]);
    },
    [userId]
  );

  const toggleCompare = useCallback((careerId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(careerId)) return prev.filter((id) => id !== careerId);
      if (prev.length >= 3) return prev;
      return [...prev, careerId];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      careers,
      certifications,
      roadmaps,
      quizQuestions,
      loading,
      favorites,
      isFavorite,
      toggleFavorite,
      bookmarks,
      isBookmarked,
      toggleBookmark,
      certProgress,
      getCertProgress,
      setCertProgressValue,
      setCertExamDate,
      roadmapProgress,
      getRoadmapProgress,
      toggleRoadmapStep,
      quizResults,
      latestQuizResult: quizResults[0] ?? null,
      saveQuizResult,
      studyLog,
      logStudy,
      compareIds,
      toggleCompare,
      clearCompare,
    }),
    [
      careers,
      certifications,
      roadmaps,
      quizQuestions,
      loading,
      favorites,
      isFavorite,
      toggleFavorite,
      bookmarks,
      isBookmarked,
      toggleBookmark,
      certProgress,
      getCertProgress,
      setCertProgressValue,
      setCertExamDate,
      roadmapProgress,
      getRoadmapProgress,
      toggleRoadmapStep,
      quizResults,
      saveQuizResult,
      studyLog,
      logStudy,
      compareIds,
      toggleCompare,
      clearCompare,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
