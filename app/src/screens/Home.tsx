import { motion } from 'framer-motion'
import { SUBJECT_META } from '../data'
import { dueCards, useAppState } from '../store'
import { Crammy } from '../components/Crammy'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

export function Home({
  onSnap,
  onReview,
  onCreate,
}: {
  onSnap: () => void
  onReview: () => void
  onCreate: () => void
}) {
  const state = useAppState()
  const due = dueCards(state.cards)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="label">{greeting}</div>
          <h1 style={{ fontSize: 32 }}>CramWell</h1>
        </div>
        {state.streak > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            style={{
              background: 'var(--pastel-sunshine)',
              color: '#a06b00',
              borderRadius: 999,
              padding: '8px 16px',
              fontWeight: 800,
            }}
          >
            🔥 {state.streak} day{state.streak > 1 ? 's' : ''}
          </motion.div>
        )}
      </header>

      <motion.button
        whileTap={{ scale: 0.96 }}
        transition={spring}
        onClick={onSnap}
        className="pill pill--coral"
        style={{ width: '100%', marginTop: 24, padding: '22px 24px', fontSize: 20, fontWeight: 800 }}
      >
        📸 Snap a problem
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.96 }}
        transition={spring}
        onClick={onCreate}
        className="pill pill--quiet"
        style={{ width: '100%', marginTop: 12 }}
      >
        📋 Paste notes → flashcards
      </motion.button>

      <section style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 style={{ fontSize: 20 }}>Today's reviews</h2>
          {due.length > 0 && (
            <span className="label" style={{ color: 'var(--sky-deep)' }}>
              {due.length} due
            </span>
          )}
        </div>

        {due.length === 0 ? (
          <div className="card" style={{ marginTop: 12, textAlign: 'center', padding: 28 }}>
            <Crammy />
            <p style={{ margin: '12px 0 4px', fontWeight: 700 }}>All caught up!</p>
            <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Snap a problem to grow your deck.</p>
          </div>
        ) : (
          <>
            {due.slice(0, 3).map((c, i) => {
              const meta = SUBJECT_META[c.problem.subject]
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.06 }}
                  className="card"
                  style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}
                >
                  <div
                    style={{
                      background: meta.tint,
                      borderRadius: 14,
                      width: 44,
                      height: 44,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {meta.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="label" style={{ color: meta.deep }}>
                      {meta.name}
                    </div>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.problem.question}
                    </div>
                  </div>
                </motion.div>
              )
            })}
            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={spring}
              onClick={onReview}
              className="pill pill--sky"
              style={{ width: '100%', marginTop: 16 }}
            >
              Review {due.length} card{due.length > 1 ? 's' : ''}
            </motion.button>
          </>
        )}
      </section>

      <section style={{ marginTop: 28, display: 'flex', gap: 12 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--coral-deep)' }}>{state.totalSolved}</div>
          <div className="label">Solved</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--sky-deep)' }}>{state.totalReviews}</div>
          <div className="label">Reviews</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--grape-deep)' }}>{state.cards.length}</div>
          <div className="label">Cards</div>
        </div>
      </section>
    </div>
  )
}
