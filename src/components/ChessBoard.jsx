import { useCallback, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

const LIGHT_SQUARE_STYLE = { backgroundColor: '#EFE5D3' }
const DARK_SQUARE_STYLE = { backgroundColor: '#B38E6A' }

const BOARD_STYLE = {
  borderRadius: '1.4rem',
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.35)',
}

const SELECTED_SQUARE_STYLE = {
  backgroundColor: 'rgba(139, 107, 74, 0.42)',
}

// Small centered circle for empty legal destination squares
const EMPTY_HINT_STYLE = {
  background: 'radial-gradient(circle, rgba(26, 26, 26, 0.28) 20%, transparent 22%)',
  borderRadius: '50%',
}

// Ring highlight around enemy pieces that can be captured
const CAPTURE_HINT_STYLE = {
  background:
    'radial-gradient(circle, transparent 58%, rgba(26, 26, 26, 0.36) 60%, rgba(26, 26, 26, 0.36) 75%, transparent 77%)',
  borderRadius: '50%',
}

const LAST_MOVE_STYLE = {
  backgroundColor: 'rgba(107, 112, 76, 0.28)',
}

/**
 * Interactive chessboard powered by chess.js and react-chessboard.
 * Supports drag-and-drop, click-to-move, legal move dots, capture rings,
 * and automatic snap-back on illegal moves.
 */
export default function ChessBoard({
  boardOrientation = 'white',
  onGameChange,
}) {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState(() => gameRef.current.fen())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [optionSquares, setOptionSquares] = useState({})
  const [lastMove, setLastMove] = useState(null)

  const clearHints = useCallback(() => {
    setSelectedSquare(null)
    setOptionSquares({})
  }, [])

  /**
   * Computes legal move hints for a given square using chess.js.
   * Returns true if the square has a piece belonging to the side to move.
   */
  const showLegalMoveHints = useCallback((square) => {
    const game = gameRef.current
    const piece = game.get(square)

    if (!piece || piece.color !== game.turn()) {
      setSelectedSquare(null)
      setOptionSquares({})
      return false
    }

    const moves = game.moves({ square, verbose: true })
    const nextSquares = {
      [square]: SELECTED_SQUARE_STYLE,
    }

    for (const move of moves) {
      const targetPiece = game.get(move.to)
      const isCapture =
        Boolean(move.captured) ||
        Boolean(targetPiece && targetPiece.color !== piece.color)

      nextSquares[move.to] = isCapture ? CAPTURE_HINT_STYLE : EMPTY_HINT_STYLE
    }

    setSelectedSquare(square)
    setOptionSquares(nextSquares)
    return true
  }, [])

  /**
   * Attempts a move on the chess.js instance.
   * Returns true if legal, or false so react-chessboard snaps the piece back.
   */
  const tryMakeMove = useCallback(
    (sourceSquare, targetSquare) => {
      const game = gameRef.current
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        })

        if (!move) return false

        setFen(game.fen())
        setLastMove({ from: sourceSquare, to: targetSquare })
        clearHints()
        onGameChange?.({
          fen: game.fen(),
          turn: game.turn(),
          history: game.history({ verbose: true }),
          inCheck: game.inCheck(),
          isGameOver: game.isGameOver(),
        })
        return true
      } catch {
        return false
      }
    },
    [clearHints, onGameChange],
  )

  const handlePieceDragBegin = useCallback(
    (_piece, sourceSquare) => {
      showLegalMoveHints(sourceSquare)
    },
    [showLegalMoveHints],
  )

  const handlePieceDrop = useCallback(
    (sourceSquare, targetSquare) => {
      const moved = tryMakeMove(sourceSquare, targetSquare)
      if (!moved) {
        clearHints()
      }
      return moved
    },
    [tryMakeMove, clearHints],
  )

  const handlePieceDragEnd = useCallback(() => {
    // Clear hints if a drag ends without completing a move
    clearHints()
  }, [clearHints])

  const handleSquareClick = useCallback(
    (square) => {
      // Clicking the already-selected square deselects it
      if (selectedSquare === square) {
        clearHints()
        return
      }

      // If a piece is currently selected, try moving to the clicked square first
      if (selectedSquare) {
        const moved = tryMakeMove(selectedSquare, square)
        if (moved) return
      }

      // Otherwise select the clicked square if it contains a valid piece to move
      showLegalMoveHints(square)
    },
    [selectedSquare, clearHints, tryMakeMove, showLegalMoveHints],
  )

  const customSquareStyles = useMemo(() => {
    const styles = {}
    if (lastMove) {
      styles[lastMove.from] = LAST_MOVE_STYLE
      styles[lastMove.to] = LAST_MOVE_STYLE
    }
    return {
      ...styles,
      ...optionSquares,
    }
  }, [lastMove, optionSquares])

  return (
    <div className="glass rounded-[2rem] p-3">
      <div className="aspect-square w-full">
        <Chessboard
          id="ArbiterChessboard"
          position={fen}
          boardOrientation={boardOrientation}
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDrop={handlePieceDrop}
          onPieceDragEnd={handlePieceDragEnd}
          onSquareClick={handleSquareClick}
          customBoardStyle={BOARD_STYLE}
          customDarkSquareStyle={DARK_SQUARE_STYLE}
          customLightSquareStyle={LIGHT_SQUARE_STYLE}
          customSquareStyles={customSquareStyles}
          animationDuration={220}
        />
      </div>
    </div>
  )
}
