import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function SearchBar({ onSubmit }: { onSubmit: (query: string) => void }) {
  const theme = useTheme();
  const [value, setValue] = useState('');

  return (
    <View style={[styles.wrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Feather name="search" size={18} color={theme.textFaint} />
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={() => onSubmit(value)}
        returnKeyType="search"
        placeholder="Search careers, certifications, or skills..."
        placeholderTextColor={theme.textFaint}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
