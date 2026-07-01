import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DEMO_PROBLEMS, makeCard, type StudyCard } from '../data'
import { Crammy } from '../components/Crammy'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

// Demo mode: snaps rotate through pre-worked problems until the AI solver is wired up.
let demoIndex = 0
function nextDemoProblem() {
  const p = DEMO_PROBLEMS[demoIndex % DEMO_PROBLEMS.length]
  demoIndex += 1
  return p
}

export function Snap({ onSolved, onClose }: { onSolved: (card: StudyCard) => void; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  function solve(photoData?: string) {
    setScanning(true)
    // The scan sweep plays while we "solve" — later this is the real API call.
    setTimeout(() => {
      onSolved(makeCard(nextDemoProblem(), photoData))
    }, 2000)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result as string
      setPhoto(data)
      solve(data)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="screen"
      style={{ background: '#2B2438', color: '#fff', display: 'flex', flexDirection: 'column', paddingBottom: 32 }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Snap a problem</h1>
        <button onClick={onClose} aria-label="Close" style={{ color: '#fff', fontSize: 24, padding: 8 }}>
          ✕
        </button>
      </header>

      <div
        style={{
          flex: 1,
          marginTop: 20,
          borderRadius: 20,
          background: photo ? `#000 url(${photo}) center/contain no-repeat` : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 320,
        }}
      >
        {!photo && !scanning && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Crammy size={72} />
            <p style={{ fontWeight: 700, margin: '12px 0 4px' }}>Point at any problem</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              Math, science, history — handwriting works too.
            </p>
          </div>
        )}
        {scanning && (
          <>
            <motion.div
              initial={{ top: '-4%' }}
              animate={{ top: '104%' }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 3,
                background: 'var(--mint)',
                boxShadow: '0 0 24px 6px rgba(61,220,151,0.6)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontWeight: 700,
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              }}
            >
              Reading your problem…
            </div>
          </>
        )}
      </div>

      {!scanning && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFile}
            style={{ display: 'none' }}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="pill pill--coral"
            style={{ padding: '20px 24px', fontSize: 18, fontWeight: 800 }}
            onClick={() => fileRef.current?.click()}
          >
            📸 Take a photo
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="pill"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
            onClick={() => solve()}
          >
            Try a sample problem
          </motion.button>
        </div>
      )}
    </div>
  )
}
