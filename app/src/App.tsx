import { useState } from 'react'
import { motion } from 'framer-motion'
import type { StudyCard } from './data'
import { Home } from './screens/Home'
import { Snap } from './screens/Snap'
import { Solution } from './screens/Solution'
import { Review } from './screens/Review'
import { Cram } from './screens/Cram'

type Tab = 'home' | 'review' | 'cram'
type Overlay = { kind: 'none' } | { kind: 'snap' } | { kind: 'solution'; card: StudyCard } | { kind: 'cram-session' }

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'review', label: 'Review', icon: '🃏' },
  { id: 'cram', label: 'Cram', icon: '⏳' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' })

  const openSnap = () => setOverlay({ kind: 'snap' })

  if (overlay.kind === 'snap') {
    return (
      <Snap
        onClose={() => setOverlay({ kind: 'none' })}
        onSolved={(card) => setOverlay({ kind: 'solution', card })}
      />
    )
  }
  if (overlay.kind === 'solution') {
    return <Solution card={overlay.card} onDone={() => setOverlay({ kind: 'none' })} />
  }
  if (overlay.kind === 'cram-session') {
    return (
      <div>
        <Review key="cram" cramming onSnap={openSnap} />
        <BackBar label="Done cramming" onClick={() => setOverlay({ kind: 'none' })} />
      </div>
    )
  }

  return (
    <div>
      {tab === 'home' && <Home onSnap={openSnap} onReview={() => setTab('review')} />}
      {tab === 'review' && <Review key="review" onSnap={openSnap} />}
      {tab === 'cram' && <Cram onStart={() => setOverlay({ kind: 'cram-session' })} />}

      <nav
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(440px, calc(100% - 40px))',
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 999,
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          padding: 6,
          zIndex: 40,
        }}
      >
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 14,
              background: tab === t.id ? 'var(--pastel-coral)' : 'transparent',
              color: tab === t.id ? 'var(--coral-deep)' : 'var(--ink-soft)',
            }}
          >
            {t.icon} {t.label}
          </motion.button>
        ))}
      </nav>
    </div>
  )
}

function BackBar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={spring}
      onClick={onClick}
      className="pill pill--quiet"
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(440px, calc(100% - 40px))',
        zIndex: 40,
      }}
    >
      {label}
    </motion.button>
  )
}
