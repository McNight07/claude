import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../Card';
import { Pill } from '../Pill';
import { useTheme } from '../../theme/ThemeProvider';
import { NewsCategory, NewsItem } from '../../data/news';

const categoryColor: Record<NewsCategory, keyof ReturnType<typeof useTheme>> = {
  AI: 'purple',
  Cybersecurity: 'danger',
  Cloud: 'blue',
  Networking: 'teal',
  Programming: 'warning',
  Business: 'success',
  Other: 'textFaint',
};

export function TechNews({ items }: { items: NewsItem[] }) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.85}
          disabled={!item.url}
          onPress={() => item.url && Linking.openURL(item.url).catch(() => {})}
        >
          <Card style={styles.card}>
            <Pill label={item.category} color={theme[categoryColor[item.category]] as string} />
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={3}>
              {item.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.meta, { color: theme.textFaint }]} numberOfLines={1}>
                {item.source}
              </Text>
              <Text style={[styles.meta, { color: theme.textFaint }]}>{item.timeAgo}</Text>
            </View>
          </Card>
        </TouchableOpacity>
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
    width: 220,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  meta: {
    fontSize: 11,
    flexShrink: 1,
  },
});
