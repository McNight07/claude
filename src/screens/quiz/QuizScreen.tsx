import Feather from '@expo/vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '../../components/GradientButton';
import { ProgressBar } from '../../components/ProgressBar';
import { QuizOptionButton } from '../../components/quiz/QuizOptionButton';
import { useAppData } from '../../context/AppDataContext';
import { computeTraitVector, matchCareers } from '../../quiz/scoring';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { QuizOption } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation }: Props) {
  const theme = useTheme();
  const { quizQuestions, careers, saveQuizResult } = useAppData();
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, QuizOption>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = quizQuestions[index];
  const isLast = index === quizQuestions.length - 1;
  const selectedOption = question ? selections[question.id] : undefined;

  const handleSelect = (option: QuizOption) => {
    if (!question) return;
    setSelections((prev) => ({ ...prev, [question.id]: option }));
  };

  const handleNext = async () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    try {
      const chosen = Object.values(selections);
      const traits = computeTraitVector(chosen);
      const matches = matchCareers(traits, careers);
      const result = await saveQuizResult(traits, matches);
      navigation.replace('QuizResult', { resultId: result.id });
    } finally {
      setSubmitting(false);
    }
  };

  if (!question) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text, padding: 20 }}>No quiz questions available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()} hitSlop={10}>
          <Feather name="x" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.progressText, { color: theme.textMuted }]}>
          {index + 1} / {quizQuestions.length}
        </Text>
      </View>

      <View style={styles.progressBarWrap}>
        <ProgressBar progress={(index + 1) / quizQuestions.length} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.prompt, { color: theme.text }]}>{question.prompt}</Text>

        <View style={styles.options}>
          {question.options.map((option, i) => (
            <QuizOptionButton
              key={option.id}
              testID={`quiz-option-${i}`}
              label={option.label}
              selected={selectedOption?.id === option.id}
              onPress={() => handleSelect(option)}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {index > 0 ? (
          <TouchableOpacity onPress={() => setIndex((i) => i - 1)} style={styles.backButton} hitSlop={8}>
            <Text style={[styles.backText, { color: theme.textMuted }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <GradientButton
          label={submitting ? 'Scoring…' : isLast ? 'See My Results' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
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
  progressText: { fontSize: 13, fontWeight: '700' },
  progressBarWrap: { paddingHorizontal: 20, marginTop: 4 },
  content: { flex: 1, padding: 20, gap: 20 },
  prompt: { fontSize: 20, fontWeight: '800', lineHeight: 27 },
  options: { gap: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  backButton: { width: 60 },
  backText: { fontSize: 14, fontWeight: '700' },
  nextButton: { flex: 1 },
});
