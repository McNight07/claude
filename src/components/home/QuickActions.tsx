import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface QuickAction {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  colors: readonly [string, string, ...string[]];
}

export function QuickActions({ onPress }: { onPress?: (label: string) => void }) {
  const theme = useTheme();
  const actions: QuickAction[] = [
    { label: 'Explore Careers', icon: 'compass', colors: theme.gradientPrimary },
    { label: 'Career Quiz', icon: 'help-circle', colors: theme.gradientAccent },
    { label: 'Learning Roadmap', icon: 'book-open', colors: theme.gradientTeal },
    { label: 'Resume Builder', icon: 'file-text', colors: theme.gradientPrimary },
  ];

  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.item}
          activeOpacity={0.85}
          onPress={() => onPress?.(action.label)}
        >
          <LinearGradient colors={action.colors} style={styles.iconWrap}>
            <Feather name={action.icon} size={22} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.label, { color: theme.text }]} numberOfLines={2}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    width: '23%',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
