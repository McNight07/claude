import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../../theme/ThemeProvider';

interface HeaderProps {
  name: string;
  hasNotifications?: boolean;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
  onPressSearch?: () => void;
  onPressNews?: () => void;
}

export function Header({
  name,
  hasNotifications,
  onPressAvatar,
  onPressNotifications,
  onPressSearch,
  onPressNews,
}: HeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPressAvatar} activeOpacity={0.8}>
        <LinearGradient colors={theme.gradientPrimary} style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.textWrap}>
        <Text style={[styles.greeting, { color: theme.text }]}>👋 Welcome back, {name}!</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Let&apos;s build your tech career.
        </Text>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity
          testID="news-button"
          onPress={onPressNews}
          hitSlop={8}
          style={[styles.iconButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
        >
          <Feather name="rss" size={18} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressSearch}
          hitSlop={8}
          style={[styles.iconButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
        >
          <Feather name="search" size={18} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressNotifications}
          hitSlop={8}
          style={[styles.iconButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
        >
          <Feather name="bell" size={18} color={theme.text} />
          {hasNotifications ? <View style={[styles.dot, { backgroundColor: theme.danger }]} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
