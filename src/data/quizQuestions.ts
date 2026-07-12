import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    dimension: 'problemSolving',
    prompt: "You're given a messy problem with no clear solution. What's your first move?",
    options: [
      { id: 'q1a', label: 'Dive in and experiment until something works', weights: { problemSolving: 3, creativity: 1 } },
      { id: 'q1b', label: 'Research how others have solved it before', weights: { analytical: 3 } },
      { id: 'q1c', label: 'Break it into small, methodical steps', weights: { analytical: 2, problemSolving: 2 } },
      { id: 'q1d', label: 'Talk it through with a teammate', weights: { communication: 3, leadership: 1 } },
    ],
  },
  {
    id: 'q2',
    dimension: 'interests',
    prompt: 'Which sounds like the most appealing way to spend a free Saturday?',
    options: [
      { id: 'q2a', label: 'Building something with code or hardware', weights: { programming: 3, interests: 2 } },
      { id: 'q2b', label: 'Designing or drawing something', weights: { creativity: 3 } },
      { id: 'q2c', label: 'Organizing a group event', weights: { leadership: 3, communication: 2 } },
      { id: 'q2d', label: 'Reading about how systems or markets work', weights: { analytical: 3 } },
    ],
  },
  {
    id: 'q3',
    dimension: 'leadership',
    prompt: 'In a group project, you naturally end up...',
    options: [
      { id: 'q3a', label: 'Taking charge and delegating tasks', weights: { leadership: 3 } },
      { id: 'q3b', label: 'Keeping everyone talking and aligned', weights: { communication: 3 } },
      { id: 'q3c', label: 'Quietly getting the technical work done', weights: { workStyle: 2, programming: 1 } },
      { id: 'q3d', label: 'Double-checking everyone’s numbers and logic', weights: { analytical: 2, math: 1 } },
    ],
  },
  {
    id: 'q4',
    dimension: 'math',
    prompt: 'How do numbers and math make you feel?',
    options: [
      { id: 'q4a', label: 'Energized — I like the precision', weights: { math: 3, analytical: 2 } },
      { id: 'q4b', label: 'Fine, a useful tool but not my favorite', weights: { math: 1 } },
      { id: 'q4c', label: 'It depends on the context', weights: { math: 1, creativity: 1 } },
      { id: 'q4d', label: "I'd rather avoid it if I can", weights: { creativity: 2 } },
    ],
  },
  {
    id: 'q5',
    dimension: 'workStyle',
    prompt: 'Which describes your ideal workday?',
    options: [
      { id: 'q5a', label: 'Deep, focused time alone on hard problems', weights: { workStyle: 3, environment: 1 } },
      { id: 'q5b', label: 'Constant collaboration and meetings', weights: { communication: 3, environment: 3 } },
      { id: 'q5c', label: 'A flexible mix of both', weights: { workStyle: 1, environment: 1 } },
      { id: 'q5d', label: 'Fast-paced — something different every hour', weights: { environment: 3, creativity: 1 } },
    ],
  },
  {
    id: 'q6',
    dimension: 'programming',
    prompt: 'When learning something new and technical, you prefer to...',
    options: [
      { id: 'q6a', label: 'Start writing code or tinkering immediately', weights: { programming: 3 } },
      { id: 'q6b', label: 'Read the documentation thoroughly first', weights: { analytical: 2 } },
      { id: 'q6c', label: 'Watch a video walkthrough', weights: { workStyle: 1 } },
      { id: 'q6d', label: 'Ask someone to show me', weights: { communication: 2 } },
    ],
  },
  {
    id: 'q7',
    dimension: 'creativity',
    prompt: "A friend says 'that's a smart solution.' What would you rather they said?",
    options: [
      { id: 'q7a', label: '"That\'s really clever and creative"', weights: { creativity: 3 } },
      { id: 'q7b', label: '"That\'s really solid reasoning"', weights: { analytical: 2, math: 1 } },
      { id: 'q7c', label: '"That\'s exactly what the team needed"', weights: { leadership: 2, communication: 1 } },
      { id: 'q7d', label: '"That\'s incredibly thorough"', weights: { problemSolving: 2 } },
    ],
  },
  {
    id: 'q8',
    dimension: 'environment',
    prompt: 'How do you feel about responding to urgent, unplanned issues?',
    options: [
      { id: 'q8a', label: 'I like the adrenaline of fixing things fast', weights: { environment: 3, problemSolving: 2 } },
      { id: 'q8b', label: 'I prefer predictable, planned work', weights: { workStyle: 1 } },
      { id: 'q8c', label: "I'm fine with it occasionally", weights: { environment: 1 } },
      { id: 'q8d', label: "I'd rather coordinate the response than fix it myself", weights: { leadership: 2, communication: 1 } },
    ],
  },
  {
    id: 'q9',
    dimension: 'communication',
    prompt: 'Explaining a complicated idea to someone non-technical is...',
    options: [
      { id: 'q9a', label: 'Something I enjoy and I’m good at', weights: { communication: 3 } },
      { id: 'q9b', label: 'Doable, but not my favorite', weights: { communication: 1 } },
      { id: 'q9c', label: 'Better left to someone else', weights: { programming: 1 } },
      { id: 'q9d', label: "I'd rather write it down than explain live", weights: { communication: 1, analytical: 1 } },
    ],
  },
  {
    id: 'q10',
    dimension: 'interests',
    prompt: "What's pulling you toward a tech career in the first place?",
    options: [
      { id: 'q10a', label: 'Building things that people actually use', weights: { interests: 3, programming: 2 } },
      { id: 'q10b', label: 'Protecting systems and people from threats', weights: { interests: 3, analytical: 2 } },
      { id: 'q10c', label: 'Understanding how things work under the hood', weights: { interests: 3, analytical: 2 } },
      { id: 'q10d', label: 'The stability and growth of the field', weights: { interests: 1, workStyle: 1 } },
    ],
  },
];
