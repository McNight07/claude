import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { CertificationCard } from '../../components/certifications/CertificationCard';
import { FilterChip } from '../../components/FilterChip';
import { RoadmapCard } from '../../components/roadmaps/RoadmapCard';
import { useAppData } from '../../context/AppDataContext';
import { TabParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/useAppNavigation';
import { useTheme } from '../../theme/ThemeProvider';
import { Difficulty } from '../../types';

const difficultyLevels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export function LearnScreen() {
  const theme = useTheme();
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<TabParamList, 'Learn'>>();
  const { certifications, roadmaps, getCertProgress, isBookmarked, toggleBookmark, getRoadmapProgress } =
    useAppData();

  const [segment, setSegment] = useState<'certifications' | 'roadmaps'>(route.params?.segment ?? 'certifications');

  useEffect(() => {
    if (route.params?.segment) setSegment(route.params.segment);
  }, [route.params?.segment]);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const filteredCerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return certifications.filter((cert) => {
      if (q && !`${cert.name} ${cert.vendor} ${cert.code}`.toLowerCase().includes(q)) return false;
      if (difficulty && cert.difficulty !== difficulty) return false;
      return true;
    });
  }, [certifications, query, difficulty]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Learn</Text>
        <View style={[styles.segmented, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
          <SegmentButton
            label="Certifications"
            active={segment === 'certifications'}
            onPress={() => setSegment('certifications')}
          />
          <SegmentButton label="Roadmaps" active={segment === 'roadmaps'} onPress={() => setSegment('roadmaps')} />
        </View>
      </View>

      {segment === 'certifications' ? (
        <>
          <View style={styles.searchRow}>
            <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Feather name="search" size={16} color={theme.textFaint} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search certifications..."
                placeholderTextColor={theme.textFaint}
                style={[styles.searchInput, { color: theme.text }]}
              />
            </View>
          </View>
          <View style={styles.filterRow}>
            <FilterChip label="All" selected={!difficulty} onPress={() => setDifficulty(null)} />
            {difficultyLevels.map((d) => (
              <FilterChip key={d} label={d} selected={difficulty === d} onPress={() => setDifficulty(d)} />
            ))}
          </View>
          <ScrollView style={styles.flexList} contentContainerStyle={styles.grid}>
            {filteredCerts.length === 0 ? (
              <Text style={[styles.empty, { color: theme.textMuted }]}>No certifications match that search.</Text>
            ) : (
              <View style={styles.gridWrap}>
                {filteredCerts.map((item) => (
                  <CertificationCard
                    key={item.id}
                    certification={item}
                    progress={getCertProgress(item.id)?.progress}
                    bookmarked={isBookmarked(item.id)}
                    onPress={() => navigation.navigate('CertificationDetail', { certificationId: item.id })}
                    onToggleBookmark={() => toggleBookmark(item.id)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.flexList} contentContainerStyle={styles.list}>
          {roadmaps.map((item) => {
            const progressRecord = getRoadmapProgress(item.id);
            const progress = progressRecord ? progressRecord.completedStepIds.length / item.steps.length : 0;
            return (
              <RoadmapCard
                key={item.id}
                roadmap={item}
                progress={progress}
                onPress={() => navigation.navigate('RoadmapDetail', { roadmapId: item.id })}
              />
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Text
      onPress={onPress}
      style={[
        styles.segmentText,
        {
          color: active ? '#FFFFFF' : theme.textMuted,
          backgroundColor: active ? theme.blue : 'transparent',
        },
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  segmented: { flexDirection: 'row', borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, padding: 4, gap: 4 },
  segmentText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 8,
    borderRadius: 9,
    overflow: 'hidden',
  },
  searchRow: { paddingHorizontal: 20, marginTop: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginTop: 12 },
  flexList: { flex: 1 },
  grid: { padding: 20, paddingTop: 12 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  list: { padding: 20, paddingTop: 12, gap: 12 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});
