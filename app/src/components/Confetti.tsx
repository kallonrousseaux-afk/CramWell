import { useEffect, useState } from 'react'

const COLORS = ['#3DDC97', '#FFC94D', '#FF6B6B', '#5AB8FF']

interface Bit {
  left: number
  delay: number
  color: string
  drift: number
  spin: number
}

// Small celebratory burst, <=1s, removed after it plays. Respects reduced motion
// via the global CSS override that zeroes animation durations.
export function Confetti() {
  const [bits] = useState<Bit[]>(() =>
    Array.from({ length: 24 }, () => ({
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 160,
      spin: Math.random() * 720 - 360,
    })),
  )
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100)
    return () => clearTimeout(t)
  }, [])
  if (gone) return null
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 60 }}>
      <style>{`@keyframes cw-confetti { 0% { transform: translateY(-10vh) translateX(0) rotate(0); opacity: 1; } 100% { transform: translateY(70vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; } }`}</style>
      {bits.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${b.left}%`,
            width: 10,
            height: 10,
            borderRadius: i % 2 ? '50%' : 3,
            background: b.color,
            animation: `cw-confetti 0.95s ease-in ${b.delay}s forwards`,
            ['--drift' as string]: `${b.drift}px`,
            ['--spin' as string]: `${b.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
