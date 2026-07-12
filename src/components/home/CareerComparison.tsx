import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { GradientButton } from '../GradientButton';
import { useTheme } from '../../theme/ThemeProvider';

const metrics: { label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { label: 'Salary', icon: 'dollar-sign' },
  { label: 'Job Growth', icon: 'trending-up' },
  { label: 'Remote Opportunities', icon: 'wifi' },
  { label: 'Difficulty', icon: 'bar-chart-2' },
  { label: 'Required Certifications', icon: 'award' },
];

export function CareerComparison({ onCompare }: { onCompare?: () => void }) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>Compare two career paths</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        See how careers stack up before you commit.
      </Text>
      <View style={styles.metrics}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricRow}>
            <View style={[styles.metricIcon, { backgroundColor: theme.purple + '18' }]}>
              <Feather name={metric.icon} size={14} color={theme.purple} />
            </View>
            <Text style={[styles.metricLabel, { color: theme.text }]}>{metric.label}</Text>
          </View>
        ))}
      </View>
      <GradientButton
        label="Compare Careers"
        colors={theme.gradientAccent}
        onPress={onCompare}
        style={styles.button}
      />
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
  subtitle: {
    fontSize: 13,
  },
  metrics: {
    gap: 10,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 4,
  },
});
