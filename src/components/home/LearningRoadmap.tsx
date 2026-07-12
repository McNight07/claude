import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { GradientButton } from '../GradientButton';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { RoadmapPath } from '../../types';

export function LearningRoadmap({
  roadmap,
  completedSteps,
  onViewRoadmap,
}: {
  roadmap: RoadmapPath;
  completedSteps: number;
  onViewRoadmap: () => void;
}) {
  const theme = useTheme();
  const progress = completedSteps / roadmap.steps.length;

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>{roadmap.title}</Text>
      <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={2}>
        {roadmap.description}
      </Text>
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <ProgressBar progress={progress} />
        </View>
        <Text style={[styles.progressText, { color: theme.teal }]}>{Math.round(progress * 100)}%</Text>
      </View>
      <Text style={[styles.stepsText, { color: theme.textFaint }]}>
        {completedSteps} of {roadmap.steps.length} steps complete
      </Text>
      <GradientButton label="View My Roadmap" onPress={onViewRoadmap} style={styles.button} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepsText: {
    fontSize: 12,
  },
  button: {
    marginTop: 0,
  },
});
