import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../theme/ThemeProvider';
import { Achievement } from '../../types';

function dateKey(iso: string) {
  return new Date(iso).toDateString();
}

function computeStreak(dates: string[]): number {
  const uniqueDays = Array.from(new Set(dates.map(dateKey))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  if (uniqueDays.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mostRecent = new Date(uniqueDays[0]);
  mostRecent.setHours(0, 0, 0, 0);
  const gapFromToday = Math.round((today.getTime() - mostRecent.getTime()) / 86400000);
  if (gapFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function last7DaysMinutes(entries: { date: string; minutes: number }[]) {
  const days: { label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayEntries = entries.filter((e) => dateKey(e.date) === d.toDateString());
    const minutes = dayEntries.reduce((sum, e) => sum + e.minutes, 0);
    days.push({ label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), minutes });
  }
  return days;
}

export function ProgressScreen() {
  const theme = useTheme();
  const { certProgress, roadmapProgress, roadmaps, quizResults, studyLog, logStudy } = useAppData();

  const completedCerts = certProgress.filter((c) => c.progress >= 1).length;
  const inProgressCerts = certProgress.filter((c) => c.progress > 0 && c.progress < 1).length;
  const totalRoadmapSteps = roadmaps.reduce((sum, r) => sum + r.steps.length, 0);
  const completedRoadmapSteps = roadmapProgress.reduce((sum, r) => sum + r.completedStepIds.length, 0);
  const totalMinutes = studyLog.reduce((sum, e) => sum + e.minutes, 0);
  const streak = useMemo(() => computeStreak(studyLog.map((e) => e.date)), [studyLog]);
  const weekly = useMemo(() => last7DaysMinutes(studyLog), [studyLog]);
  const maxMinutes = Math.max(...weekly.map((d) => d.minutes), 30);

  const achievements: Achievement[] = useMemo(() => {
    const list: Achievement[] = [];
    if (quizResults.length > 0) list.push({ id: 'quiz', title: 'Self-Discovered', description: 'Took the Career Quiz', icon: '🎯' });
    if (certProgress.length > 0) list.push({ id: 'cert-started', title: 'Getting Started', description: 'Started your first certification', icon: '📘' });
    if (completedCerts > 0) list.push({ id: 'cert-done', title: 'Certified', description: 'Completed a certification', icon: '🏅' });
    if (completedRoadmapSteps > 0) list.push({ id: 'roadmap-step', title: 'On the Path', description: 'Completed a roadmap step', icon: '🧭' });
    if (streak >= 3) list.push({ id: 'streak-3', title: 'Building Momentum', description: '3-day study streak', icon: '🔥' });
    if (streak >= 7) list.push({ id: 'streak-7', title: 'Consistent', description: '7-day study streak', icon: '⚡' });
    return list;
  }, [quizResults.length, certProgress.length, completedCerts, completedRoadmapSteps, streak]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Your Progress</Text>

        <View style={styles.statGrid}>
          <StatTile label="Certifications completed" value={String(completedCerts)} theme={theme} />
          <StatTile label="In progress" value={String(inProgressCerts)} theme={theme} />
          <StatTile label="Roadmap steps done" value={`${completedRoadmapSteps}/${totalRoadmapSteps}`} theme={theme} />
          <StatTile label="Hours studied" value={(totalMinutes / 60).toFixed(1)} theme={theme} />
        </View>

        <Card style={styles.streakCard}>
          <View>
            <Text style={[styles.streakLabel, { color: theme.textMuted }]}>DAILY STREAK</Text>
            <Text style={[styles.streakValue, { color: theme.text }]}>🔥 {streak} day{streak === 1 ? '' : 's'}</Text>
          </View>
          <GradientButton label="+ Log 30 min" small onPress={() => logStudy(30)} />
        </Card>

        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>This Week</Text>
          <View style={styles.chartRow}>
            {weekly.map((day, i) => (
              <View key={i} style={styles.chartColumn}>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: `${Math.max(4, (day.minutes / maxMinutes) * 100)}%`,
                        backgroundColor: day.minutes > 0 ? theme.teal : theme.border,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.chartLabel, { color: theme.textFaint }]}>{day.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
        {achievements.length === 0 ? (
          <Text style={{ color: theme.textMuted }}>Complete quizzes, certifications, and roadmap steps to earn badges.</Text>
        ) : (
          <View style={styles.achievementGrid}>
            {achievements.map((a) => (
              <Card key={a.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{a.icon}</Text>
                <Text style={[styles.achievementTitle, { color: theme.text }]}>{a.title}</Text>
                <Text style={[styles.achievementDesc, { color: theme.textMuted }]}>{a.description}</Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <Card style={styles.statTile}>
      <Text style={[styles.statValue, { color: theme.blue }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statTile: { width: '47%', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600' },
  streakCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  streakValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  chartCard: { gap: 12 },
  chartTitle: { fontSize: 15, fontWeight: '700' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 100, alignItems: 'flex-end' },
  chartColumn: { alignItems: 'center', flex: 1, gap: 6, height: '100%', justifyContent: 'flex-end' },
  chartBarTrack: { width: 14, height: '80%', justifyContent: 'flex-end' },
  chartBar: { width: '100%', borderRadius: 6, minHeight: 4 },
  chartLabel: { fontSize: 10, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achievementCard: { width: '47%', gap: 4, alignItems: 'center', textAlign: 'center' },
  achievementIcon: { fontSize: 26 },
  achievementTitle: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  achievementDesc: { fontSize: 11, textAlign: 'center' },
});
