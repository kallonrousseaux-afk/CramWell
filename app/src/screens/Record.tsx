import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Crammy } from '../components/Crammy'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}

function getRecognizer(): SpeechRecognitionLike | null {
  const w = window as unknown as Record<string, unknown>
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | undefined
  return Ctor ? new Ctor() : null
}

// Record a lecture (or yourself reciting notes) and get a live transcript,
// using the browser's built-in speech recognition. The transcript flows into
// the notes→flashcards screen; AI summarization plugs in there later.
export function Record({ onUseTranscript, onClose }: { onUseTranscript: (text: string) => void; onClose: () => void }) {
  const [supported, setSupported] = useState(true)
  const [recording, setRecording] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const rec = useRef<SpeechRecognitionLike | null>(null)
  const wantRecording = useRef(false)

  useEffect(() => {
    const r = getRecognizer()
    if (!r) {
      setSupported(false)
      return
    }
    r.lang = 'en-US'
    r.continuous = true
    r.interimResults = true
    r.onresult = (e) => {
      let fin = ''
      let mid = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) fin += res[0].transcript + ' '
        else mid += res[0].transcript
      }
      if (fin) setFinalText((t) => (t + fin).trimStart())
      setInterim(mid)
    }
    r.onend = () => {
      // Chrome stops after silence; restart while the user still wants to record.
      if (wantRecording.current) r.start()
      else setRecording(false)
    }
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Microphone access was blocked — allow it in your browser and try again.')
        wantRecording.current = false
        setRecording(false)
      }
    }
    rec.current = r
    return () => {
      wantRecording.current = false
      r.onend = null
      r.stop()
    }
  }, [])

  function toggle() {
    if (!rec.current) return
    if (recording) {
      wantRecording.current = false
      rec.current.stop()
      setRecording(false)
      setInterim('')
    } else {
      setError(null)
      wantRecording.current = true
      rec.current.start()
      setRecording(true)
    }
  }

  const transcript = (finalText + (interim ? ' ' + interim : '')).trim()

  return (
    <div className="screen">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24 }}>Record a lecture</h1>
        <button onClick={onClose} aria-label="Close" style={{ fontSize: 24, padding: 8, color: 'var(--ink-soft)' }}>
          ✕
        </button>
      </header>
      <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
        Hit record during class or read your notes aloud — CramWell transcribes as you go, then turns it into flashcards.
      </p>

      {!supported ? (
        <div className="card" style={{ marginTop: 20, textAlign: 'center', padding: 28 }}>
          <Crammy />
          <p style={{ fontWeight: 700, margin: '12px 0 4px' }}>This browser can't transcribe audio</p>
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Try Chrome or Edge — or paste your notes instead.</p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="pill pill--mint"
            style={{ marginTop: 16 }}
            onClick={() => onUseTranscript('')}
          >
            📋 Paste notes instead
          </motion.button>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <motion.button
              whileTap={{ scale: 0.94 }}
              animate={recording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={recording ? { duration: 1.2, repeat: Infinity } : spring}
              onClick={toggle}
              className="pill pill--coral"
              style={{ width: 120, height: 120, borderRadius: '50%', fontSize: 40, padding: 0 }}
              aria-label={recording ? 'Stop recording' : 'Start recording'}
            >
              {recording ? '⏹' : '🎙'}
            </motion.button>
            <p style={{ fontWeight: 800, marginTop: 12, color: recording ? 'var(--coral-deep)' : 'var(--ink-soft)' }}>
              {recording ? 'Listening…' : 'Tap to record'}
            </p>
            {error && <p style={{ color: 'var(--coral-deep)', fontSize: 14 }}>{error}</p>}
          </div>

          <div className="card" style={{ marginTop: 16, minHeight: 140 }}>
            <div className="label">Transcript</div>
            <p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
              {transcript || <span style={{ color: 'var(--ink-soft)' }}>Your words will appear here…</span>}
              {interim && <span style={{ color: 'var(--ink-soft)' }}> …</span>}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="pill pill--mint"
            style={{ width: '100%', marginTop: 16, padding: '18px 24px', fontSize: 17, opacity: transcript ? 1 : 0.5 }}
            disabled={!transcript}
            onClick={() => {
              wantRecording.current = false
              rec.current?.stop()
              onUseTranscript(transcript)
            }}
          >
            Turn into flashcards →
          </motion.button>
        </>
      )}
    </div>
  )
}
