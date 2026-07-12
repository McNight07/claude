import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Difficulty } from '../types';

export function DifficultyPill({ level }: { level: Difficulty }) {
  const theme = useTheme();
  const color =
    level === 'Beginner' ? theme.success : level === 'Intermediate' ? theme.warning : theme.danger;
  return (
    <View style={[styles.pill, { backgroundColor: color + '22' }]}>
      <Text style={[styles.text, { color }]}>{level}</Text>
    </View>
  );
}

export function Pill({ label, color }: { label: string; color?: string }) {
  const theme = useTheme();
  const c = color ?? theme.blue;
  return (
    <View style={[styles.pill, { backgroundColor: c + '22' }]}>
      <Text style={[styles.text, { color: c }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
