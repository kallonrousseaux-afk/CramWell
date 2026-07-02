import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Crammy } from '../components/Crammy'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }
const FOCUS_MIN = 25
const BREAK_MIN = 5

// Forest/Flora-style focus timer: a pomodoro with Crammy keeping you company.
export function Focus({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  const total = (mode === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          if (mode === 'focus') setFinished(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [running, mode])

  function switchMode(m: 'focus' | 'break') {
    setMode(m)
    setSecondsLeft((m === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60)
    setRunning(false)
    setFinished(false)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const progress = 1 - secondsLeft / total
  const R = 84
  const C = 2 * Math.PI * R

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {finished && <Confetti />}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Focus</h1>
        <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
          ✕
        </button>
      </header>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {(['focus', 'break'] as const).map((m) => (
          <motion.button
            key={m}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => switchMode(m)}
            className="pill"
            style={{
              flex: 1,
              padding: '10px 0',
              fontWeight: 800,
              background: mode === m ? 'var(--pastel-sunshine)' : 'var(--surface)',
              color: mode === m ? '#a06b00' : 'var(--ink-soft)',
              border: '1px solid var(--hairline)',
            }}
          >
            {m === 'focus' ? `📚 Focus · ${FOCUS_MIN}m` : `☕ Break · ${BREAK_MIN}m`}
          </motion.button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', width: 220, height: 220, display: 'grid', placeItems: 'center' }}>
          <svg width="220" height="220" style={{ position: 'absolute', transform: 'rotate(-90deg)' }} aria-hidden>
            <circle cx="110" cy="110" r={R} fill="none" stroke="var(--hairline)" strokeWidth="10" />
            <circle
              cx="110"
              cy="110"
              r={R}
              fill="none"
              stroke="var(--sunshine)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{ textAlign: 'center' }}>
            <motion.div
              animate={running ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 2, repeat: running ? Infinity : 0 }}
            >
              <Crammy size={64} mood={finished ? 'excited' : 'happy'} />
            </motion.div>
            <div style={{ fontSize: 40, fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {mm}:{ss}
            </div>
          </div>
        </div>
      </div>

      {finished ? (
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <p style={{ fontWeight: 800, fontSize: 18, margin: '0 0 12px' }}>Session done — nice focus! 🎉</p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--sky" onClick={() => switchMode('break')}>
            Take a {BREAK_MIN}-minute break
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.96 }}
          transition={spring}
          className={`pill ${running ? 'pill--quiet' : 'pill--coral'}`}
          style={{ width: '100%', padding: '18px 24px', fontSize: 17 }}
          onClick={() => setRunning(!running)}
        >
          {running ? '⏸ Pause' : secondsLeft === total ? '▶ Start' : '▶ Resume'}
        </motion.button>
      )}
    </div>
  )
}
