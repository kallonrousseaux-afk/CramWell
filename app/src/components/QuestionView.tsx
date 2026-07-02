import { useState } from 'react'
import { motion } from 'framer-motion'
import type { QuizQuestion } from '../quiz'
import { TeX } from './Math'

const spring = { type: 'spring' as const, stiffness: 300, damping: 22 }

export function QuestionView({
  q,
  accent,
  onAnswer,
}: {
  q: QuizQuestion
  accent: string
  onAnswer: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<string | null>(null)

  function pick(option: string, correct: boolean) {
    if (picked !== null) return
    setPicked(option)
    setTimeout(() => {
      setPicked(null)
      onAnswer(correct)
    }, 700)
  }

  function optionStyle(option: string, isCorrectOption: boolean): React.CSSProperties {
    const base: React.CSSProperties = {
      width: '100%',
      textAlign: 'left',
      padding: '14px 18px',
      borderRadius: 16,
      border: '1px solid var(--hairline)',
      background: 'var(--surface)',
      fontWeight: 600,
      fontSize: 15,
    }
    if (picked === null) return base
    if (isCorrectOption) return { ...base, background: 'var(--pastel-mint)', borderColor: 'var(--mint)', color: 'var(--mint-deep)' }
    if (picked === option) return { ...base, background: 'var(--pastel-coral)', borderColor: 'var(--coral)', color: 'var(--coral-deep)' }
    return { ...base, opacity: 0.5 }
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{q.prompt}</div>
        {q.promptMath && <TeX src={q.promptMath} block />}
        {q.kind === 'truefalse' && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 14,
              background: 'var(--pastel-sky)',
              color: 'var(--sky-deep)',
              fontWeight: 700,
            }}
          >
            {q.options[0]}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        {q.kind === 'choice' ? (
          q.options.map((option) => (
            <motion.button
              key={option}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              style={optionStyle(option, option === q.correct)}
              onClick={() => pick(option, option === q.correct)}
            >
              {option}
            </motion.button>
          ))
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: '✓ True', value: true },
              { label: '✕ False', value: false },
            ].map(({ label, value }) => {
              const correctPick = value === q.isTrue
              return (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className="pill"
                  style={{
                    flex: 1,
                    padding: '16px 8px',
                    fontWeight: 800,
                    background:
                      picked === null
                        ? 'var(--surface)'
                        : correctPick
                          ? 'var(--pastel-mint)'
                          : picked === label
                            ? 'var(--pastel-coral)'
                            : 'var(--surface)',
                    color:
                      picked !== null && correctPick
                        ? 'var(--mint-deep)'
                        : picked === label
                          ? 'var(--coral-deep)'
                          : accent,
                    border: '1px solid var(--hairline)',
                  }}
                  onClick={() => pick(label, correctPick)}
                >
                  {label}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
      {picked !== null && q.kind === 'truefalse' && !q.isTrue && (
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
          It's actually: <strong>{q.correct}</strong>
        </p>
      )}
    </div>
  )
}
