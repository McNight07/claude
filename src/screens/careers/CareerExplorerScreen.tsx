import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { CareerListCard } from '../../components/careers/CareerListCard';
import { FilterChip } from '../../components/FilterChip';
import { GradientButton } from '../../components/GradientButton';
import { useAppData } from '../../context/AppDataContext';
import { TabParamList } from '../../navigation/types';
import { useAppNavigation } from '../../navigation/useAppNavigation';
import { useTheme } from '../../theme/ThemeProvider';
import { Career, Demand, Difficulty } from '../../types';

const demandLevels: Demand[] = ['Low', 'Medium', 'High', 'Very High'];
const difficultyLevels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const salaryFloors = [0, 80000, 120000, 150000];

export function CareerExplorerScreen() {
  const theme = useTheme();
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<TabParamList, 'Explore'>>();
  const { careers, isFavorite, toggleFavorite, compareIds, toggleCompare } = useAppData();

  const [query, setQuery] = useState(route.params?.query ?? '');

  useEffect(() => {
    if (route.params?.query !== undefined) setQuery(route.params.query);
  }, [route.params?.query]);
  const [industry, setIndustry] = useState<string | null>(null);
  const [demand, setDemand] = useState<Demand | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const industries = useMemo(() => Array.from(new Set(careers.map((c) => c.industry))).sort(), [careers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return careers.filter((career: Career) => {
      if (q) {
        const haystack = [career.title, career.description, career.industry, ...career.skillsRequired]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (industry && career.industry !== industry) return false;
      if (demand && career.demand !== demand) return false;
      if (difficulty && career.difficulty !== difficulty) return false;
      if (remoteOnly && !career.remote) return false;
      if (career.salary.average < minSalary) return false;
      return true;
    });
  }, [careers, query, industry, demand, difficulty, remoteOnly, minSalary]);

  const activeFilterCount =
    (industry ? 1 : 0) + (demand ? 1 : 0) + (difficulty ? 1 : 0) + (remoteOnly ? 1 : 0) + (minSalary > 0 ? 1 : 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Explore Careers</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Feather name="search" size={16} color={theme.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search careers, skills, or industries..."
            placeholderTextColor={theme.textFaint}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      <View style={styles.filterToggleRow}>
        <TouchableOpacity
          style={[styles.filterToggle, { borderColor: theme.border, backgroundColor: theme.card }]}
          onPress={() => setShowFilters((v) => !v)}
        >
          <Feather name="sliders" size={14} color={theme.text} />
          <Text style={[styles.filterToggleText, { color: theme.text }]}>
            Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.resultCount, { color: theme.textMuted }]}>{filtered.length} careers</Text>
      </View>

      {showFilters ? (
        <View style={styles.filtersPanel}>
          <FilterRow label="Industry">
            <FilterChip label="All" selected={!industry} onPress={() => setIndustry(null)} />
            {industries.map((ind) => (
              <FilterChip key={ind} label={ind} selected={industry === ind} onPress={() => setIndustry(ind)} />
            ))}
          </FilterRow>
          <FilterRow label="Demand">
            <FilterChip label="All" selected={!demand} onPress={() => setDemand(null)} />
            {demandLevels.map((d) => (
              <FilterChip key={d} label={d} selected={demand === d} onPress={() => setDemand(d)} />
            ))}
          </FilterRow>
          <FilterRow label="Difficulty">
            <FilterChip label="All" selected={!difficulty} onPress={() => setDifficulty(null)} />
            {difficultyLevels.map((d) => (
              <FilterChip key={d} label={d} selected={difficulty === d} onPress={() => setDifficulty(d)} />
            ))}
          </FilterRow>
          <FilterRow label="Min. avg salary">
            {salaryFloors.map((floor) => (
              <FilterChip
                key={floor}
                label={floor === 0 ? 'Any' : `$${floor / 1000}k+`}
                selected={minSalary === floor}
                onPress={() => setMinSalary(floor)}
              />
            ))}
          </FilterRow>
          <FilterRow label="Location">
            <FilterChip label="Remote-friendly only" selected={remoteOnly} onPress={() => setRemoteOnly((v) => !v)} />
          </FilterRow>
        </View>
      ) : null}

      {compareIds.length > 0 ? (
        <View style={styles.compareBar}>
          <Text style={[styles.compareBarText, { color: theme.text }]}>
            {compareIds.length} selected for comparison
          </Text>
          <GradientButton
            label="Compare"
            small
            onPress={() => navigation.navigate('Compare')}
            colors={theme.gradientAccent}
          />
        </View>
      ) : null}

      <ScrollView style={styles.flexList} contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textMuted }]}>No careers match those filters yet.</Text>
        ) : (
          filtered.map((item) => (
            <CareerListCard
              key={item.id}
              career={item}
              favorite={isFavorite(item.id)}
              comparing={compareIds.includes(item.id)}
              onPress={() => navigation.navigate('CareerDetail', { careerId: item.id })}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onToggleCompare={() => toggleCompare(item.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.filterRow}>
      <Text style={[styles.filterLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.filterChips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterToggleText: { fontSize: 12.5, fontWeight: '700' },
  resultCount: { fontSize: 12.5, fontWeight: '600' },
  filtersPanel: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  filterRow: { gap: 8 },
  filterLabel: { fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  compareBar: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },
  compareBarText: { fontSize: 13, fontWeight: '700' },
  flexList: { flex: 1 },
  list: { padding: 20, paddingTop: 12, gap: 12 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});
