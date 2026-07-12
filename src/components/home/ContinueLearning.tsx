import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { GradientButton } from '../GradientButton';
import { ProgressBar } from '../ProgressBar';
import { useTheme } from '../../theme/ThemeProvider';
import { Certification } from '../../types';

interface ContinueLearningItem {
  certification: Certification;
  progress: number;
}

export function ContinueLearning({
  items,
  onContinue,
}: {
  items: ContinueLearningItem[];
  onContinue: (certification: Certification) => void;
}) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map(({ certification, progress }) => (
        <Card key={certification.id} style={styles.card}>
          <Text style={[styles.provider, { color: theme.textMuted }]}>{certification.vendor}</Text>
          <Text style={[styles.title, { color: theme.text }]}>{certification.name}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <ProgressBar progress={progress} />
            </View>
            <Text style={[styles.progressText, { color: theme.teal }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <GradientButton
            label="Continue"
            small
            style={styles.button}
            onPress={() => onContinue(certification)}
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
