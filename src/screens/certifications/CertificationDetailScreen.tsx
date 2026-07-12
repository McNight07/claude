import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { DifficultyPill, Pill } from '../../components/Pill';
import { GradientButton } from '../../components/GradientButton';
import { ProgressBar } from '../../components/ProgressBar';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'CertificationDetail'>;

const progressSteps = [0, 0.25, 0.5, 0.75, 1];

function parseDateInput(text: string): string | null {
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function formatDateDisplay(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function CertificationDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const {
    certifications,
    careers,
    isBookmarked,
    toggleBookmark,
    getCertProgress,
    setCertProgressValue,
    setCertExamDate,
  } = useAppData();

  const certification = certifications.find((c) => c.id === route.params.certificationId);
  const progressRecord = certification ? getCertProgress(certification.id) : undefined;
  const [examDateInput, setExamDateInput] = useState(
    progressRecord?.examDate ? formatDateDisplay(progressRecord.examDate).replace(/,/g, '') : ''
  );
  const [dateError, setDateError] = useState<string | null>(null);

  const relatedCareers = useMemo(
    () => (certification ? careers.filter((c) => certification.careerIds.includes(c.id)) : []),
    [certification, careers]
  );

  if (!certification) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, padding: 20 }}>Certification not found.</Text>
      </SafeAreaView>
    );
  }

  const progress = progressRecord?.progress ?? 0;
  const bookmarked = isBookmarked(certification.id);

  const handleSetExamDate = () => {
    const iso = parseDateInput(examDateInput.trim());
    if (!iso) {
      setDateError('Use MM/DD/YYYY, e.g. 09/15/2026');
      return;
    }
    setDateError(null);
    setCertExamDate(certification.id, iso);
  };

  const handleClearExamDate = () => {
    setExamDateInput('');
    setDateError(null);
    setCertExamDate(certification.id, undefined);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity testID="bookmark-toggle" onPress={() => toggleBookmark(certification.id)} hitSlop={10}>
          <Feather name="bookmark" size={22} color={bookmarked ? theme.blue : theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.name, { color: theme.text }]}>{certification.name}</Text>
        <Text style={[styles.vendor, { color: theme.textMuted }]}>{certification.vendor}</Text>

        <View style={styles.pillRow}>
          <DifficultyPill level={certification.difficulty} />
          <Pill label={`${certification.durationWeeks} weeks`} color={theme.blue} />
          <Pill label={`$${certification.examCost} exam`} color={theme.purple} />
        </View>

        <Text style={[styles.description, { color: theme.text }]}>{certification.description}</Text>

        <Section title="Your Progress" theme={theme}>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <ProgressBar progress={progress} />
            </View>
            <Text style={[styles.progressPercent, { color: theme.teal }]}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressButtons}>
            {progressSteps.map((step) => (
              <TouchableOpacity
                key={step}
                onPress={() => setCertProgressValue(certification.id, step)}
                style={[
                  styles.progressButton,
                  {
                    backgroundColor: Math.abs(progress - step) < 0.001 ? theme.blue : theme.cardAlt,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.progressButtonText,
                    { color: Math.abs(progress - step) < 0.001 ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {Math.round(step * 100)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {progress >= 1 ? (
            <Text style={[styles.completeText, { color: theme.success }]}>🎉 Certification completed!</Text>
          ) : null}
        </Section>

        <Section title="Exam Date & Reminder" theme={theme}>
          {progressRecord?.examDate ? (
            <View style={styles.examDateRow}>
              <View>
                <Text style={[styles.examDateValue, { color: theme.text }]}>
                  {formatDateDisplay(progressRecord.examDate)}
                </Text>
                <Text style={[styles.examCountdown, { color: theme.textMuted }]}>
                  {daysUntil(progressRecord.examDate) >= 0
                    ? `${daysUntil(progressRecord.examDate)} days left`
                    : 'This date has passed'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClearExamDate} hitSlop={8}>
                <Text style={[styles.clearText, { color: theme.danger }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.examDateForm}>
              <TextInput
                value={examDateInput}
                onChangeText={setExamDateInput}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={theme.textFaint}
                style={[
                  styles.examDateInput,
                  { color: theme.text, backgroundColor: theme.cardAlt, borderColor: theme.border },
                ]}
              />
              <TouchableOpacity
                onPress={handleSetExamDate}
                style={[styles.setDateButton, { backgroundColor: theme.blue }]}
              >
                <Text style={styles.setDateButtonText}>Set</Text>
              </TouchableOpacity>
            </View>
          )}
          {dateError ? <Text style={[styles.errorText, { color: theme.danger }]}>{dateError}</Text> : null}
        </Section>

        {certification.prerequisites.length > 0 ? (
          <Section title="Prerequisites" theme={theme}>
            {certification.prerequisites.map((p) => (
              <View key={p} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: theme.purple }]} />
                <Text style={[styles.bodyText, { color: theme.textMuted, flex: 1 }]}>{p}</Text>
              </View>
            ))}
          </Section>
        ) : null}

        <Section title="Exam Objectives" theme={theme}>
          {certification.examObjectives.map((obj) => (
            <View key={obj} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: theme.blue }]} />
              <Text style={[styles.bodyText, { color: theme.textMuted, flex: 1 }]}>{obj}</Text>
            </View>
          ))}
        </Section>

        {certification.studyResources.length > 0 ? (
          <Section title="Study Resources" theme={theme}>
            {certification.studyResources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceRow}
                onPress={() => Linking.openURL(resource.url).catch(() => {})}
              >
                <Feather name="external-link" size={14} color={theme.blue} />
                <Text style={[styles.resourceText, { color: theme.blue }]}>{resource.title}</Text>
                <Text style={[styles.resourceType, { color: theme.textFaint }]}>
                  {resource.free ? 'Free' : 'Paid'}
                </Text>
              </TouchableOpacity>
            ))}
          </Section>
        ) : null}

        {certification.practiceTests.length > 0 ? (
          <Section title="Practice Tests" theme={theme}>
            {certification.practiceTests.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceRow}
                onPress={() => Linking.openURL(resource.url).catch(() => {})}
              >
                <Feather name="external-link" size={14} color={theme.blue} />
                <Text style={[styles.resourceText, { color: theme.blue }]}>{resource.title}</Text>
              </TouchableOpacity>
            ))}
          </Section>
        ) : null}

        {relatedCareers.length > 0 ? (
          <Section title="Career Paths" theme={theme}>
            <View style={styles.chipWrap}>
              {relatedCareers.map((career) => (
                <TouchableOpacity
                  key={career.id}
                  onPress={() => navigation.navigate('CareerDetail', { careerId: career.id })}
                >
                  <Pill label={`${career.icon} ${career.title}`} color={theme.teal} />
                </TouchableOpacity>
              ))}
            </View>
          </Section>
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

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 },
  content: { padding: 20, paddingTop: 4, gap: 16 },
  name: { fontSize: 22, fontWeight: '800' },
  vendor: { fontSize: 14, marginTop: -10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  description: { fontSize: 15, lineHeight: 22 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: { flex: 1 },
  progressPercent: { fontSize: 13, fontWeight: '700' },
  progressButtons: { flexDirection: 'row', gap: 8 },
  progressButton: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  progressButtonText: { fontSize: 12, fontWeight: '700' },
  completeText: { fontSize: 13, fontWeight: '700' },
  examDateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  examDateValue: { fontSize: 15, fontWeight: '700' },
  examCountdown: { fontSize: 12, marginTop: 2 },
  clearText: { fontSize: 13, fontWeight: '700' },
  examDateForm: { flexDirection: 'row', gap: 8 },
  examDateInput: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, fontSize: 14 },
  setDateButton: { paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  setDateButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  errorText: { fontSize: 12, fontWeight: '600' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bodyText: { fontSize: 14, lineHeight: 20 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  resourceText: { fontSize: 14, fontWeight: '600', flex: 1 },
  resourceType: { fontSize: 11 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
