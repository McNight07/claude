import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { FilterChip } from '../../components/FilterChip';
import { Pill } from '../../components/Pill';
import { useNews } from '../../context/NewsContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { NewsCategory } from '../../data/news';

type Props = NativeStackScreenProps<RootStackParamList, 'News'>;

const categories: NewsCategory[] = ['AI', 'Cybersecurity', 'Cloud', 'Networking', 'Programming', 'Business', 'Other'];

const categoryColorKey: Record<NewsCategory, 'purple' | 'danger' | 'blue' | 'teal' | 'warning' | 'success' | 'textFaint'> = {
  AI: 'purple',
  Cybersecurity: 'danger',
  Cloud: 'blue',
  Networking: 'teal',
  Programming: 'warning',
  Business: 'success',
  Other: 'textFaint',
};

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return 'Never updated';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes < 1) return 'Updated just now';
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `Updated ${hours}h ago`;
}

export function NewsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { news, loading, error, lastUpdated, isLive, refresh } = useNews();
  const [category, setCategory] = useState<NewsCategory | null>(null);

  const filtered = useMemo(() => (category ? news.filter((n) => n.category === category) : news), [news, category]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={refresh} hitSlop={10} style={styles.refreshButton} disabled={loading}>
          <Feather name="refresh-cw" size={18} color={loading ? theme.textFaint : theme.blue} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>IT Industry News</Text>
        <View style={styles.statusRow}>
          <View style={[styles.liveDot, { backgroundColor: isLive ? theme.success : theme.textFaint }]} />
          <Text style={[styles.statusText, { color: theme.textMuted }]}>
            {isLive ? 'Live from Hacker News' : 'Offline sample'} · {formatUpdatedAt(lastUpdated)}
          </Text>
        </View>
        {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
      </View>

      <ScrollView
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip label="All" selected={!category} onPress={() => setCategory(null)} />
        {categories.map((c) => (
          <FilterChip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      <ScrollView
        style={styles.flexList}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.blue} />}
      >
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textMuted }]}>No stories in this category right now.</Text>
        ) : (
          filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.itemTouchable}
              onPress={() => item.url && Linking.openURL(item.url).catch(() => {})}
            >
              <Card style={styles.card}>
                <Pill label={item.category} color={theme[categoryColorKey[item.category]] as string} />
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaText, { color: theme.textFaint }]}>{item.source}</Text>
                  <Text style={[styles.metaText, { color: theme.textFaint }]}>{item.timeAgo}</Text>
                  {item.points !== undefined ? (
                    <View style={styles.metaItem}>
                      <Feather name="arrow-up" size={11} color={theme.textFaint} />
                      <Text style={[styles.metaText, { color: theme.textFaint }]}>{item.points}</Text>
                    </View>
                  ) : null}
                  {item.commentsCount !== undefined ? (
                    <View style={styles.metaItem}>
                      <Feather name="message-circle" size={11} color={theme.textFaint} />
                      <Text style={[styles.metaText, { color: theme.textFaint }]}>{item.commentsCount}</Text>
                    </View>
                  ) : null}
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 },
  refreshButton: { padding: 2 },
  header: { paddingHorizontal: 20, gap: 6, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 12, fontWeight: '600' },
  errorText: { fontSize: 12, fontWeight: '600' },
  filterScroll: { flexGrow: 0 },
  flexList: { flex: 1 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  list: { padding: 20, paddingTop: 0, gap: 12, flexGrow: 1 },
  itemTouchable: { width: '100%' },
  card: { gap: 8 },
  itemTitle: { fontSize: 15, fontWeight: '700', lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11.5, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});
