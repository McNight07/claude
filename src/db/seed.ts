import { careers } from '../data/careers';
import { certifications } from '../data/certifications';
import { quizQuestions } from '../data/quizQuestions';
import { roadmaps } from '../data/roadmaps';
import { seedIfEmpty } from './localDb';

export async function seedDatabase(): Promise<void> {
  await Promise.all([
    seedIfEmpty('careers', Object.fromEntries(careers.map((c) => [c.id, c]))),
    seedIfEmpty('certifications', Object.fromEntries(certifications.map((c) => [c.id, c]))),
    seedIfEmpty('roadmaps', Object.fromEntries(roadmaps.map((r) => [r.id, r]))),
    seedIfEmpty('quizQuestions', Object.fromEntries(quizQuestions.map((q) => [q.id, q]))),
  ]);
}
