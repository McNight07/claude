import { Career, QuizMatch, QuizOption, TraitVector } from '../types';

export function computeTraitVector(selectedOptions: QuizOption[]): TraitVector {
  const result: TraitVector = {};
  for (const option of selectedOptions) {
    for (const [dimension, value] of Object.entries(option.weights)) {
      result[dimension as keyof TraitVector] = (result[dimension as keyof TraitVector] ?? 0) + (value ?? 0);
    }
  }
  return result;
}

function dot(a: TraitVector, b: TraitVector): number {
  let sum = 0;
  for (const key of Object.keys(b)) {
    sum += (a[key as keyof TraitVector] ?? 0) * (b[key as keyof TraitVector] ?? 0);
  }
  return sum;
}

function magnitude(vector: TraitVector): number {
  const sumSquares = Object.values(vector).reduce((sum, value) => sum + (value ?? 0) ** 2, 0);
  return Math.sqrt(sumSquares) || 1;
}

export function matchCareers(userTraits: TraitVector, careers: Career[]): QuizMatch[] {
  const cosineScores = careers.map((career) => ({
    careerId: career.id,
    score: dot(userTraits, career.traits) / (magnitude(userTraits) * magnitude(career.traits)),
  }));

  const scores = cosineScores.map((s) => s.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;

  return cosineScores
    .map(({ careerId, score }) => ({
      careerId,
      matchPercent: Math.round(45 + ((score - min) / range) * 53),
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent);
}
