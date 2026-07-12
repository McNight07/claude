import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

export function ComingSoonScreen({ route, navigation }: Props) {
  const { title, description, icon } = route.params;
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10} style={styles.back}>
        <Feather name="arrow-left" size={22} color={theme.text} />
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={[styles.iconWrap, { backgroundColor: theme.blue + '18' }]}>
          <Feather name={icon as keyof typeof Feather.glyphMap} size={28} color={theme.blue} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.textMuted }]}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  back: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginTop: -60,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
