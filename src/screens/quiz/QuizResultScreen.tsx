import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { ProgressBar } from '../../components/ProgressBar';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

export function QuizResultScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { quizResults, careers, roadmaps } = useAppData();
  const result = quizResults.find((r) => r.id === route.params.resultId);

  if (!result) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, padding: 20 }}>Quiz result not found.</Text>
      </SafeAreaView>
    );
  }

  const topMatch = result.matches[0];
  const topCareer = careers.find((c) => c.id === topMatch?.careerId);
  const topRoadmap = topCareer ? roadmaps.find((r) => r.careerId === topCareer.id) : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.flexList} contentContainerStyle={styles.list}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎯</Text>
          <Text style={[styles.title, { color: theme.text }]}>Your Career Matches</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Based on how you answered, here's how well each career fits your strengths and interests.
          </Text>

          {topCareer ? (
            <Card style={styles.topCard}>
              <Text style={[styles.topLabel, { color: theme.textMuted }]}>TOP MATCH</Text>
              <Text style={styles.topIcon}>{topCareer.icon}</Text>
              <Text style={[styles.topTitle, { color: theme.text }]}>{topCareer.title}</Text>
              <Text style={[styles.topPercent, { color: theme.teal }]}>{topMatch.matchPercent}% match</Text>
              <View style={styles.topButtons}>
                <GradientButton
                  label="View Career"
                  small
                  style={styles.topButton}
                  onPress={() => navigation.navigate('CareerDetail', { careerId: topCareer.id })}
                />
                {topRoadmap ? (
                  <GradientButton
                    label="View Roadmap"
                    small
                    colors={theme.gradientAccent}
                    style={styles.topButton}
                    onPress={() => navigation.navigate('RoadmapDetail', { roadmapId: topRoadmap.id })}
                  />
                ) : null}
              </View>
            </Card>
          ) : null}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>All Matches</Text>
        </View>

        {result.matches.map((item) => {
          const career = careers.find((c) => c.id === item.careerId);
          if (!career) return null;
          return (
            <TouchableOpacity
              key={item.careerId}
              onPress={() => navigation.navigate('CareerDetail', { careerId: career.id })}
              activeOpacity={0.85}
              style={styles.matchTouchable}
            >
              <Card style={styles.matchCard}>
                <Text style={styles.matchIcon}>{career.icon}</Text>
                <View style={styles.matchInfo}>
                  <Text style={[styles.matchTitle, { color: theme.text }]}>{career.title}</Text>
                  <ProgressBar progress={item.matchPercent / 100} />
                </View>
                <Text style={[styles.matchPercent, { color: theme.blue }]}>{item.matchPercent}%</Text>
                <Feather name="chevron-right" size={18} color={theme.textFaint} />
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingVertical: 8 },
  flexList: { flex: 1 },
  list: { padding: 20, gap: 12 },
  matchTouchable: { width: '100%' },
  header: { gap: 8, marginBottom: 8 },
  headerIcon: { fontSize: 36, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 13.5, textAlign: 'center', lineHeight: 19, marginBottom: 8 },
  topCard: { alignItems: 'center', gap: 4, marginBottom: 12 },
  topLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  topIcon: { fontSize: 36 },
  topTitle: { fontSize: 18, fontWeight: '800' },
  topPercent: { fontSize: 14, fontWeight: '700' },
  topButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  topButton: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  matchCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  matchIcon: { fontSize: 24 },
  matchInfo: { flex: 1, gap: 6 },
  matchTitle: { fontSize: 14.5, fontWeight: '700' },
  matchPercent: { fontSize: 14, fontWeight: '800' },
});
