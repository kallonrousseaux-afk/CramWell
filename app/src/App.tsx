import { useState } from 'react'
import { motion } from 'framer-motion'
import type { StudyCard } from './data'
import { Home } from './screens/Home'
import { Snap } from './screens/Snap'
import { Solution } from './screens/Solution'
import { Review } from './screens/Review'
import { Cram } from './screens/Cram'
import { Create } from './screens/Create'
import { Learn } from './screens/Learn'
import { Test } from './screens/Test'
import { Match } from './screens/Match'
import { Podcast } from './screens/Podcast'
import { Record } from './screens/Record'
import { Focus } from './screens/Focus'

type Tab = 'home' | 'study' | 'cram'
type Overlay =
  | { kind: 'none' }
  | { kind: 'snap' }
  | { kind: 'solution'; card: StudyCard }
  | { kind: 'cram-session' }
  | { kind: 'create'; initialText?: string }
  | { kind: 'learn' }
  | { kind: 'test' }
  | { kind: 'match' }
  | { kind: 'podcast' }
  | { kind: 'record' }
  | { kind: 'focus' }

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'study', label: 'Study', icon: '🃏' },
  { id: 'cram', label: 'Cram', icon: '⏳' },
]

const MODES = [
  { kind: 'learn' as const, label: 'Learn', icon: '🧠', tint: 'var(--pastel-sky)', deep: 'var(--sky-deep)' },
  { kind: 'test' as const, label: 'Test', icon: '📝', tint: 'var(--pastel-grape)', deep: 'var(--grape-deep)' },
  { kind: 'match' as const, label: 'Match', icon: '⚡', tint: 'var(--pastel-sunshine)', deep: '#a06b00' },
  { kind: 'create' as const, label: 'Add notes', icon: '📋', tint: 'var(--pastel-mint)', deep: 'var(--mint-deep)' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' })

  const openSnap = () => setOverlay({ kind: 'snap' })
  const close = () => setOverlay({ kind: 'none' })

  switch (overlay.kind) {
    case 'snap':
      return <Snap onClose={close} onSolved={(card) => setOverlay({ kind: 'solution', card })} />
    case 'solution':
      return <Solution card={overlay.card} onDone={close} />
    case 'create':
      return <Create onClose={close} initialText={overlay.initialText} />
    case 'podcast':
      return <Podcast onClose={close} />
    case 'record':
      return <Record onClose={close} onUseTranscript={(text) => setOverlay({ kind: 'create', initialText: text })} />
    case 'focus':
      return <Focus onClose={close} />
    case 'learn':
      return <Learn onClose={close} />
    case 'test':
      return <Test onClose={close} />
    case 'match':
      return <Match onClose={close} />
    case 'cram-session':
      return (
        <div>
          <Review key="cram" cramming onSnap={openSnap} />
          <BackBar label="Done cramming" onClick={close} />
        </div>
      )
  }

  return (
    <div>
      {tab === 'home' && (
        <Home
          onSnap={openSnap}
          onReview={() => setTab('study')}
          onCreate={() => setOverlay({ kind: 'create' })}
          onOpen={(kind) => setOverlay({ kind })}
        />
      )}
      {tab === 'study' && (
        <div>
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {MODES.map((m) => (
                <motion.button
                  key={m.kind}
                  whileTap={{ scale: 0.94 }}
                  transition={spring}
                  onClick={() => setOverlay({ kind: m.kind })}
                  className="pill"
                  style={{ flex: 1, padding: '10px 4px', fontSize: 13, fontWeight: 800, background: m.tint, color: m.deep }}
                >
                  {m.icon} {m.label}
                </motion.button>
              ))}
            </div>
          </div>
          <Review key="review" onSnap={openSnap} embedded />
        </div>
      )}
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
