import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { TouchBackend, TouchBackendImpl } from 'react-dnd-touch-backend'
import { CUSTOM_PIECES } from './chessPieces'

// Reset any stale react-dnd singleton stored on window across HMR or remounts
const DND_INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__')
function resetStaleDndSingleton() {
  if (typeof window === 'undefined') return
  try {
    const existingManager = window[DND_INSTANCE_SYM]?.dragDropManager
    const existingBackend = existingManager?.getBackend?.()
    existingBackend?.teardown?.()
    if (existingBackend?.constructor) {
      existingBackend.constructor.isSetUp = false
    }
  } catch {
    // ignore teardown errors
  }
  TouchBackendImpl.isSetUp = false
  delete window[DND_INSTANCE_SYM]
  delete window.__isReactDndBackendSetUp
}

resetStaleDndSingleton()

// Universal DnD backend supporting mouse, trackpad, and touch simultaneously
function UniversalDndBackend(manager, context, options) {
  TouchBackendImpl.isSetUp = false
  return TouchBackend(manager, context, {
    enableMouseEvents: true,
    enableTouchEvents: true,
    touchSlop: 4,
    ...options,
  })
}

const LIGHT_SQUARE_STYLE = { backgroundColor: '#EFE5D3' }
const DARK_SQUARE_STYLE = { backgroundColor: '#B38E6A' }

const BOARD_STYLE = {
  borderRadius: '1.4rem',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.35)',
}

const NOTATION_STYLE = {
  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
  fontWeight: 600,
  fontSize: '11px',
}

const DROP_SQUARE_STYLE = {
  boxShadow: 'inset 0 0 0 3px rgba(26, 26, 26, 0.4)',
}

const SELECTED_SQUARE_STYLE = {
  backgroundColor: 'rgba(107, 112, 76, 0.48)',
  boxShadow: 'inset 0 0 0 2px rgba(26, 26, 26, 0.22)',
}

// Small centered circle for empty legal destination squares
const EMPTY_HINT_STYLE = {
  background: 'radial-gradient(circle, rgba(26, 26, 26, 0.38) 21%, transparent 23%)',
}

// Ring highlight around enemy pieces that can be captured
const CAPTURE_HINT_STYLE = {
  background:
    'radial-gradient(circle, transparent 60%, rgba(26, 26, 26, 0.48) 62%, rgba(26, 26, 26, 0.48) 78%, transparent 80%)',
  boxShadow: 'inset 0 0 0 2.5px rgba(26, 26, 26, 0.28)',
}

const LAST_MOVE_STYLE = {
  backgroundColor: 'rgba(139, 107, 74, 0.34)',
}

/**
 * Interactive chessboard powered by chess.js and react-chessboard.
 * Features custom minimalist silhouette pieces, drag-and-drop, click-to-move,
 * legal move dots, capture rings, and automatic snap-back on illegal moves.
 */
