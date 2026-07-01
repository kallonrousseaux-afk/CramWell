// Crammy the owl — appears in empty states, onboarding, and celebrations only.
export function Crammy({ size = 88, mood = 'happy' }: { size?: number; mood?: 'happy' | 'excited' }) {
  const excited = mood === 'excited'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Crammy the owl">
      <path d="M14 16 Q20 5 28 11 M50 16 Q44 5 36 11" stroke="#FF6B6B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="35" r="25" fill="#FF6B6B" />
      <ellipse cx="32" cy="44" rx="14" ry="11" fill="#FFE3E3" />
      <circle cx="23" cy="29" r="9" fill="#FFF9F0" />
      <circle cx="41" cy="29" r="9" fill="#FFF9F0" />
      {excited ? (
        <>
          <path d="M21 29 q3.5 -4 7 0" stroke="#2B2438" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M37 29 q3.5 -4 7 0" stroke="#2B2438" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="24.5" cy="30" r="4" fill="#2B2438" />
          <circle cx="39.5" cy="30" r="4" fill="#2B2438" />
          <circle cx="26" cy="28.5" r="1.4" fill="#fff" />
          <circle cx="41" cy="28.5" r="1.4" fill="#fff" />
        </>
      )}
      <path d="M32 35 l-4.5 5.5 h9 z" fill="#FFC94D" />
    </svg>
  )
}
