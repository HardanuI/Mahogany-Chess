import { motion } from 'framer-motion'
import { BookOpen, Handshake, ScrollText } from 'lucide-react'
import { DIFFICULTY_LABELS, ease } from '../lib/motion'

/**
 * Right-hand glass panel: match details, an empty move list and a static
 * evaluation bar. Placeholder content only.
 */
export default function MatchPanel({ settings }) {
  const timeLabel = settings.time === 'unlimited' ? 'Unlimited' : `${settings.time} min`

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.4 }}
      className="glass-strong flex h-full max-h-[720px] flex-col rounded-[2rem] p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Match</p>
          <h2 className="mt-2 font-serif text-[26px] leading-none">Move History</h2>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
          <ScrollText size={16} strokeWidth={1.5} />
        </span>
      </div>

      {/* Detail chips */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          ['Level', DIFFICULTY_LABELS[settings.difficulty]],
          ['Clock', timeLabel],
          ['Side', settings.side === 'white' ? 'White' : 'Black'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[1.25rem] bg-white/50 px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-ink/45">{k}</p>
            <p className="mt-1 text-[13px] font-medium">{v}</p>
          </div>
        ))}
      </div>

      {/* Opening */}
      <div className="mt-3 flex items-center gap-3 rounded-full bg-white/40 px-4 py-2.5">
        <BookOpen size={14} strokeWidth={1.5} className="text-umber" />
        <span className="text-xs text-ink/60">Opening</span>
        <span className="ml-auto text-xs italic text-ink/40">Awaiting first move</span>
      </div>

      {/* Move list placeholder */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <div className="grid grid-cols-[2rem_1fr_1fr] px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-ink/40">
          <span>#</span>
          <span>White</span>
          <span>Black</span>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`grid grid-cols-[2rem_1fr_1fr] items-center rounded-full px-3 py-2.5 text-sm ${
                i % 2 === 0 ? 'bg-white/35' : ''
              }`}
              style={{ opacity: 1 - i * 0.12 }}
            >
              <span className="text-xs tabular-nums text-ink/35">{i + 1}.</span>
              <span className="h-1.5 w-10 rounded-full bg-ink/10" />
              <span className="h-1.5 w-10 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
        <p className="pt-3 text-center font-serif text-sm italic text-ink/45">
          Every move will be recorded here.
        </p>
      </div>

      {/* Static evaluation bar */}
      <div className="mt-5 border-t border-ink/10 pt-5">
        <div className="flex items-center justify-between text-[11px] text-ink/55">
          <span>Evaluation</span>
          <span className="tabular-nums text-ink">0.0</span>
        </div>
        <div className="mt-2.5 flex h-2 overflow-hidden rounded-full bg-ink">
          <div className="h-full w-1/2 rounded-full bg-cream-50" />
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/60 py-3.5 text-sm text-ink/80 transition-colors hover:bg-white"
      >
        <Handshake size={16} strokeWidth={1.5} />
        Offer Draw
      </motion.button>
    </motion.aside>
  )
}
