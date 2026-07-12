import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useTheme } from '../theme/ThemeProvider';
import {
  certifications,
  continueLearning,
  featuredCareers,
  recommendations,
  roadmapStages,
  techNews,
} from '../data/mockData';

export function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header name="Alex" hasNotifications />

        <SearchBar />

        <QuickActions />

        <View>
          <SectionHeader title="Featured Careers" actionLabel="See all" />
          <FeaturedCareers careers={featuredCareers} />
        </View>

        <View>
          <SectionHeader title="Continue Learning" actionLabel="See all" />
          <ContinueLearning items={continueLearning} />
        </View>

        <View>
          <SectionHeader title="Recommended for You" />
          <RecommendedForYou items={recommendations} />
        </View>

        <View>
          <SectionHeader title="Career Comparison" />
          <CareerComparison />
        </View>

        <View>
          <SectionHeader title="Certifications" actionLabel="See all" />
          <Certifications items={certifications} />
        </View>

        <View>
          <SectionHeader title="Learning Roadmap" />
          <LearningRoadmap stages={roadmapStages} />
        </View>

        <View>
          <SectionHeader title="Daily Goal" />
          <DailyGoal goal="Complete one networking lesson" progress={0.7} />
        </View>

        <View>
          <SectionHeader title="Tech News" actionLabel="See all" />
          <TechNews items={techNews} />
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
