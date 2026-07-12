import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { GradientButton } from '../GradientButton';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { LearningItem } from '../../types';

export function ContinueLearning({
  items,
  onContinue,
}: {
  items: LearningItem[];
  onContinue?: (item: LearningItem) => void;
}) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Text style={[styles.provider, { color: theme.textMuted }]}>{item.provider}</Text>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <ProgressBar progress={item.progress} />
            </View>
            <Text style={[styles.progressText, { color: theme.teal }]}>
              {Math.round(item.progress * 100)}%
            </Text>
          </View>
          <GradientButton
            label="Continue"
            small
            style={styles.button}
            onPress={() => onContinue?.(item)}
          />
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
    width: 200,
    gap: 8,
  },
  provider: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    marginTop: 4,
    alignSelf: 'stretch',
  },
});
