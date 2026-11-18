import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CUSTOM_PIECES } from './chessPieces'

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

const FILES = 'abcdefgh'

// Expands the piece-placement part of a FEN string into an 8×8 grid.
function toGrid(fen) {
  return fen
    .split(' ')[0]
    .split('/')
    .map((row) =>
      row.split('').flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill(null) : [ch])),
    )
}

function fenCharToPieceKey(ch) {
  if (!ch) return null
  const color = ch === ch.toUpperCase() ? 'w' : 'b'
  return `${color}${ch.toUpperCase()}`
}

/**
 * Static decorative mini-board used for LandingPage previews.
 * Uses the same custom minimalist silhouette SVGs as the playable ChessBoard.
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
            const pieceKey = fenCharToPieceKey(piece)
            const renderPiece = pieceKey ? CUSTOM_PIECES[pieceKey] : null

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

                {showPieces && renderPiece && (
                  <div className="flex h-full w-full items-center justify-center">
                    {renderPiece({ squareWidth: '100%', isDragging: false })}
                  </div>
                )}
              </motion.div>
            )
          }),
        )}
      </div>
    </div>
  )
}
