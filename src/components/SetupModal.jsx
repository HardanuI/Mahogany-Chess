import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Crown, Feather, InfinityIcon, Timer, X } from 'lucide-react'
import PillButton from './ui/PillButton'
import { DIFFICULTY_LABELS, ease } from '../lib/motion'

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    elo: '≈ 800',
    description: 'Gentle and forgiving. Ideal for learning.',
    icon: Feather,
  },
  {
    id: 'medium',
    label: 'Medium',
    elo: '≈ 1600',
    description: 'Balanced play with sharp moments.',
    icon: Compass,
  },
  {
    id: 'hard',
    label: 'Hard',
    elo: '≈ 2400',
    description: 'Relentless precision. No mercy.',
    icon: Crown,
  },
]

const TIMES = [
  { id: 'unlimited', label: 'Unlimited', icon: InfinityIcon },
  { id: '5', label: '5 min', icon: Timer },
  { id: '10', label: '10 min', icon: Timer },
]

const SIDES = [
  { id: 'white', label: 'White', note: 'You move first', glyph: '♔' },
  { id: 'black', label: 'Black', note: 'Engine opens', glyph: '♚' },
]

export default function SetupModal({ open, initial, onClose, onStart }) {
  const [difficulty, setDifficulty] = useState(initial.difficulty)
  const [time, setTime] = useState(initial.time)
  const [side, setSide] = useState(initial.side)

  // Sync with last-used settings whenever the modal re-opens
  useEffect(() => {
    if (!open) return
    setDifficulty(initial.difficulty)
    setTime(initial.time)
    setSide(initial.side)
  }, [open, initial])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const timeLabel = TIMES.find((t) => t.id === time)?.label

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop */}
          <motion.div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-[#2A221A]/30 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="setup-title"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="glass-strong relative max-h-[calc(100vh-3rem)] w-full max-w-[760px] overflow-y-auto rounded-[2.5rem] p-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">New Match</p>
                <h2 id="setup-title" className="mt-3 font-serif text-[2.75rem] leading-none">
                  Set the <span className="text-umber">Board.</span>
                </h2>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close"
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60"
              >
                <X size={17} strokeWidth={1.5} />
              </motion.button>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { delayChildren: 0.15, staggerChildren: 0.08 } } }}
            >
              {/* 01 — Difficulty */}
              <Section index="01" title="Difficulty">
                <div className="grid grid-cols-3 gap-4">
                  {DIFFICULTIES.map(({ id, label, elo, description, icon: Icon }) => {
                    const selected = difficulty === id
                    return (
                      <motion.button
                        key={id}
                        type="button"
                        onClick={() => setDifficulty(id)}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                        className={`relative flex flex-col rounded-[1.75rem] border p-5 text-left transition-colors duration-300 ${
                          selected
                            ? 'border-ink bg-ink text-cream shadow-ink'
                            : 'border-white/70 bg-white/40 text-ink hover:bg-white/75'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-full ${
                              selected ? 'bg-cream/10' : 'bg-cream'
                            }`}
                          >
                            <Icon size={18} strokeWidth={1.5} />
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              selected ? 'border-cream/60' : 'border-ink/20'
                            }`}
                          >
                            {selected && (
                              <motion.span
                                layoutId="difficulty-dot"
                                className="h-2.5 w-2.5 rounded-full bg-cream"
                              />
                            )}
                          </span>
                        </div>
                        <p className="mt-6 font-serif text-xl">{label}</p>
                        <p
                          className={`mt-1.5 text-xs leading-relaxed ${
                            selected ? 'text-cream/60' : 'text-ink/55'
                          }`}
                        >
                          {description}
                        </p>
                        <p
                          className={`mt-4 text-[10px] uppercase tracking-[0.2em] ${
                            selected ? 'text-cream/50' : 'text-ink/40'
                          }`}
                        >
                          Elo {elo}
                        </p>
                      </motion.button>
                    )
                  })}
                </div>
              </Section>

              {/* 02 — Time control */}
              <Section index="02" title="Time Control">
                <div className="inline-flex rounded-full border border-white/70 bg-white/40 p-1.5">
                  {TIMES.map(({ id, label, icon: Icon }) => {
                    const selected = time === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTime(id)}
                        className={`relative flex items-center gap-2 rounded-full px-7 py-3 text-sm transition-colors duration-300 ${
                          selected ? 'text-cream' : 'text-ink/70 hover:text-ink'
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="time-pill"
                            className="absolute inset-0 rounded-full bg-ink shadow-ink"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon size={15} strokeWidth={1.5} className="relative" />
                        <span className="relative">{label}</span>
                      </button>
                    )
                  })}
                </div>
              </Section>

              {/* 03 — Side */}
              <Section index="03" title="Play As">
                <div className="grid grid-cols-2 gap-4">
                  {SIDES.map(({ id, label, note, glyph }) => {
                    const selected = side === id
                    return (
                      <motion.button
                        key={id}
                        type="button"
                        onClick={() => setSide(id)}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 rounded-full border p-2 pr-6 text-left transition-all duration-300 ${
                          selected
                            ? 'border-ink/80 bg-white/80 ring-1 ring-ink/80'
                            : 'border-white/70 bg-white/35 hover:bg-white/65'
                        }`}
                      >
                        <span
                          className={`piece-glyph flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
                            id === 'white'
                              ? 'border border-ink/10 bg-cream text-ink'
                              : 'bg-ink text-cream'
                          }`}
                        >
                          {glyph}
                          {'\uFE0E'}
                        </span>
                        <span className="flex-1">
                          <span className="block font-serif text-lg leading-tight">{label}</span>
                          <span className="block text-xs text-ink/55">{note}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? 'border-ink' : 'border-ink/20'
                          }`}
                        >
                          {selected && (
                            <motion.span layoutId="side-dot" className="h-2.5 w-2.5 rounded-full bg-ink" />
                          )}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </Section>

              {/* Action */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                className="mt-10 flex items-center justify-between gap-6 border-t border-ink/10 pt-8"
              >
                <div className="text-sm text-ink/60">
                  <p className="eyebrow !text-[9px]">Summary</p>
                  <p className="mt-2 text-ink">
                    {DIFFICULTY_LABELS[difficulty]} <span className="text-ink/30">·</span> {timeLabel}{' '}
                    <span className="text-ink/30">·</span> {side === 'white' ? 'White' : 'Black'}
                  </p>
                </div>
                <PillButton size="lg" onClick={() => onStart({ difficulty, time, side })}>
                  Start Game
                </PillButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({ index, title, children }) {
  return (
    <motion.section
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
      className="mt-9"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[11px] tabular-nums text-umber">{index}</span>
        <span className="h-px w-6 bg-ink/20" />
        <h3 className="eyebrow !text-ink/70">{title}</h3>
      </div>
      {children}
    </motion.section>
  )
}
