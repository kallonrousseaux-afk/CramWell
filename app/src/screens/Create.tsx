import { useState } from 'react'
import { motion } from 'framer-motion'
import { makeCard, SUBJECT_META, type Subject } from '../data'
import { parseNotes } from '../notes'
import { addCards } from '../store'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }
const SUBJECTS = Object.keys(SUBJECT_META) as Subject[]

export function Create({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('')
  const [subject, setSubject] = useState<Subject>('other')
  const [added, setAdded] = useState(0)
  const problems = parseNotes(text, subject)

  if (added > 0) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <Confetti />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 24 }}>
            {added} card{added > 1 ? 's' : ''} added!
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>They're in your review queue, scheduled and ready.</p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--mint" onClick={onClose}>
            Back to studying
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Notes → flashcards</h1>
        <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
          ✕
        </button>
      </header>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
        Paste your notes — one fact per line, like <strong>Mitochondria: powerhouse of the cell</strong>.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {SUBJECTS.map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            onClick={() => setSubject(s)}
            className="pill"
            style={{
              padding: '8px 16px',
              fontSize: 14,
              background: subject === s ? SUBJECT_META[s].tint : 'var(--surface)',
              color: subject === s ? SUBJECT_META[s].deep : 'var(--ink-soft)',
              border: `1px solid ${subject === s ? 'transparent' : 'var(--hairline)'}`,
            }}
          >
            {SUBJECT_META[s].emoji} {SUBJECT_META[s].name}
          </motion.button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'Photosynthesis: how plants turn light into energy\nWhat year did WW2 end? 1945\nAmygdala - processes fear and emotion'}
        rows={9}
        style={{
          width: '100%',
          marginTop: 16,
          fontFamily: 'inherit',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--ink)',
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-input)',
          padding: '12px 16px',
          resize: 'vertical',
        }}
      />

      {problems.length > 0 && (
        <div className="card" style={{ marginTop: 16, background: 'var(--pastel-mint)', border: 'none' }}>
          <div className="label" style={{ color: 'var(--mint-deep)' }}>
            Preview — {problems.length} card{problems.length > 1 ? 's' : ''} found
          </div>
          {problems.slice(0, 3).map((p, i) => (
            <p key={i} style={{ margin: '8px 0 0', fontSize: 14 }}>
              <strong>{p.question}</strong> → {p.answer}
            </p>
          ))}
          {problems.length > 3 && (
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-soft)' }}>…and {problems.length - 3} more</p>
          )}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className="pill pill--mint"
        style={{ width: '100%', marginTop: 16, padding: '18px 24px', fontSize: 17, opacity: problems.length ? 1 : 0.5 }}
        disabled={problems.length === 0}
        onClick={() => {
          addCards(problems.map((p) => makeCard(p)))
          setAdded(problems.length)
        }}
      >
        Make {problems.length || ''} flashcard{problems.length === 1 ? '' : 's'}
      </motion.button>
    </div>
  )
}
