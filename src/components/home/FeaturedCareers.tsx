import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { DifficultyPill, Pill } from '../Pill';
import { GradientButton } from '../GradientButton';
import { useTheme } from '../../theme/ThemeProvider';
import { Career } from '../../types';

const demandColor = (demand: Career['demand'], theme: ReturnType<typeof useTheme>) => {
  switch (demand) {
    case 'Very High':
      return theme.danger;
    case 'High':
      return theme.warning;
    case 'Medium':
      return theme.blue;
    default:
      return theme.textFaint;
  }
};

export function FeaturedCareers({
  careers,
  onLearnMore,
}: {
  careers: Career[];
  onLearnMore?: (career: Career) => void;
}) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {careers.map((career) => (
        <Card key={career.id} style={styles.card}>
          <Text style={styles.icon}>{career.icon}</Text>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {career.title}
          </Text>
          <Text style={[styles.salary, { color: theme.blue }]}>{career.avgSalary}/yr</Text>
          <View style={styles.pillRow}>
            <Pill label={`${career.demand} demand`} color={demandColor(career.demand, theme)} />
          </View>
          <DifficultyPill level={career.difficulty} />
          <GradientButton
            label="Learn More"
            small
            style={styles.button}
            onPress={() => onLearnMore?.(career)}
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
    width: 168,
    gap: 8,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    minHeight: 38,
  },
  salary: {
    fontSize: 14,
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
  },
  button: {
    marginTop: 4,
    alignSelf: 'stretch',
  },
});
