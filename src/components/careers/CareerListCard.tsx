import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { DifficultyPill, Pill } from '../Pill';
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

function formatSalary(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

export function CareerListCard({
  career,
  favorite,
  comparing,
  onPress,
  onToggleFavorite,
  onToggleCompare,
}: {
  career: Career;
  favorite: boolean;
  comparing: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.icon}>{career.icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]}>{career.title}</Text>
            <Text style={[styles.industry, { color: theme.textMuted }]}>{career.industry}</Text>
          </View>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={10}>
            <Feather
              name="heart"
              size={20}
              color={favorite ? theme.danger : theme.textFaint}
              style={favorite ? styles.heartFilled : undefined}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.salary, { color: theme.blue }]}>
          {formatSalary(career.salary.entry)} – {formatSalary(career.salary.senior)}/yr
        </Text>

        <View style={styles.pillRow}>
          <Pill label={`${career.demand} demand`} color={demandColor(career.demand, theme)} />
          <DifficultyPill level={career.difficulty} />
          {career.remote ? <Pill label="Remote-friendly" color={theme.teal} /> : null}
        </View>

        <TouchableOpacity onPress={onToggleCompare} style={styles.compareRow} hitSlop={6}>
          <Feather
            name={comparing ? 'check-square' : 'square'}
            size={16}
            color={comparing ? theme.purple : theme.textFaint}
          />
          <Text style={[styles.compareText, { color: comparing ? theme.purple : theme.textMuted }]}>
            {comparing ? 'Added to compare' : 'Add to compare'}
          </Text>
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  industry: {
    fontSize: 12,
    marginTop: 2,
  },
  heartFilled: {
    transform: [{ scale: 1.05 }],
  },
  salary: {
    fontSize: 15,
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  compareText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});
