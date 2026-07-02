import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rating, type Grade } from 'ts-fsrs'
import { makeQuestion, type QuizQuestion } from '../quiz'
import { reviewCard, useAppState } from '../store'
import { QuestionView } from '../components/QuestionView'
import { Crammy } from '../components/Crammy'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }
const MASTERY = 2

// Knowt-style Learn Mode: adaptive multiple choice / true-false. Each card
// needs MASTERY correct answers; misses put it back in the queue. The first
// answer per card also feeds the FSRS scheduler.
export function Learn({ onClose }: { onClose: () => void }) {
  const state = useAppState()
  const [session] = useState(() => {
    const pool = [...state.cards].sort(() => Math.random() - 0.5).slice(0, 7)
    return pool.map((c) => c.id)
  })
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [graded, setGraded] = useState<Record<string, boolean>>({})
  const [queue, setQueue] = useState<string[]>(session)
  const [question, setQuestion] = useState<QuizQuestion | null>(() => null)

  const deck = state.cards
  const byId = (id: string) => deck.find((c) => c.id === id)

  const mastered = session.filter((id) => (progress[id] ?? 0) >= MASTERY).length
  const currentId = queue[0]
  const currentCard = currentId ? byId(currentId) : undefined

  if (currentCard && (!question || question.card.id !== currentCard.id)) {
    setQuestion(makeQuestion(currentCard, deck))
    return null
  }

  function answered(correct: boolean) {
    const id = currentId
    if (!graded[id]) {
      reviewCard(id, (correct ? Rating.Good : Rating.Again) as Grade)
      setGraded({ ...graded, [id]: true })
    }
    const nextCount = correct ? (progress[id] ?? 0) + 1 : 0
    setProgress({ ...progress, [id]: nextCount })
    const rest = queue.slice(1)
    // Requeue unless mastered: soon if wrong, later if right.
    setQueue(nextCount >= MASTERY ? rest : correct ? [...rest, id] : [...rest.slice(0, 2), id, ...rest.slice(2)])
  }

  if (!currentCard || session.length === 0) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        {mastered > 0 && <Confetti />}
        <div style={{ textAlign: 'center' }}>
          <Crammy size={110} mood="excited" />
          <h1 style={{ fontSize: 24, marginTop: 16 }}>
            {session.length === 0 ? 'No cards yet' : `${mastered} card${mastered > 1 ? 's' : ''} mastered!`}
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            {session.length === 0 ? 'Snap a problem or paste notes to get started.' : 'Learn Mode round complete.'}
          </p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--sky" onClick={onClose}>
            Done
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Learn</h1>
        <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
          ✕
        </button>
      </header>
      <div
        aria-hidden
        style={{ height: 6, background: 'var(--hairline)', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}
      >
        <motion.div
          animate={{ width: `${(mastered / session.length) * 100}%` }}
          transition={spring}
          style={{ height: '100%', background: 'var(--sky)', borderRadius: 999 }}
        />
      </div>
      <p className="label" style={{ marginTop: 8, color: 'var(--sky-deep)' }}>
        {mastered} of {session.length} mastered
      </p>

      <div style={{ marginTop: 16 }}>
        {question && <QuestionView key={question.card.id + String(progress[question.card.id] ?? 0)} q={question} accent="var(--sky-deep)" onAnswer={answered} />}
      </div>
    </div>
  )
}