export default function ChessBoard({
  boardOrientation = 'white',
  onGameChange,
}) {
  const gameRef = useRef(new Chess())
  const containerRef = useRef(null)
  const selectedSquareRef = useRef(null)
  const pointerDownRef = useRef(null)
  const lastClickTimeRef = useRef(0)
  const lastDropTimeRef = useRef(0)

  const [boardWidth, setBoardWidth] = useState(552)
  const [fen, setFen] = useState(() => gameRef.current.fen())
  const [, setSelectedSquare] = useState(null)
  const [optionSquares, setOptionSquares] = useState({})
  const [lastMove, setLastMove] = useState(null)

  // Keep boardWidth responsive to container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateWidth = () => {
      if (el.offsetWidth > 0) {
        setBoardWidth(el.offsetWidth)
      }
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const clearHints = useCallback(() => {
    selectedSquareRef.current = null
    setSelectedSquare(null)
    setOptionSquares({})
  }, [])

  /**
   * Computes legal move hints for a given square using chess.js.
   * Displays small dots on empty valid squares and rings on capturable enemy pieces.
   */
  const showLegalMoveHints = useCallback((square) => {
    if (!square) return false
    const game = gameRef.current
    const piece = game.get(square)

    if (!piece || piece.color !== game.turn()) {
      selectedSquareRef.current = null
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

    selectedSquareRef.current = square
    setSelectedSquare(square)
    setOptionSquares(nextSquares)
    return true
  }, [])

  /**
   * Attempts a move on the chess.js instance.
   * Updates FEN state if legal; returns false if illegal so the piece snaps back.
   */
  const tryMakeMove = useCallback(
    (sourceSquare, targetSquare) => {
      if (!sourceSquare || !targetSquare || sourceSquare === targetSquare) {
        return false
      }

      const game = gameRef.current
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        })

        if (!move) return false

        const nextFen = game.fen()
        setFen(nextFen)
        setLastMove({ from: sourceSquare, to: targetSquare })
        clearHints()
        onGameChange?.({
          fen: nextFen,
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
      lastDropTimeRef.current = performance.now()
      const moved = tryMakeMove(sourceSquare, targetSquare)
      if (!moved && sourceSquare !== targetSquare) {
        clearHints()
      }
      return moved
    },
    [tryMakeMove, clearHints],
  )

  const handlePieceDropOffBoard = useCallback(() => {
    clearHints()
  }, [clearHints])

  const processSquareSelection = useCallback(
    (square) => {
      if (!square) return
      const currentSelected = selectedSquareRef.current

      // Clicking the already-selected square deselects it
      if (currentSelected === square) {
        clearHints()
        return
      }

      // If a piece is currently selected, try moving it to the clicked square
      if (currentSelected) {
        const moved = tryMakeMove(currentSelected, square)
        if (moved) return
      }

      // Otherwise select the clicked square if it contains a piece of the active turn
      showLegalMoveHints(square)
    },
    [clearHints, tryMakeMove, showLegalMoveHints],
  )

  const handleSquareClick = useCallback(
    (square) => {
      const now = performance.now()
      if (now - lastClickTimeRef.current < 120) return
      lastClickTimeRef.current = now
      processSquareSelection(square)
    },
    [processSquareSelection],
  )

  // Direct pointer handlers ensure clicking and dragging work even if a browser blocks DnD events
  const handlePointerDown = useCallback(
    (e) => {
      if (e.button !== undefined && e.button !== 0) return
      const squareEl = e.target?.closest?.('[data-square]')
      const square = squareEl?.getAttribute('data-square')
      if (!square) return

      const game = gameRef.current
      const piece = game.get(square)
      const isFriendlyPiece = Boolean(piece && piece.color === game.turn())
      const wasAlreadySelected = selectedSquareRef.current === square

      let selectedOnDown = false
      if (isFriendlyPiece && !wasAlreadySelected) {
        showLegalMoveHints(square)
        selectedOnDown = true
      }

      pointerDownRef.current = {
        square,
        x: e.clientX,
        y: e.clientY,
        selectedOnDown,
      }
    },
    [showLegalMoveHints],
  )

  const handlePointerUp = useCallback(
    (e) => {
      const start = pointerDownRef.current
      pointerDownRef.current = null
      if (!start) return

      const targetEl = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest?.('[data-square]')
      const targetSquare = targetEl?.getAttribute('data-square')
      if (!targetSquare) return

      const now = performance.now()

      // Dragged from one square to another
      if (targetSquare !== start.square) {
        lastClickTimeRef.current = now
        if (now - lastDropTimeRef.current > 120) {
          handlePieceDrop(start.square, targetSquare)
        }
        return
      }

      // Released on the same square that was just selected on pointerdown: keep it selected
      if (start.selectedOnDown) {
        lastClickTimeRef.current = now
        return
      }

      // Released on a destination square or clicked an already-selected square to deselect
      if (now - lastClickTimeRef.current >= 120) {
        lastClickTimeRef.current = now
        processSquareSelection(targetSquare)
      }
    },
    [handlePieceDrop, processSquareSelection],
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
    <div className="relative rounded-[2rem] p-3">
      {/* Glass frame rendered as a sibling layer so backdrop-filter does not offset react-dnd's fixed drag layer */}
      <div
        aria-hidden
        className="glass pointer-events-none absolute inset-0 rounded-[2rem]"
      />
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative aspect-square w-full select-none"
      >
        <Chessboard
          id="ArbiterChessboard"
          boardWidth={boardWidth}
          position={fen}
          boardOrientation={boardOrientation}
          customDndBackend={UniversalDndBackend}
          customPieces={CUSTOM_PIECES}
          arePiecesDraggable={true}
          isDraggablePiece={({ piece }) => piece[0] === gameRef.current.turn()}
          autoPromoteToQueen={true}
          snapToCursor={true}
          dropOffBoardAction="snapback"
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDrop={handlePieceDrop}
          onPieceDropOffBoard={handlePieceDropOffBoard}
          onSquareClick={handleSquareClick}
          customBoardStyle={BOARD_STYLE}
          customDarkSquareStyle={DARK_SQUARE_STYLE}
          customLightSquareStyle={LIGHT_SQUARE_STYLE}
          customDropSquareStyle={DROP_SQUARE_STYLE}
          customNotationStyle={NOTATION_STYLE}
          customSquareStyles={customSquareStyles}
          animationDuration={180}
        />
      </div>
    </div>
  )
}
