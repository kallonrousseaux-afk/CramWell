import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppState } from '../store'
import { answerText } from '../quiz'
import { Crammy } from '../components/Crammy'
import { Confetti } from '../components/Confetti'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

interface Tile {
  id: string // card id
  text: string
  side: 'q' | 'a'
}

// Knowt-style matching game: tap a question, tap its answer, race the clock.
export function Match({ onClose }: { onClose: () => void }) {
  const state = useAppState()
  const [tiles] = useState<Tile[]>(() => {
    const pool = [...state.cards].sort(() => Math.random() - 0.5).slice(0, 5)
    const t: Tile[] = pool.flatMap((c) => [
      { id: c.id, text: c.problem.question, side: 'q' as const },
      { id: c.id, text: answerText(c), side: 'a' as const },
    ])
    return t.sort(() => Math.random() - 0.5)
  })
  const [selected, setSelected] = useState<Tile | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<Tile[]>([])
  const [seconds, setSeconds] = useState(0)
  const total = tiles.length / 2
  const won = matched.size === total && total > 0

  useEffect(() => {
    if (won) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [won])

  function tap(tile: Tile) {
    if (matched.has(tile.id) || wrongPair.length > 0) return
    if (!selected) {
      setSelected(tile)
      return
    }
    if (selected === tile) {
      setSelected(null)
      return
    }
    if (selected.id === tile.id && selected.side !== tile.side) {
      setMatched(new Set([...matched, tile.id]))
      setSelected(null)
    } else {
      setWrongPair([selected, tile])
      setTimeout(() => {
        setWrongPair([])
        setSelected(null)
      }, 500)
    }
  }

  if (total === 0) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Crammy size={110} />
          <h1 style={{ fontSize: 24, marginTop: 16 }}>Nothing to match yet</h1>
          <p style={{ color: 'var(--ink-soft)' }}>Add a few cards first.</p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--quiet" onClick={onClose}>
            Back
          </motion.button>
        </div>
      </div>
    )
  }

  if (won) {
    return (
      <div className="screen" style={{ display: 'grid', placeItems: 'center' }}>
        <Confetti />
        <div style={{ textAlign: 'center' }}>
          <Crammy size={110} mood="excited" />
          <h1 style={{ fontSize: 24, marginTop: 16 }}>Matched in {seconds}s!</h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            {total} pair{total > 1 ? 's' : ''} cleared. Think you can beat it?
          </p>
          <motion.button whileTap={{ scale: 0.96 }} transition={spring} className="pill pill--coral" onClick={onClose}>
            Done
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Match</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              background: 'var(--pastel-sunshine)',
              color: '#a06b00',
              borderRadius: 999,
              padding: '6px 14px',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ⏱ {seconds}s
          </span>
          <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
            ✕
          </button>
        </div>
      </header>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Tap a question, then tap its answer.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        {tiles.map((tile, i) => {
          const isMatched = matched.has(tile.id)
          const isSelected = selected === tile
          const isWrong = wrongPair.includes(tile)
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              animate={isMatched ? { scale: 0.9, opacity: 0 } : isWrong ? { x: [0, -6, 6, -4, 0] } : { scale: 1, opacity: 1 }}
              transition={isWrong ? { duration: 0.35 } : spring}
              onClick={() => tap(tile)}
              disabled={isMatched}
              style={{
                minHeight: 92,
                padding: 12,
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1.3,
                border: `2px solid ${isWrong ? 'var(--coral)' : isSelected ? 'var(--sunshine)' : 'var(--hairline)'}`,
                background: isSelected ? 'var(--pastel-sunshine)' : tile.side === 'q' ? 'var(--surface)' : 'var(--pastel-sky)',
                color: isWrong ? 'var(--coral-deep)' : 'var(--ink)',
              }}
            >
              {tile.text.length > 70 ? tile.text.slice(0, 70) + '…' : tile.text}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
