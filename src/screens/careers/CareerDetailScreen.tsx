import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { DifficultyPill, Pill } from '../../components/Pill';
import { GradientButton } from '../../components/GradientButton';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'CareerDetail'>;

function formatSalary(value: number) {
  return `$${value.toLocaleString()}`;
}

export function CareerDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { careers, certifications, isFavorite, toggleFavorite, compareIds, toggleCompare } = useAppData();
  const career = careers.find((c) => c.id === route.params.careerId);

  if (!career) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, padding: 20 }}>Career not found.</Text>
      </SafeAreaView>
    );
  }

  const relatedCerts = certifications.filter((c) => career.certificationIds.includes(c.id));
  const favorite = isFavorite(career.id);
  const comparing = compareIds.includes(career.id);

  const handleShare = () => {
    Share.share({
      title: career.title,
      message: `${career.title} — avg salary ${formatSalary(career.salary.average)}/yr, ${career.demand} demand.\n\n${career.description}`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.topBarActions}>
          <TouchableOpacity onPress={handleShare} hitSlop={10} style={styles.topBarButton}>
            <Feather name="share" size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="favorite-toggle"
            onPress={() => toggleFavorite(career.id)}
            hitSlop={10}
            style={styles.topBarButton}
          >
            <Feather name="heart" size={20} color={favorite ? theme.danger : theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.icon}>{career.icon}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{career.title}</Text>
        <Text style={[styles.industry, { color: theme.textMuted }]}>{career.industry}</Text>

        <View style={styles.pillRow}>
          <Pill label={`${career.demand} demand`} color={theme.blue} />
          <DifficultyPill level={career.difficulty} />
          {career.remote ? <Pill label="Remote-friendly" color={theme.teal} /> : null}
        </View>

        <Text style={[styles.description, { color: theme.text }]}>{career.description}</Text>

        <Card style={styles.salaryCard}>
          <SalaryColumn label="Entry" value={career.salary.entry} theme={theme} />
          <View style={[styles.salaryDivider, { backgroundColor: theme.border }]} />
          <SalaryColumn label="Average" value={career.salary.average} highlight theme={theme} />
          <View style={[styles.salaryDivider, { backgroundColor: theme.border }]} />
          <SalaryColumn label="Senior" value={career.salary.senior} theme={theme} />
        </Card>

        <Section title="Job Outlook" theme={theme}>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>{career.jobOutlook}</Text>
        </Section>

        <Section title="Education Required" theme={theme}>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>{career.educationRequired}</Text>
        </Section>

        <Section title="Skills Required" theme={theme}>
          <View style={styles.chipWrap}>
            {career.skillsRequired.map((skill) => (
              <Pill key={skill} label={skill} color={theme.purple} />
            ))}
          </View>
        </Section>

        <Section title="Daily Tasks" theme={theme}>
          {career.dailyTasks.map((task) => (
            <View key={task} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: theme.blue }]} />
              <Text style={[styles.bodyText, { color: theme.textMuted, flex: 1 }]}>{task}</Text>
            </View>
          ))}
        </Section>

        <Section title="Work Environment" theme={theme}>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>{career.workEnvironment}</Text>
        </Section>

        <Section title="Career Growth" theme={theme}>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>{career.careerGrowth}</Text>
        </Section>

        {relatedCerts.length > 0 ? (
          <Section title="Related Certifications" theme={theme}>
            <View style={styles.chipWrap}>
              {relatedCerts.map((cert) => (
                <TouchableOpacity
                  key={cert.id}
                  onPress={() => navigation.navigate('CertificationDetail', { certificationId: cert.id })}
                >
                  <Pill label={cert.name} color={theme.teal} />
                </TouchableOpacity>
              ))}
            </View>
          </Section>
        ) : null}

        {career.resources.length > 0 ? (
          <Section title="Resources" theme={theme}>
            {career.resources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceRow}
                onPress={() => Linking.openURL(resource.url).catch(() => {})}
              >
                <Feather name="external-link" size={14} color={theme.blue} />
                <Text style={[styles.resourceText, { color: theme.blue }]}>{resource.title}</Text>
                <Text style={[styles.resourceType, { color: theme.textFaint }]}>
                  {resource.type} · {resource.free ? 'Free' : 'Paid'}
                </Text>
              </TouchableOpacity>
            ))}
          </Section>
        ) : null}

        <TouchableOpacity onPress={() => toggleCompare(career.id)} style={styles.compareToggle}>
          <Feather name={comparing ? 'check-square' : 'square'} size={18} color={comparing ? theme.purple : theme.textFaint} />
          <Text style={[styles.compareToggleText, { color: comparing ? theme.purple : theme.text }]}>
            {comparing ? 'Added to comparison' : 'Add to comparison'}
          </Text>
        </TouchableOpacity>

        {compareIds.length > 0 ? (
          <GradientButton
            label={`Compare ${compareIds.length} career${compareIds.length > 1 ? 's' : ''}`}
            colors={theme.gradientAccent}
            onPress={() => navigation.navigate('Compare')}
            style={styles.compareButton}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, theme, children }: { title: string; theme: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function SalaryColumn({
  label,
  value,
  highlight,
  theme,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.salaryColumn}>
      <Text style={[styles.salaryLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.salaryValue, { color: highlight ? theme.blue : theme.text }]}>
        {formatSalary(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  topBarActions: { flexDirection: 'row', gap: 16 },
  topBarButton: {},
  content: { padding: 20, paddingTop: 4, gap: 16 },
  icon: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: '800' },
  industry: { fontSize: 14, marginTop: -8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  description: { fontSize: 15, lineHeight: 22 },
  salaryCard: { flexDirection: 'row', alignItems: 'center' },
  salaryColumn: { flex: 1, alignItems: 'center', gap: 4 },
  salaryDivider: { width: StyleSheet.hairlineWidth, height: 36 },
  salaryLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  salaryValue: { fontSize: 16, fontWeight: '800' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  bodyText: { fontSize: 14, lineHeight: 20 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  resourceText: { fontSize: 14, fontWeight: '600', flex: 1 },
  resourceType: { fontSize: 11 },
  compareToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  compareToggleText: { fontSize: 14, fontWeight: '700' },
  compareButton: { marginTop: 4 },
});
