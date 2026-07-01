import { motion } from 'framer-motion'
import { coverage, dueCards, setExamDate, useAppState } from '../store'
import { Crammy } from '../components/Crammy'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

export function Cram({ onStart }: { onStart: () => void }) {
  const state = useAppState()
  const cov = coverage(state.cards)
  const due = dueCards(state.cards, true)
  const daysLeft = state.examDate
    ? Math.max(0, Math.ceil((new Date(state.examDate + 'T23:59:59').getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="screen">
      <div className="label" style={{ color: 'var(--grape-deep)' }}>
        Exam coming up?
      </div>
      <h1 style={{ fontSize: 32 }}>Cram Mode</h1>

      <div
        className="card"
        style={{ marginTop: 20, background: 'var(--pastel-grape)', border: 'none', boxShadow: 'var(--shadow-grape)' }}
      >
        <label className="label" htmlFor="exam-date" style={{ color: 'var(--grape-deep)' }}>
          Exam date
        </label>
        <input
          id="exam-date"
          type="date"
          value={state.examDate ?? ''}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setExamDate(e.target.value || null)}
          style={{ marginTop: 8 }}
        />
        {daysLeft !== null && (
          <p style={{ margin: '12px 0 0', fontWeight: 800, fontSize: 20, color: 'var(--grape-deep)' }}>
            {daysLeft === 0 ? "It's today — deep breath, you've got this." : `${daysLeft} day${daysLeft > 1 ? 's' : ''} to go`}
          </p>
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="label">Deck coverage</span>
          <span style={{ fontWeight: 800, color: 'var(--grape-deep)' }}>{Math.round(cov * 100)}%</span>
        </div>
        <div style={{ height: 10, background: 'var(--hairline)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${cov * 100}%` }}
            transition={spring}
            style={{ height: '100%', background: 'var(--grape)', borderRadius: 999 }}
          />
        </div>
        <p style={{ margin: '10px 0 0', color: 'var(--ink-soft)', fontSize: 14 }}>
          The share of your {state.cards.length} card{state.cards.length !== 1 ? 's' : ''} you've made stick so far — honest
          number, no fake 100%.
        </p>
      </div>

      {due.length > 0 ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          transition={spring}
          className="pill pill--grape"
          style={{ width: '100%', marginTop: 20, padding: '18px 24px', fontSize: 17 }}
          onClick={onStart}
        >
          Cram {due.length} card{due.length > 1 ? 's' : ''} now
        </motion.button>
      ) : (
        <div className="card" style={{ marginTop: 20, textAlign: 'center', padding: 28 }}>
          <Crammy mood="excited" />
          <p style={{ margin: '12px 0 4px', fontWeight: 700 }}>Everything's fresh in your memory.</p>
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Check back closer to exam day.</p>
        </div>
      )}
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14, marginTop: 12 }}>
        Cram Mode pulls forward everything due in the next 3 days.
      </p>
    </div>
  )
}
