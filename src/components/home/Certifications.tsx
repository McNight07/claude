import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../Card';
import { DifficultyPill } from '../Pill';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { Certification } from '../../types';

export function Certifications({ items }: { items: Certification[] }) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map((item) => (
        <Card key={item.id} style={styles.card}>
          <LinearGradient colors={theme.gradientPrimary} style={styles.badge}>
            <Text style={styles.badgeText}>{item.code}</Text>
          </LinearGradient>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.duration, { color: theme.textMuted }]}>{item.duration}</Text>
          <DifficultyPill level={item.difficulty} />
          {item.progress !== undefined ? (
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <ProgressBar progress={item.progress} />
              </View>
              <Text style={[styles.progressText, { color: theme.teal }]}>
                {Math.round(item.progress * 100)}%
              </Text>
            </View>
          ) : (
            <Text style={[styles.notEnrolled, { color: theme.textFaint }]}>Not enrolled</Text>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 158,
    gap: 6,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    minHeight: 36,
  },
  duration: {
    fontSize: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notEnrolled: {
    fontSize: 11,
    marginTop: 4,
  },
});
