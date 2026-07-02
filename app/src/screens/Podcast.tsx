import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppState } from '../store'
import { answerText } from '../quiz'
import { latexToPlain } from '../quiz'
import { Crammy } from '../components/Crammy'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

interface Line {
  speaker: 'host' | 'guest'
  text: string
}

// Study podcast built from your own deck, spoken with the browser's built-in
// text-to-speech (no server, works offline). AI-written scripts plug in later.
export function Podcast({ onClose }: { onClose: () => void }) {
  const state = useAppState()
  const [script] = useState<Line[]>(() => {
    const cards = [...state.cards].slice(0, 8)
    const lines: Line[] = [
      { speaker: 'host', text: `Welcome back to the CramWell study podcast. Today we're running through ${cards.length} things you're learning. Ready?` },
      { speaker: 'guest', text: "Let's do it." },
    ]
    cards.forEach((c, i) => {
      const q = c.problem.questionMath
        ? `${c.problem.question}: ${latexToPlain(c.problem.questionMath)}`
        : c.problem.question
      lines.push({ speaker: 'host', text: `Number ${i + 1}. ${q}` })
      lines.push({ speaker: 'guest', text: `That one's ${answerText(c)}.` })
      const step = c.problem.steps[0]
      if (step?.text) lines.push({ speaker: 'guest', text: `Remember: ${step.body}` })
    })
    lines.push({ speaker: 'host', text: "And that's the episode. Nice work — your future self says thanks." })
    return lines
  })
  const [playing, setPlaying] = useState(false)
  const [lineIdx, setLineIdx] = useState(-1)
  const cancelled = useRef(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(
    () => () => {
      cancelled.current = true
      if (supported) window.speechSynthesis.cancel()
    },
    [supported],
  )

  function speakFrom(start: number) {
    if (!supported) return
    window.speechSynthesis.cancel()
    cancelled.current = false
    setPlaying(true)

    const voices = window.speechSynthesis.getVoices()
    const en = voices.filter((v) => v.lang.startsWith('en'))
    const hostVoice = en[0] ?? voices[0]
    const guestVoice = en.find((v) => v !== hostVoice) ?? hostVoice

    const speakLine = (i: number) => {
      if (cancelled.current || i >= script.length) {
        setPlaying(false)
        setLineIdx(-1)
        return
      }
      setLineIdx(i)
      const u = new SpeechSynthesisUtterance(script[i].text)
      const isHost = script[i].speaker === 'host'
      if (hostVoice) u.voice = isHost ? hostVoice : guestVoice
      u.pitch = isHost ? 1.0 : 1.15
      u.rate = 1.02
      u.onend = () => speakLine(i + 1)
      u.onerror = () => speakLine(i + 1)
      window.speechSynthesis.speak(u)
    }
    speakLine(start)
  }

  function stop() {
    cancelled.current = true
    if (supported) window.speechSynthesis.cancel()
    setPlaying(false)
  }

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Study podcast</h1>
        <button
          onClick={() => {
            stop()
            onClose()
          }}
          aria-label="Close"
          style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}
        >
          ✕
        </button>
      </header>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
        An episode made from your own deck — listen on a walk, before bed, wherever.
      </p>

      <div
        className="card"
        style={{ marginTop: 16, background: 'var(--pastel-grape)', border: 'none', textAlign: 'center', padding: 28 }}
      >
        <motion.div animate={playing ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 1.6, repeat: playing ? Infinity : 0 }}>
          <Crammy size={90} mood={playing ? 'excited' : 'happy'} />
        </motion.div>
        <p style={{ fontWeight: 800, margin: '12px 0 0', color: 'var(--grape-deep)' }}>
          Today's episode · {state.cards.length ? Math.min(state.cards.length, 8) : 0} topics
        </p>
        {!supported && (
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
            This browser can't speak — try Chrome or Safari.
          </p>
        )}
        {state.cards.length === 0 && (
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Add some cards first and I'll have plenty to talk about.</p>
        )}
        <motion.button
          whileTap={{ scale: 0.96 }}
          transition={spring}
          className="pill pill--grape"
          style={{ marginTop: 16, padding: '16px 40px', fontSize: 17, opacity: supported && state.cards.length ? 1 : 0.5 }}
          disabled={!supported || state.cards.length === 0}
          onClick={() => (playing ? stop() : speakFrom(0))}
        >
          {playing ? '⏸ Pause' : '▶ Play episode'}
        </motion.button>
      </div>

      <section style={{ marginTop: 16 }}>
        {script.map((line, i) => (
          <div
            key={i}
            className="card"
            style={{
              marginTop: 8,
              padding: '10px 16px',
              display: 'flex',
              gap: 10,
              alignItems: 'baseline',
              background: i === lineIdx ? 'var(--pastel-sunshine)' : 'var(--surface)',
              border: i === lineIdx ? '1px solid var(--sunshine)' : '1px solid var(--hairline)',
            }}
          >
            <span style={{ fontSize: 16 }}>{line.speaker === 'host' ? '🦉' : '🎓'}</span>
            <span style={{ fontSize: 14, fontWeight: i === lineIdx ? 700 : 400 }}>{line.text}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
