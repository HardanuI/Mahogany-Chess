import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flag, RotateCcw, Scale, SlidersHorizontal, Trophy, X } from 'lucide-react'
import PillButton from './ui/PillButton'

const RESULT_META = {
  win: {
    title: 'Victory',
    icon: Trophy,
    emblemClass: 'bg-ink text-cream shadow-ink ring-4 ring-olive/25',
    glowClass: 'bg-olive/25',
    accentClass: 'text-olive-dark',
  },
  loss: {
    title: 'Defeat',
    icon: Flag,
    emblemClass: 'border border-umber/30 bg-umber/15 text-umber-dark',
    glowClass: 'bg-umber/25',
    accentClass: 'text-umber',
  },
  draw: {
    title: 'Draw',
    icon: Scale,
    emblemClass: 'border border-ink/15 bg-white/75 text-ink',
    glowClass: 'bg-ink/10',
    accentClass: 'text-ink/65',
  },
}

/**
 * Glassmorphism modal presenting match result and Play Again / Main Menu actions.
 */
export default function GameOverModal({
  open,
  result,
  reason,
  movesCount = 0,
  difficulty = 'Easy',
  playerSide = 'white',
  onPlayAgain,
  onMainMenu,
  onClose,
}) {
  useEffect(() => {
    if (!open || !onClose) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const meta = RESULT_META[result] ?? RESULT_META.draw
  const Icon = meta.icon
  const sideLabel = playerSide === 'black' ? 'Black' : 'White'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Heavy glass backdrop */}
          <motion.div
            aria-hidden
            onClick={() => onClose?.()}
            className="absolute inset-0 bg-[#2A221A]/30 backdrop-blur-md"
          />

          {/* Modal panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gameover-title"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/75 bg-cream/70 p-9 text-center shadow-frame backdrop-blur-2xl"
          >
            {/* Subtle ambient halo behind header */}
            <div
              aria-hidden
              className={`pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl ${meta.glowClass}`}
            />

            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Inspect board"
                title="Close to inspect board"
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/60 text-ink/75 transition-colors hover:bg-white hover:text-ink"
              >
                <X size={16} strokeWidth={1.5} />
              </motion.button>
            )}

            {/* Result Emblem */}
            <div className="relative flex justify-center">
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full ${meta.emblemClass}`}
              >
                <Icon size={26} strokeWidth={1.5} />
              </span>
            </div>

            <p className="eyebrow relative mt-6">Match Concluded</p>

            <h2
              id="gameover-title"
              className="relative mt-3 font-serif text-5xl leading-none tracking-tight text-ink sm:text-[3.5rem]"
            >
              {meta.title}
            </h2>

            {reason && (
              <p className={`relative mt-3 font-serif text-lg italic ${meta.accentClass}`}>
                {reason}
              </p>
            )}

            {/* Compact summary chips */}
            <div className="relative mt-7 grid grid-cols-3 gap-2.5 text-left">
              {[
                ['Moves', String(movesCount)],
                ['Difficulty', difficulty],
                ['Played As', sideLabel],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.25rem] border border-white/60 bg-white/45 px-3 py-2.5"
                >
                  <p className="text-[9px] uppercase tracking-[0.2em] text-ink/45">{label}</p>
                  <p className="mt-1 text-[13px] font-medium text-ink">{value}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="relative mt-8 flex flex-col gap-3">
              <PillButton
                size="md"
                icon={RotateCcw}
                onClick={onPlayAgain}
                className="w-full justify-between"
              >
                Play Again
              </PillButton>

              <motion.button
                type="button"
                onClick={onMainMenu}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-white/60 text-sm font-medium text-ink/80 transition-colors hover:bg-white/90 hover:text-ink"
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} />
                Main Menu
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
