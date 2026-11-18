// Shared Framer Motion presets so every screen moves with the same rhythm.

export const ease = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
}

export const stagger = (delayChildren = 0, staggerChildren = 0.1) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

// Static display helpers (no timer logic — formatting only)
export const TIME_LABELS = {
  unlimited: '∞',
  5: '05:00',
  10: '10:00',
}

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}
