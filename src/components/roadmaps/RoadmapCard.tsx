import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { Pill } from '../Pill';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { RoadmapPath } from '../../types';

export function RoadmapCard({
  roadmap,
  progress,
  onPress,
}: {
  roadmap: RoadmapPath;
  progress: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>{roadmap.title}</Text>
          <Pill label={roadmap.level} color={theme.purple} />
        </View>
        <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={2}>
          {roadmap.description}
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <ProgressBar progress={progress} />
          </View>
          <Text style={[styles.progressText, { color: theme.teal }]}>{Math.round(progress * 100)}%</Text>
        </View>
        <Text style={[styles.stepsText, { color: theme.textFaint }]}>{roadmap.steps.length} steps</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: { width: '100%' },
  card: { gap: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  description: { fontSize: 13, lineHeight: 18 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack: { flex: 1 },
  progressText: { fontSize: 12, fontWeight: '700' },
  stepsText: { fontSize: 11.5 },
});
