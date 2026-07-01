import { useSyncExternalStore } from 'react'
import { fsrs, Rating, type Grade } from 'ts-fsrs'
import { DEMO_PROBLEMS, makeCard, type AppState, type StudyCard } from './data'

const KEY = 'cramwell-v1'
const scheduler = fsrs()

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function seedState(): AppState {
  // Two starter cards so Review works before the first snap.
  return {
    cards: [makeCard(DEMO_PROBLEMS[0]), makeCard(DEMO_PROBLEMS[4])],
    streak: 0,
    lastStudyDay: null,
    totalSolved: 0,
    totalReviews: 0,
    examDate: null,
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      for (const c of parsed.cards) {
        c.fsrs.due = new Date(c.fsrs.due)
        if (c.fsrs.last_review) c.fsrs.last_review = new Date(c.fsrs.last_review)
      }
      return parsed
    }
  } catch {
    // fall through to a fresh seed
  }
  return seedState()
}

let state: AppState = load()
const listeners = new Set<() => void>()

function commit(next: AppState) {
  state = next
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

function bumpStreak(s: AppState): Pick<AppState, 'streak' | 'lastStudyDay'> {
  const today = todayKey()
  if (s.lastStudyDay === today) return { streak: s.streak, lastStudyDay: today }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return { streak: s.lastStudyDay === yesterday ? s.streak + 1 : 1, lastStudyDay: today }
}

export function addSolvedCard(card: StudyCard) {
  commit({
    ...state,
    cards: [card, ...state.cards],
    totalSolved: state.totalSolved + 1,
    ...bumpStreak(state),
  })
}

export const GRADES = [
  { grade: Rating.Again as Grade, label: 'Again', tint: 'var(--pastel-coral)', deep: 'var(--coral-deep)' },
  { grade: Rating.Hard as Grade, label: 'Hard', tint: 'var(--pastel-sunshine)', deep: '#a06b00' },
  { grade: Rating.Good as Grade, label: 'Good', tint: 'var(--pastel-sky)', deep: 'var(--sky-deep)' },
  { grade: Rating.Easy as Grade, label: 'Easy', tint: 'var(--pastel-mint)', deep: 'var(--mint-deep)' },
]

export function reviewCard(id: string, grade: Grade) {
  const card = state.cards.find((c) => c.id === id)
  if (!card) return
  const { card: next } = scheduler.next(card.fsrs, new Date(), grade)
  commit({
    ...state,
    cards: state.cards.map((c) => (c.id === id ? { ...c, fsrs: next } : c)),
    totalReviews: state.totalReviews + 1,
    ...bumpStreak(state),
  })
}

export function setExamDate(examDate: string | null) {
  commit({ ...state, examDate })
}

export function dueCards(all: StudyCard[] = state.cards, cramming = false): StudyCard[] {
  const now = Date.now()
  // Cram Mode compresses the schedule: anything due in the next 3 days counts.
  const horizon = cramming ? now + 3 * 86400000 : now
  return all
    .filter((c) => c.fsrs.due.getTime() <= horizon)
    .sort((a, b) => a.fsrs.due.getTime() - b.fsrs.due.getTime())
}

// Honest coverage: share of cards with enough stability to likely survive to exam day.
export function coverage(all: StudyCard[]): number {
  if (all.length === 0) return 0
  const solid = all.filter((c) => c.fsrs.stability >= 2 && c.fsrs.reps > 0).length
  return solid / all.length
}
