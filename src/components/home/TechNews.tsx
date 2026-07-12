import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { Pill } from '../Pill';
import { useTheme } from '../../theme/ThemeProvider';
import { NewsItem } from '../../data/news';

const categoryColor: Record<NewsItem['category'], keyof ReturnType<typeof useTheme>> = {
  AI: 'purple',
  Cybersecurity: 'danger',
  Cloud: 'blue',
  Networking: 'teal',
  Programming: 'warning',
} as any;

export function TechNews({ items }: { items: NewsItem[] }) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {items.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Pill label={item.category} color={theme[categoryColor[item.category]] as string} />
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={3}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: theme.textFaint }]}>{item.source}</Text>
            <Text style={[styles.meta, { color: theme.textFaint }]}>{item.timeAgo}</Text>
          </View>
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
  },
  meta: {
    fontSize: 11,
  },
});
