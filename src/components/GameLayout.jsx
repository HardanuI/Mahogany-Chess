import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, RotateCcw } from 'lucide-react'
import Logo from './ui/Logo'
import PillButton from './ui/PillButton'
import PlayerPanel from './PlayerPanel'
import ChessBoard from './ChessBoard'
import GameSidebar from './GameSidebar'
import MatchPanel from './MatchPanel'
import { DIFFICULTY_LABELS, TIME_LABELS, ease } from '../lib/motion'

/**
 * In-game layout featuring the playable ChessBoard component with
 * drag-and-drop, click-to-move, and legal move hints.
 */
export default function GameLayout({
  settings,
  initialOrientation = 'white',
  onExit,
  onNewGame,
}) {
  const [boardOrientation, setBoardOrientation] = useState(initialOrientation)
  const [turn, setTurn] = useState('w')

  const whiteAtBottom = boardOrientation === 'white'
  const clock = TIME_LABELS[settings.time]
  const difficulty = DIFFICULTY_LABELS[settings.difficulty]

  const toggleOrientation = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'))
  }

  return (
    <div className="grain relative min-h-screen overflow-hidden bg-cream">
      <Ambient />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-10 pt-7"
      >
        <button type="button" onClick={onExit} aria-label="Back to home">
          <Logo />
        </button>

        <div className="glass flex items-center gap-1 rounded-full p-1.5 text-xs">
          <span className="rounded-full bg-ink px-4 py-2 text-cream">Live Match</span>
          <span className="px-4 py-2 text-ink/70">{difficulty} AI</span>
          <span className="h-4 w-px bg-ink/15" />
          <span className="px-4 py-2 text-ink/70">
            {settings.time === 'unlimited' ? 'No clock' : `${settings.time} min`}
          </span>
          <span className="h-4 w-px bg-ink/15" />
          <button
            type="button"
            onClick={toggleOrientation}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-ink/75 transition-colors hover:bg-white/60 hover:text-ink"
            title="Flip board orientation"
          >
            <ArrowUpDown size={13} strokeWidth={1.5} />
            <span className="capitalize">{boardOrientation}</span>
          </button>
        </div>

        <PillButton size="sm" icon={RotateCcw} onClick={onNewGame}>
          New Game
        </PillButton>
      </motion.header>

      {/* Main stage */}
      <main className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-[88px_1fr_340px] items-center gap-10 px-10 py-7">
        <GameSidebar onExit={onExit} />

        <div className="mx-auto flex w-[min(58vh,600px)] min-w-[440px] flex-col gap-4">
          <PlayerPanel
            name="Stockfish AI"
            subtitle={`Level · ${difficulty}`}
            time={clock}
            isAI
            isActive={whiteAtBottom ? turn === 'b' : turn === 'w'}
            pieceColor={whiteAtBottom ? 'black' : 'white'}
            position="top"
            delay={0.2}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <ChessBoard
              boardOrientation={boardOrientation}
              onGameChange={({ turn: nextTurn }) => setTurn(nextTurn)}
            />
          </motion.div>

          <PlayerPanel
            name="Player"
            subtitle="Rating · 1500"
            time={clock}
            isActive={whiteAtBottom ? turn === 'w' : turn === 'b'}
            pieceColor={whiteAtBottom ? 'white' : 'black'}
            position="bottom"
            delay={0.3}
          />
        </div>

        <MatchPanel settings={settings} />
      </main>
    </div>
  )
}

/* Soft earthy light pools behind the glass for depth */
function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-olive/20 blur-[120px]" />
      <div className="absolute -bottom-48 -right-32 h-[620px] w-[620px] rounded-full bg-umber/25 blur-[130px]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px]" />
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none font-serif text-[11rem] italic leading-none text-ink/[0.03]">
        Arbiter
      </span>
    </div>
  )
}
