import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Grade } from 'ts-fsrs'
import { SUBJECT_META, type StudyCard } from '../data'
import { dueCards, GRADES, reviewCard, useAppState } from '../store'
import { TeX } from '../components/Math'
import { Crammy } from '../components/Crammy'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

export function Review({ cramming = false, onSnap }: { cramming?: boolean; onSnap: () => void }) {
  const state = useAppState()
  // Freeze the session queue on first render so grading doesn't reshuffle mid-session.
  const [initialQueue] = useState(() => dueCards(state.cards, cramming).map((c) => c.id))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)

  const queue = initialQueue
    .map((id) => state.cards.find((c) => c.id === id))
    .filter((c): c is StudyCard => !!c)
  const card = queue[pos]
  const accent = cramming ? 'var(--grape-deep)' : 'var(--sky-deep)'

  function grade(g: Grade) {
    if (!card) return
    reviewCard(card.id, g)
    setFlipped(false)
    setDone(done + 1)
    setPos(pos + 1)
  }

  if (!card) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        {done > 0 && <Confetti />}
        <div style={{ textAlign: 'center' }}>
          <Crammy size={110} mood="excited" />
          <h1 style={{ fontSize: 24, marginTop: 16 }}>{done > 0 ? `Nice — ${done} card${done > 1 ? 's' : ''} down!` : 'Nothing due right now'}</h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            {done > 0 ? 'Your future self says thanks.' : 'Snap a problem to grow your deck.'}
          </p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--coral" onClick={onSnap}>
            📸 Snap a problem
          </motion.button>
        </div>
      </div>
    )
  }

  const meta = SUBJECT_META[card.problem.subject]

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>{cramming ? 'Cram session' : 'Review'}</h1>
        <span className="label" style={{ color: accent }}>
          {pos + 1} / {queue.length}
        </span>
      </div>
      <div
        aria-hidden
        style={{ height: 6, background: 'var(--hairline)', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}
      >
        <motion.div
          animate={{ width: `${(pos / queue.length) * 100}%` }}
          transition={spring}
          style={{ height: '100%', background: accent, borderRadius: 999 }}
        />
      </div>

      <div style={{ flex: 1, display: 'grid', placeItems: 'center', perspective: 1200, marginTop: 16 }}>
        <AnimatePresence mode="wait">
          <motion.button
            key={card.id + (flipped ? '-b' : '-f')}
            initial={{ rotateY: flipped ? -90 : 0, opacity: flipped ? 0.4 : 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={() => setFlipped(true)}
            className="card"
            style={{
              width: '100%',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              textAlign: 'center',
              cursor: flipped ? 'default' : 'pointer',
              background: flipped ? 'var(--surface)' : meta.tint,
              border: flipped ? '1px solid var(--hairline)' : 'none',
              boxShadow: 'var(--shadow-soft)',
              borderRadius: 20,
              fontSize: 'inherit',
              fontWeight: 'inherit',
            }}
          >
            <span className="label" style={{ color: meta.deep }}>
              {meta.emoji} {meta.name} {flipped ? '· Answer' : ''}
            </span>
            {flipped ? (
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {card.problem.answerIsText ? card.problem.answer : <TeX src={card.problem.answer} block />}
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{card.problem.question}</div>
                {card.problem.questionMath && <TeX src={card.problem.questionMath} block />}
                <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Tap to reveal</span>
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, minHeight: 56 }}>
        {flipped &&
          GRADES.map((g, i) => (
            <motion.button
              key={g.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.94 }}
              transition={{ ...spring, delay: i * 0.04 }}
              onClick={() => grade(g.grade)}
              className="pill"
              style={{ flex: 1, padding: '14px 4px', background: g.tint, color: g.deep, fontWeight: 800 }}
            >
              {g.label}
            </motion.button>
          ))}
      </div>
    </div>
  )
}
