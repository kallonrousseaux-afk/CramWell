import { createEmptyCard, type Card as FsrsCard } from 'ts-fsrs'

export type Subject = 'math' | 'science' | 'history' | 'languages' | 'other'

export interface SolutionStep {
  title: string
  // KaTeX source rendered in display mode; plain text if `text` is true
  body: string
  text?: boolean
}

export interface Problem {
  subject: Subject
  question: string
  questionMath?: string
  steps: SolutionStep[]
  answer: string
  answerIsText?: boolean
}

export interface StudyCard {
  id: string
  createdAt: number
  problem: Problem
  photo?: string
  fsrs: FsrsCard
}

export interface AppState {
  cards: StudyCard[]
  streak: number
  lastStudyDay: string | null
  totalSolved: number
  totalReviews: number
  examDate: string | null
}

export const SUBJECT_META: Record<Subject, { name: string; tint: string; deep: string; emoji: string }> = {
  math: { name: 'Math', tint: 'var(--pastel-coral)', deep: 'var(--coral-deep)', emoji: '➗' },
  science: { name: 'Science', tint: 'var(--pastel-mint)', deep: 'var(--mint-deep)', emoji: '🧪' },
  history: { name: 'History', tint: 'var(--pastel-sunshine)', deep: '#b8860b', emoji: '🏛️' },
  languages: { name: 'Languages', tint: 'var(--pastel-sky)', deep: 'var(--sky-deep)', emoji: '💬' },
  other: { name: 'Other', tint: 'var(--pastel-grape)', deep: 'var(--grape-deep)', emoji: '✨' },
}

// Demo-mode solutions: the AI solver isn't wired up yet, so snaps cycle
// through these fully worked problems.
export const DEMO_PROBLEMS: Problem[] = [
  {
    subject: 'math',
    question: 'Solve the quadratic equation',
    questionMath: 'x^2 - 5x + 6 = 0',
    steps: [
      { title: 'Spot the pattern', body: '\\text{We need two numbers that multiply to } 6 \\text{ and add to } {-5}.' },
      { title: 'Factor it', body: 'x^2 - 5x + 6 = (x - 2)(x - 3)' },
      { title: 'Set each factor to zero', body: 'x - 2 = 0 \\quad \\text{or} \\quad x - 3 = 0' },
    ],
    answer: 'x = 2 \\;\\text{ or }\\; x = 3',
  },
  {
    subject: 'math',
    question: 'Differentiate the function',
    questionMath: 'f(x) = 3x^2 \\sin(x)',
    steps: [
      { title: 'Pick the product rule', body: "(uv)' = u'v + uv' \\quad\\text{with } u = 3x^2,\\; v = \\sin(x)" },
      { title: 'Differentiate each piece', body: "u' = 6x \\qquad v' = \\cos(x)" },
      { title: 'Combine', body: "f'(x) = 6x\\sin(x) + 3x^2\\cos(x)" },
    ],
    answer: "f'(x) = 3x\\left(2\\sin(x) + x\\cos(x)\\right)",
  },
  {
    subject: 'science',
    question: 'Balance the chemical equation',
    questionMath: '\\mathrm{C_3H_8 + O_2 \\rightarrow CO_2 + H_2O}',
    steps: [
      { title: 'Count carbons', body: '3 \\text{ C on the left} \\Rightarrow 3\\,\\mathrm{CO_2}' },
      { title: 'Count hydrogens', body: '8 \\text{ H on the left} \\Rightarrow 4\\,\\mathrm{H_2O}' },
      { title: 'Balance oxygens last', body: '(3 \\times 2) + (4 \\times 1) = 10 \\text{ O} \\Rightarrow 5\\,\\mathrm{O_2}' },
    ],
    answer: '\\mathrm{C_3H_8 + 5O_2 \\rightarrow 3CO_2 + 4H_2O}',
  },
  {
    subject: 'math',
    question: 'Find the missing side of a right triangle with legs 5 and 12',
    steps: [
      { title: 'Use the Pythagorean theorem', body: 'a^2 + b^2 = c^2' },
      { title: 'Plug in the legs', body: '5^2 + 12^2 = 25 + 144 = 169' },
      { title: 'Take the square root', body: 'c = \\sqrt{169} = 13' },
    ],
    answer: 'c = 13',
  },
  {
    subject: 'history',
    question: 'What caused the fall of the Western Roman Empire?',
    steps: [
      {
        title: 'No single cause',
        body: 'Historians point to a combination of pressures over the 4th–5th centuries, not one event.',
        text: true,
      },
      {
        title: 'The big four',
        body: 'Economic decline and overtaxation, overreliance on mercenary armies, political instability (26 emperors in 50 years), and migrating Germanic peoples pushed by the Huns.',
        text: true,
      },
      {
        title: 'The endpoint',
        body: 'In 476 CE, the Germanic leader Odoacer deposed the last western emperor, Romulus Augustulus.',
        text: true,
      },
    ],
    answer: 'A combination of economic, military, and political decline, ending when Odoacer deposed Romulus Augustulus in 476 CE.',
    answerIsText: true,
  },
]

export function makeCard(problem: Problem, photo?: string): StudyCard {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    problem,
    photo,
    fsrs: createEmptyCard(new Date()),
  }
}
