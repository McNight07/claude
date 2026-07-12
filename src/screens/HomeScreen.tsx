import React, { useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { Header } from '../components/home/Header';
import { SearchBar } from '../components/home/SearchBar';
import { QuickActions } from '../components/home/QuickActions';
import { FeaturedCareers } from '../components/home/FeaturedCareers';
import { ContinueLearning } from '../components/home/ContinueLearning';
import { RecommendedForYou } from '../components/home/RecommendedForYou';
import { CareerComparison } from '../components/home/CareerComparison';
import { Certifications } from '../components/home/Certifications';
import { LearningRoadmap } from '../components/home/LearningRoadmap';
import { DailyGoal } from '../components/home/DailyGoal';
import { TechNews } from '../components/home/TechNews';
import { SectionHeader } from '../components/SectionHeader';
import { useAppData } from '../context/AppDataContext';
import { useNews } from '../context/NewsContext';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { useTheme } from '../theme/ThemeProvider';
import { Career, Certification } from '../types';

const DAILY_GOAL_MINUTES = 30;

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const {
    careers,
    certifications,
    roadmaps,
    certProgress,
    roadmapProgress,
    quizResults,
    studyLog,
    isFavorite,
    toggleFavorite,
    getCertProgress,
    setCertProgressValue,
    logStudy,
  } = useAppData();
  const { news } = useNews();

  const featuredCareers = useMemo(() => careers.slice(0, 6), [careers]);

  const inProgressCerts = useMemo(
    () =>
      certProgress
        .filter((p) => p.progress > 0 && p.progress < 1)
        .map((p) => ({ certification: certifications.find((c) => c.id === p.certificationId), progress: p.progress }))
        .filter((x): x is { certification: Certification; progress: number } => !!x.certification),
    [certProgress, certifications]
  );

  const recommendedCerts = useMemo(() => {
    const startedIds = new Set(certProgress.map((p) => p.certificationId));
    const preferred = new Set(user?.preferredFields ?? []);
    const scored = certifications
      .filter((c) => !startedIds.has(c.id))
      .map((c) => {
        const matchesInterest = c.careerIds.some((id) => {
          const career = careers.find((k) => k.id === id);
          return career && preferred.has(career.industry);
        });
        return { cert: c, score: (matchesInterest ? 2 : 0) + (c.difficulty === 'Beginner' ? 1 : 0) };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.cert);
    return scored.slice(0, 4);
  }, [certifications, certProgress, careers, user?.preferredFields]);

  const activeRoadmap = useMemo(() => {
    if (roadmapProgress.length > 0) {
      const mostRecent = [...roadmapProgress].sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
      const roadmap = roadmaps.find((r) => r.id === mostRecent.roadmapId);
      if (roadmap) return { roadmap, completed: mostRecent.completedStepIds.length };
    }
    const topMatchCareerId = quizResults[0]?.matches[0]?.careerId;
    const suggested = topMatchCareerId ? roadmaps.find((r) => r.careerId === topMatchCareerId) : roadmaps[0];
    return suggested ? { roadmap: suggested, completed: 0 } : null;
  }, [roadmapProgress, roadmaps, quizResults]);

  const todayMinutes = useMemo(() => {
    const today = new Date().toDateString();
    return studyLog.filter((e) => new Date(e.date).toDateString() === today).reduce((sum, e) => sum + e.minutes, 0);
  }, [studyLog]);

  const handleQuickAction = (label: string) => {
    switch (label) {
      case 'Explore Careers':
        navigation.navigate('Tabs', { screen: 'Explore' });
        break;
      case 'Career Quiz':
        navigation.navigate('Quiz');
        break;
      case 'Learning Roadmap':
        navigation.navigate('Tabs', { screen: 'Learn', params: { segment: 'roadmaps' } });
        break;
      case 'Resume Builder':
        navigation.navigate('ComingSoon', {
          title: 'Resume Builder',
          description: 'Build, edit, and export a professional resume. Coming in a future update.',
          icon: 'file-text',
        });
        break;
    }
  };

  const handleLearnMore = (career: Career) => navigation.navigate('CareerDetail', { careerId: career.id });
  const handleContinueCert = (cert: Certification) => navigation.navigate('CertificationDetail', { certificationId: cert.id });
  const handleStartCert = (cert: Certification) => {
    if (!getCertProgress(cert.id)) setCertProgressValue(cert.id, 0.1);
    navigation.navigate('CertificationDetail', { certificationId: cert.id });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          name={user?.name ?? 'there'}
          hasNotifications
          onPressAvatar={() => navigation.navigate('Tabs', { screen: 'Profile' })}
          onPressNotifications={() => {}}
          onPressSearch={() => navigation.navigate('Tabs', { screen: 'Explore' })}
          onPressNews={() => navigation.navigate('News')}
        />

        <SearchBar onSubmit={(query) => navigation.navigate('Tabs', { screen: 'Explore', params: { query } })} />

        <QuickActions onPress={handleQuickAction} />

        <View>
          <SectionHeader
            title="Featured Careers"
            actionLabel="See all"
            onPressAction={() => navigation.navigate('Tabs', { screen: 'Explore' })}
          />
          <FeaturedCareers
            careers={featuredCareers}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onLearnMore={handleLearnMore}
          />
        </View>

        {inProgressCerts.length > 0 ? (
          <View>
            <SectionHeader
              title="Continue Learning"
              actionLabel="See all"
              onPressAction={() => navigation.navigate('Tabs', { screen: 'Learn' })}
            />
            <ContinueLearning items={inProgressCerts} onContinue={handleContinueCert} />
          </View>
        ) : null}

        {recommendedCerts.length > 0 ? (
          <View>
            <SectionHeader title="Recommended for You" />
            <RecommendedForYou items={recommendedCerts} onStart={handleStartCert} />
          </View>
        ) : null}

        <View>
          <SectionHeader title="Career Comparison" />
          <CareerComparison onCompare={() => navigation.navigate('Compare')} />
        </View>

        <View>
          <SectionHeader
            title="Certifications"
            actionLabel="See all"
            onPressAction={() => navigation.navigate('Tabs', { screen: 'Learn' })}
          />
          <Certifications
            items={certifications.slice(0, 8)}
            getProgress={(id) => getCertProgress(id)?.progress}
            onPress={handleContinueCert}
          />
        </View>

        {activeRoadmap ? (
          <View>
            <SectionHeader title="Learning Roadmap" />
            <LearningRoadmap
              roadmap={activeRoadmap.roadmap}
              completedSteps={activeRoadmap.completed}
              onViewRoadmap={() => navigation.navigate('RoadmapDetail', { roadmapId: activeRoadmap.roadmap.id })}
            />
          </View>
        ) : null}

        <View>
          <SectionHeader title="Daily Goal" />
          <DailyGoal
            goal={`Study ${DAILY_GOAL_MINUTES} minutes`}
            progress={todayMinutes / DAILY_GOAL_MINUTES}
            onLogStudy={() => logStudy(15)}
          />
        </View>

        <View>
          <SectionHeader
            title="Tech News"
            actionLabel="See all"
            onPressAction={() => navigation.navigate('News')}
          />
          <TechNews items={news.slice(0, 8)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
});
