import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  isFavorite,
  onToggleFavorite,
  onLearnMore,
}: {
  careers: Career[];
  isFavorite: (careerId: string) => boolean;
  onToggleFavorite: (careerId: string) => void;
  onLearnMore: (career: Career) => void;
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
          <View style={styles.topRow}>
            <Text style={styles.icon}>{career.icon}</Text>
            <TouchableOpacity onPress={() => onToggleFavorite(career.id)} hitSlop={8}>
              <Feather name="heart" size={17} color={isFavorite(career.id) ? theme.danger : theme.textFaint} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {career.title}
          </Text>
          <Text style={[styles.salary, { color: theme.blue }]}>
            ${Math.round(career.salary.average / 1000)}k/yr
          </Text>
          <View style={styles.pillRow}>
            <Pill label={`${career.demand} demand`} color={demandColor(career.demand, theme)} />
          </View>
          <DifficultyPill level={career.difficulty} />
          <GradientButton
            label="Learn More"
            small
            style={styles.button}
            onPress={() => onLearnMore(career)}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
