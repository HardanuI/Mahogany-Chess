import { useMemo } from 'react'
import { motion } from 'framer-motion'

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

const GLYPHS = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const FILES = 'abcdefgh'

// Purely visual: expands the piece-placement part of a FEN string into an 8×8 grid.
function toGrid(fen) {
  return fen
    .split(' ')[0]
    .split('/')
    .map((row) =>
      row.split('').flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill(null) : [ch])),
    )
}

const WHITE_PIECE = {
  color: '#FBF8F1',
  WebkitTextStroke: '0.025em rgba(74, 52, 32, 0.75)',
  textShadow: '0 0.05em 0.08em rgba(60, 40, 20, 0.35)',
}

const BLACK_PIECE = {
  color: '#1F1B17',
  textShadow: '0 0.05em 0.08em rgba(30, 20, 10, 0.35)',
}

/**
 * Static, non-interactive chessboard used as a visual placeholder.
 * No move logic, no drag-and-drop.
 */
export default function BoardPlaceholder({
  fen = START_FEN,
  flipped = false,
  showPieces = true,
  showCoordinates = true,
  framed = true,
  animated = true,
  delay = 0,
  className = '',
}) {
  const grid = useMemo(() => {
    const g = toGrid(fen)
    return flipped ? [...g].reverse().map((row) => [...row].reverse()) : g
  }, [fen, flipped])

  return (
    <div className={`${framed ? 'glass rounded-[2rem] p-3' : ''} ${className}`}>
      <div
        className="relative grid aspect-square w-full grid-cols-8 overflow-hidden rounded-[1.4rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
        style={{ containerType: 'inline-size' }}
      >
        {grid.map((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0
            const rank = flipped ? r + 1 : 8 - r
            const file = flipped ? FILES[7 - c] : FILES[c]
            const wave = (r + c) * 0.025

            return (
              <motion.div
                key={`${r}-${c}`}
                initial={animated ? { opacity: 0, scale: 0.85 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay + wave }}
                className={`relative flex items-center justify-center ${
                  isLight ? 'bg-board-light' : 'bg-board-dark'
                }`}
              >
                {showCoordinates && c === 0 && (
                  <span
                    className={`absolute left-[8%] top-[6%] font-medium ${
                      isLight ? 'text-board-dark' : 'text-board-light'
                    }`}
                    style={{ fontSize: '1.7cqw' }}
                  >
                    {rank}
                  </span>
                )}
                {showCoordinates && r === 7 && (
                  <span
                    className={`absolute bottom-[5%] right-[9%] font-medium ${
                      isLight ? 'text-board-dark' : 'text-board-light'
                    }`}
                    style={{ fontSize: '1.7cqw' }}
                  >
                    {file}
                  </span>
                )}

                {showPieces && piece && (
                  <motion.span
                    initial={animated ? { opacity: 0, y: -8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + 0.45 + wave }}
                    className="piece-glyph"
                    style={{
                      fontSize: '8.6cqw',
                      ...(piece === piece.toUpperCase() ? WHITE_PIECE : BLACK_PIECE),
                    }}
                  >
                    {GLYPHS[piece.toLowerCase()]}
                    {'\uFE0E'}
                  </motion.span>
                )}
              </motion.div>
            )
          }),
        )}
      </div>
    </div>
  )
}
