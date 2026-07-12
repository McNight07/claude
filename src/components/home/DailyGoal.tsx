import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { ProgressRing } from '../ProgressRing';
import { useTheme } from '../../theme/ThemeProvider';

export function DailyGoal({
  goal,
  progress,
  onLogStudy,
}: {
  goal: string;
  progress: number;
  onLogStudy: () => void;
}) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.textMuted }]}>TODAY&apos;S GOAL</Text>
        <Text style={[styles.goal, { color: theme.text }]}>{goal}</Text>
        <TouchableOpacity onPress={onLogStudy} hitSlop={6}>
          <Text style={[styles.hint, { color: theme.blue }]}>+ Log 15 min</Text>
        </TouchableOpacity>
      </View>
      <ProgressRing progress={progress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    paddingRight: 12,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  goal: {
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
});
