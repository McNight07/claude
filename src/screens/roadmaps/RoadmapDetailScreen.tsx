import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Pill } from '../../components/Pill';
import { ProgressBar } from '../../components/ProgressBar';
import { useAppData } from '../../context/AppDataContext';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { RoadmapStep } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoadmapDetail'>;

export function RoadmapDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { roadmaps, certifications, getRoadmapProgress, toggleRoadmapStep } = useAppData();
  const roadmap = roadmaps.find((r) => r.id === route.params.roadmapId);

  if (!roadmap) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, padding: 20 }}>Roadmap not found.</Text>
      </SafeAreaView>
    );
  }

  const progressRecord = getRoadmapProgress(roadmap.id);
  const completedIds = progressRecord?.completedStepIds ?? [];
  const progress = completedIds.length / roadmap.steps.length;

  const isUnlocked = (index: number) => index === 0 || completedIds.includes(roadmap.steps[index - 1].id);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{roadmap.title}</Text>
        <Text style={[styles.description, { color: theme.textMuted }]}>{roadmap.description}</Text>
        <Pill label={roadmap.level} color={theme.purple} />

        <View style={styles.overallProgressRow}>
          <View style={styles.overallProgressTrack}>
            <ProgressBar progress={progress} />
          </View>
          <Text style={[styles.overallProgressText, { color: theme.teal }]}>{Math.round(progress * 100)}%</Text>
        </View>

        <View style={styles.steps}>
          {roadmap.steps.map((step, index) => {
            const unlocked = isUnlocked(index);
            const done = completedIds.includes(step.id);
            const certification = step.certificationId
              ? certifications.find((c) => c.id === step.certificationId)
              : undefined;

            return (
              <StepRow
                key={step.id}
                step={step}
                index={index}
                unlocked={unlocked}
                done={done}
                isLast={index === roadmap.steps.length - 1}
                onToggle={() => unlocked && toggleRoadmapStep(roadmap.id, step.id)}
                onOpenCertification={
                  certification ? () => navigation.navigate('CertificationDetail', { certificationId: certification.id }) : undefined
                }
                theme={theme}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepRow({
  step,
  index,
  unlocked,
  done,
  isLast,
  onToggle,
  onOpenCertification,
  theme,
}: {
  step: RoadmapStep;
  index: number;
  unlocked: boolean;
  done: boolean;
  isLast: boolean;
  onToggle: () => void;
  onOpenCertification?: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const nodeColor = done ? theme.teal : unlocked ? theme.blue : theme.border;
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepTrack}>
        <View style={[styles.stepNode, { backgroundColor: done ? theme.teal : theme.card, borderColor: nodeColor }]}>
          {done ? (
            <Feather name="check" size={14} color="#FFFFFF" />
          ) : unlocked ? (
            <Text style={[styles.stepNumber, { color: theme.blue }]}>{index + 1}</Text>
          ) : (
            <Feather name="lock" size={12} color={theme.textFaint} />
          )}
        </View>
        {!isLast ? <View style={[styles.stepConnector, { backgroundColor: done ? theme.teal : theme.border }]} /> : null}
      </View>

      <TouchableOpacity
        disabled={!unlocked}
        onPress={onToggle}
        activeOpacity={0.85}
        style={styles.stepCardWrap}
      >
        <Card style={[styles.stepCard, !unlocked && styles.stepCardLocked]}>
          <View style={styles.stepHeaderRow}>
            <Text style={[styles.stepLabel, { color: unlocked ? theme.text : theme.textFaint }]}>{step.label}</Text>
            <Pill label={step.type} color={theme.textFaint} />
          </View>
          <Text style={[styles.stepDescription, { color: theme.textMuted }]}>{step.description}</Text>
          <Text style={[styles.stepMeta, { color: theme.textFaint }]}>~{step.estimatedWeeks} weeks</Text>
          {onOpenCertification ? (
            <TouchableOpacity onPress={onOpenCertification} style={styles.certLink} hitSlop={6}>
              <Feather name="award" size={13} color={theme.blue} />
              <Text style={[styles.certLinkText, { color: theme.blue }]}>View certification</Text>
            </TouchableOpacity>
          ) : null}
          {unlocked ? (
            <Text style={[styles.tapHint, { color: theme.textFaint }]}>
              {done ? 'Tap to mark incomplete' : 'Tap to mark complete'}
            </Text>
          ) : null}
        </Card>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingVertical: 8 },
  content: { padding: 20, paddingTop: 4, gap: 14 },
  title: { fontSize: 22, fontWeight: '800' },
  description: { fontSize: 14, lineHeight: 20, marginTop: -8 },
  overallProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  overallProgressTrack: { flex: 1 },
  overallProgressText: { fontSize: 13, fontWeight: '700' },
  steps: { marginTop: 8 },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepTrack: { alignItems: 'center', width: 32 },
  stepNode: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontSize: 12, fontWeight: '700' },
  stepConnector: { width: 2, flex: 1, minHeight: 24 },
  stepCardWrap: { flex: 1, paddingBottom: 12 },
  stepCard: { gap: 4 },
  stepCardLocked: { opacity: 0.55 },
  stepHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stepLabel: { fontSize: 15, fontWeight: '700', flex: 1 },
  stepDescription: { fontSize: 13, lineHeight: 18 },
  stepMeta: { fontSize: 11 },
  certLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  certLinkText: { fontSize: 12.5, fontWeight: '700' },
  tapHint: { fontSize: 11, marginTop: 2, fontStyle: 'italic' },
});
