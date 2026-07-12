import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { DifficultyPill } from '../Pill';
import { useTheme } from '../../theme/ThemeProvider';
import { Recommendation } from '../../types';

export function RecommendedForYou({
  items,
  onStart,
}: {
  items: Recommendation[];
  onStart?: (item: Recommendation) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="clock" size={12} color={theme.textFaint} />
                <Text style={[styles.metaText, { color: theme.textMuted }]}>{item.estimatedTime}</Text>
              </View>
              <DifficultyPill level={item.difficulty} />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: theme.blue + '18' }]}
            onPress={() => onStart?.(item)}
          >
            <Text style={[styles.startText, { color: theme.blue }]}>Start</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  startText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
