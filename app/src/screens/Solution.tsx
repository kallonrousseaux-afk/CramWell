import { useState } from 'react'
import { motion } from 'framer-motion'
import { SUBJECT_META, type StudyCard } from '../data'
import { TeX } from '../components/Math'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

export function Solution({ card, onDone }: { card: StudyCard; onDone: () => void }) {
  const [added, setAdded] = useState(false)
  const meta = SUBJECT_META[card.problem.subject]

  return (
    <div className="screen">
      <Confetti />
      <div className="label" style={{ color: meta.deep }}>
        {meta.emoji} {meta.name} · Solved
      </div>
      <h1 style={{ fontSize: 24, marginTop: 4 }}>{card.problem.question}</h1>

      {card.photo && (
        <img
          src={card.photo}
          alt="Your snapped problem"
          style={{
            width: '100%',
            maxHeight: 160,
            objectFit: 'cover',
            borderRadius: 20,
            marginTop: 16,
            border: '1px solid var(--hairline)',
          }}
        />
      )}

      {card.problem.questionMath && (
        <div className="card" style={{ marginTop: 16, background: meta.tint, border: 'none' }}>
          <TeX src={card.problem.questionMath} block />
        </div>
      )}

      <section style={{ marginTop: 20 }}>
        {card.problem.steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 + i * 0.12 }}
            className="card"
            style={{ marginTop: 12 }}
          >
            <div className="label" style={{ color: meta.deep }}>
              Step {i + 1} — {step.title}
            </div>
            <div style={{ marginTop: 6 }}>{step.text ? <p style={{ margin: 0 }}>{step.body}</p> : <TeX src={step.body} block />}</div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.15 + card.problem.steps.length * 0.12 }}
          className="card"
          style={{
            marginTop: 16,
            background: 'var(--pastel-mint)',
            border: 'none',
            boxShadow: 'var(--shadow-mint)',
          }}
        >
          <div className="label" style={{ color: 'var(--mint-deep)' }}>
            Answer
          </div>
          <div style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}>
            {card.problem.answerIsText ? card.problem.answer : <TeX src={card.problem.answer} block />}
          </div>
        </motion.div>
      </section>

      <motion.button
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className={`pill ${added ? 'pill--quiet' : 'pill--mint'}`}
        style={{ width: '100%', marginTop: 24, padding: '18px 24px', fontSize: 17 }}
        onClick={() => {
          setAdded(true)
          setTimeout(onDone, 600)
        }}
        disabled={added}
      >
        {added ? '✓ Added to your deck' : 'Got it — add to my deck'}
      </motion.button>
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14, marginTop: 12 }}>
        This becomes a flashcard — CramWell will remind you right before you'd forget it.
      </p>
    </div>
  )
}
