import { motion } from 'framer-motion'
import { AlertTriangle, BookOpen, ScrollText } from 'lucide-react'
import { DIFFICULTY_LABELS, ease } from '../lib/motion'

/**
 * Compact right-hand glass panel: match metadata chips, check/match status, and Move History.
 */
export default function MatchPanel({
  settings,
  history = [],
  playerColor = 'w',
  isThinking = false,
  checkedSide = null,
  gameStatus = { isGameOver: false, outcome: null },
}) {
  const timeLabel = settings.time === 'unlimited' ? 'Unlimited' : `${settings.time} min`
  const aiColor = playerColor === 'w' ? 'b' : 'w'

  // Pair up white & black plies into full move rows
  const moveRows = []
  for (let i = 0; i < history.length; i += 2) {
    moveRows.push({
      number: i / 2 + 1,
      white: history[i]?.san ?? '',
      black: history[i + 1]?.san ?? '',
    })
  }

  const isInCheck = !gameStatus.isGameOver && (checkedSide === 'w' || checkedSide === 'b')

  let statusText = history.length === 0 ? 'Awaiting first move' : `${history.length} ply played`
  if (gameStatus.isGameOver && gameStatus.outcome) {
    statusText = gameStatus.outcome
  } else if (checkedSide === playerColor) {
    statusText = 'You are in check!'
  } else if (checkedSide === aiColor) {
    statusText = 'Stockfish is in check!'
  } else if (isThinking) {
    statusText = 'Stockfish thinking…'
  }

  let helperText = 'Every move will be recorded here.'
  if (gameStatus.isGameOver) {
    helperText = gameStatus.outcome ?? 'Match complete.'
  } else if (checkedSide === playerColor) {
    helperText = 'Defend your King — only moves escaping check are legal.'
  } else if (checkedSide === aiColor) {
    helperText = 'Stockfish must respond to your check…'
  } else if (isThinking) {
    helperText = 'Stockfish is calculating its reply…'
  } else if (moveRows.length > 0) {
    helperText = 'Drag or click any piece to move.'
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.35 }}
      className="glass-strong flex h-full max-h-[min(calc(100vh_-_120px),760px)] flex-col rounded-[2rem] p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Match</p>
          <h2 className="mt-2 font-serif text-2xl leading-none">Move History</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <ScrollText size={15} strokeWidth={1.5} />
        </span>
      </div>

      {/* Metadata chips */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          ['Level', DIFFICULTY_LABELS[settings.difficulty]],
          ['Clock', timeLabel],
          ['Side', settings.side === 'black' ? 'Black' : 'White'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[1.15rem] bg-white/50 px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.2em] text-ink/45">{k}</p>
            <p className="mt-0.5 text-xs font-medium">{v}</p>
          </div>
        ))}
      </div>

      {/* Status */}
      <div
        className={`mt-3 flex items-center gap-2.5 rounded-full px-3.5 py-2 transition-colors duration-300 ${
          isInCheck ? 'border border-red-500/30 bg-red-500/15' : 'bg-white/40'
        }`}
      >
        {isInCheck ? (
          <AlertTriangle size={14} strokeWidth={1.5} className="shrink-0 text-red-600" />
        ) : (
          <BookOpen size={14} strokeWidth={1.5} className="shrink-0 text-umber" />
        )}
        <span className="text-xs text-ink/60">Status</span>
        <span
          className={`ml-auto truncate text-xs ${
            isInCheck
              ? 'font-semibold text-red-700'
              : gameStatus.isGameOver
                ? 'font-medium italic text-ink'
                : 'italic text-ink/50'
          }`}
        >
          {statusText}
        </span>
      </div>

      {/* Move list */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="grid grid-cols-[1.75rem_1fr_1fr] px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-ink/40">
          <span>#</span>
          <span>White</span>
          <span>Black</span>
        </div>

        {moveRows.length > 0 ? (
          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {moveRows.map((row, i) => (
              <div
                key={row.number}
                className={`grid grid-cols-[1.75rem_1fr_1fr] items-center rounded-full px-3 py-2 text-xs font-medium ${
                  i % 2 === 0 ? 'bg-white/45' : ''
                }`}
              >
                <span className="tabular-nums text-ink/40">{row.number}.</span>
                <span className="text-ink">{row.white}</span>
                <span className="text-ink/75">{row.black}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 space-y-1 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.75rem_1fr_1fr] items-center rounded-full px-3 py-2.5 text-sm ${
                  i % 2 === 0 ? 'bg-white/35' : ''
                }`}
                style={{ opacity: 1 - i * 0.12 }}
              >
                <span className="text-xs tabular-nums text-ink/35">{i + 1}.</span>
                <span className="h-1.5 w-9 rounded-full bg-ink/10" />
                <span className="h-1.5 w-9 rounded-full bg-ink/10" />
              </div>
            ))}
          </div>
        )}

        <p className="pt-3 text-center font-serif text-xs italic text-ink/45">{helperText}</p>
      </div>
    </motion.aside>
  )
}
