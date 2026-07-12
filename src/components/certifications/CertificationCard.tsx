import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { DifficultyPill } from '../Pill';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { Certification } from '../../types';

export function CertificationCard({
  certification,
  progress,
  bookmarked,
  onPress,
  onToggleBookmark,
}: {
  certification: Certification;
  progress?: number;
  bookmarked: boolean;
  onPress: () => void;
  onToggleBookmark: () => void;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <LinearGradient colors={theme.gradientPrimary} style={styles.badge}>
            <Text style={styles.badgeText}>{certification.code}</Text>
          </LinearGradient>
          <TouchableOpacity onPress={onToggleBookmark} hitSlop={10}>
            <Feather name="bookmark" size={18} color={bookmarked ? theme.blue : theme.textFaint} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {certification.name}
        </Text>
        <Text style={[styles.vendor, { color: theme.textMuted }]}>{certification.vendor}</Text>
        <View style={styles.metaRow}>
          <DifficultyPill level={certification.difficulty} />
          <Text style={[styles.duration, { color: theme.textFaint }]}>{certification.durationWeeks}w · ${certification.examCost}</Text>
        </View>
        {progress !== undefined ? (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <ProgressBar progress={progress} />
            </View>
            <Text style={[styles.progressText, { color: theme.teal }]}>{Math.round(progress * 100)}%</Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6, width: 176 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  name: { fontSize: 14, fontWeight: '700', minHeight: 36, marginTop: 4 },
  vendor: { fontSize: 11.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  duration: { fontSize: 11 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  progressTrack: { flex: 1 },
  progressText: { fontSize: 11, fontWeight: '700' },
});
