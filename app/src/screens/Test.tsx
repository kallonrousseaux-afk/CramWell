import { useState } from 'react'
import { motion } from 'framer-motion'
import { makeQuestion, type QuizQuestion } from '../quiz'
import { useAppState } from '../store'
import { QuestionView } from '../components/QuestionView'
import { Crammy } from '../components/Crammy'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

// Knowt-style practice test: a fixed question set, scored at the end.
// Doesn't touch the FSRS schedule — it's a dress rehearsal, not a review.
export function Test({ onClose }: { onClose: () => void }) {
  const state = useAppState()
  const [questions] = useState<QuizQuestion[]>(() => {
    const pool = [...state.cards].sort(() => Math.random() - 0.5).slice(0, 8)
    return pool.map((c) => makeQuestion(c, state.cards))
  })
  const [pos, setPos] = useState(0)
  const [right, setRight] = useState(0)

  if (questions.length === 0) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Crammy size={110} />
          <h1 style={{ fontSize: 24, marginTop: 16 }}>No cards to test yet</h1>
          <p style={{ color: 'var(--ink-soft)' }}>Snap a problem or paste notes first.</p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--grape" onClick={onClose}>
            Back
          </motion.button>
        </div>
      </div>
    )
  }

  if (pos >= questions.length) {
    const pct = Math.round((right / questions.length) * 100)
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        {pct >= 60 && <Confetti />}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Crammy size={110} mood={pct >= 60 ? 'excited' : 'happy'} />
          <h1 style={{ fontSize: 40, marginTop: 16, color: 'var(--grape-deep)' }}>{pct}%</h1>
          <p style={{ fontWeight: 700, margin: '4px 0 0' }}>
            {right} of {questions.length} correct
          </p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
            {pct === 100
              ? 'Flawless. Walk in confident.'
              : pct >= 60
                ? 'Solid — a Learn round will lock in the rest.'
                : 'Good rehearsal. Learn Mode will get these sticking.'}
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="pill pill--grape"
            style={{ marginTop: 8 }}
            onClick={onClose}
          >
            Done
          </motion.button>
        </div>
      </div>
    )
  }

  const q = questions[pos]
  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Practice test</h1>
        <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
          ✕
        </button>
      </header>
      <div
        aria-hidden
        style={{ height: 6, background: 'var(--hairline)', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}
      >
        <motion.div
          animate={{ width: `${(pos / questions.length) * 100}%` }}
          transition={spring}
          style={{ height: '100%', background: 'var(--grape)', borderRadius: 999 }}
        />
      </div>
      <p className="label" style={{ marginTop: 8, color: 'var(--grape-deep)' }}>
        Question {pos + 1} of {questions.length}
      </p>
      <div style={{ marginTop: 16 }}>
        <QuestionView
          key={pos}
          q={q}
          accent="var(--grape-deep)"
          onAnswer={(correct) => {
            if (correct) setRight(right + 1)
            setPos(pos + 1)
          }}
        />
      </div>
    </div>
  )
}
