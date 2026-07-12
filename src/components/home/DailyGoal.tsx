import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { ProgressRing } from '../ProgressRing';
import { useTheme } from '../../theme/ThemeProvider';

export function DailyGoal({ goal, progress }: { goal: string; progress: number }) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: theme.textMuted }]}>TODAY&apos;S GOAL</Text>
        <Text style={[styles.goal, { color: theme.text }]}>{goal}</Text>
        <Text style={[styles.hint, { color: theme.textFaint }]}>Keep your streak going!</Text>
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
    fontSize: 12,
  },
});
