import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function QuizOptionButton({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? theme.blue + '18' : theme.card,
          borderColor: selected ? theme.blue : theme.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: selected ? theme.blue : theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
  },
});
