import { motion } from 'framer-motion'
import { Cpu, Timer } from 'lucide-react'
import { ease } from '../lib/motion'

/**
 * Floating glass panel showing a player's identity and (static) clock.
 */
export default function PlayerPanel({
  name,
  subtitle,
  time,
  isAI = false,
  isActive = false,
  isThinking = false,
  pieceColor = 'white',
  position = 'top',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -18 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      className={`glass flex w-full items-center justify-between rounded-[2rem] p-2.5 pr-3 transition-shadow ${
        isActive ? 'ring-1 ring-white/90' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <Avatar isAI={isAI} isActive={isActive} isThinking={isThinking} />

        <div>
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg leading-none">{name}</p>
            {isAI && (
              <span className="rounded-full bg-olive/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-olive-dark">
                Engine
              </span>
            )}
            {isAI && isThinking && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 rounded-full bg-umber/15 px-2.5 py-0.5 text-[10px] font-medium text-umber-dark"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-umber" />
                Thinking…
              </motion.span>
            )}
          </div>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-ink/55">
            <span
              className={`h-2.5 w-2.5 rounded-full border ${
                pieceColor === 'white' ? 'border-ink/30 bg-cream' : 'border-ink bg-ink'
              }`}
            />
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-[11px] italic text-ink/35">
          {isAI && isThinking ? 'Calculating move…' : 'No captures yet'}
        </span>

        <div
          className={`flex items-center gap-2.5 rounded-full px-5 py-3 transition-colors duration-500 ${
            isActive ? 'bg-ink text-cream shadow-ink' : 'bg-white/55 text-ink/55'
          }`}
        >
          {isActive ? (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cream/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cream" />
            </span>
          ) : (
            <Timer size={15} strokeWidth={1.5} />
          )}
          <span className="min-w-[3.5rem] text-center text-xl font-medium tabular-nums tracking-tight">
            {time}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function Avatar({ isAI, isActive, isThinking }) {
  return (
    <div className="relative">
      {(isActive || isThinking) && (
        <motion.span
          aria-hidden
          className={`absolute -inset-1 rounded-full border ${
            isThinking ? 'border-olive/70' : 'border-umber/50'
          }`}
          animate={{ scale: [1, 1.14, 1], opacity: [0.85, 0, 0.85] }}
          transition={{ duration: isThinking ? 1.4 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {isAI ? (
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream">
          <Cpu size={19} strokeWidth={1.5} />
        </span>
      ) : (
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-umber-light to-olive font-serif text-lg text-cream">
          P
        </span>
      )}
    </div>
  )
}
