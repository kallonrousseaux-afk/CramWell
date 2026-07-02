import type { StudyCard } from './data'

export interface QuizQuestion {
  card: StudyCard
  kind: 'choice' | 'truefalse'
  prompt: string
  promptMath?: string
  // For 'choice': shuffled options, one correct. For 'truefalse': the shown
  // answer (options[0]) which may or may not belong to this card.
  options: string[]
  correct: string
  // truefalse only: whether the shown pairing is genuine
  isTrue?: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Flatten simple KaTeX answers into readable plain text for quiz options
// and match tiles, where we can't typeset.
export function latexToPlain(src: string): string {
  return src
    .replace(/\\(?:text|mathrm|mathbf)\{([^}]*)\}/g, '$1')
    .replace(/\\sqrt\{([^}]*)\}/g, '√$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\(?:right)?arrow|\\to/g, '→')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[,;:!]|\\quad|\\qquad/g, ' ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function answerText(c: StudyCard): string {
  return c.problem.answerIsText ? c.problem.answer : latexToPlain(c.problem.answer)
}

export function makeQuestion(card: StudyCard, deck: StudyCard[]): QuizQuestion {
  const others = deck.filter((c) => c.id !== card.id && answerText(c) !== answerText(card))
  const canChoice = others.length >= 2
  const useChoice = canChoice && Math.random() > 0.35

  if (useChoice) {
    const distractors = shuffle(others)
      .slice(0, 3)
      .map((c) => answerText(c))
    return {
      card,
      kind: 'choice',
      prompt: card.problem.question,
      promptMath: card.problem.questionMath,
      options: shuffle([answerText(card), ...distractors]),
      correct: answerText(card),
    }
  }

  const isTrue = others.length === 0 || Math.random() > 0.5
  const shown = isTrue ? answerText(card) : answerText(shuffle(others)[0])
  return {
    card,
    kind: 'truefalse',
    prompt: card.problem.question,
    promptMath: card.problem.questionMath,
    options: [shown],
    correct: answerText(card),
    isTrue,
  }
}
