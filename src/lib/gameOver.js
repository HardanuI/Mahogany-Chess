/**
 * Evaluates a chess.js instance and returns structured terminal match metadata
 * from the human player's perspective ('win' | 'loss' | 'draw').
 *
 * @param {import('chess.js').Chess} game
 * @param {'w' | 'b'} [playerColor='w']
 * @returns {{
 *   isGameOver: boolean,
 *   result: 'win' | 'loss' | 'draw' | null,
 *   reason: string | null,
 *   outcome: string | null,
 * }}
 */
export function evaluateGameOver(game, playerColor = 'w') {
  if (!game || !game.isGameOver()) {
    return { isGameOver: false, result: null, reason: null, outcome: null }
  }

  if (game.isCheckmate()) {
    // In chess.js, game.turn() on checkmate is always the mated side.
    const winnerColor = game.turn() === 'w' ? 'b' : 'w'
    const result = winnerColor === playerColor ? 'win' : 'loss'
    return {
      isGameOver: true,
      result,
      reason: 'By Checkmate',
      outcome: winnerColor === 'w' ? 'Checkmate · White wins' : 'Checkmate · Black wins',
    }
  }

  if (game.isStalemate()) {
    return {
      isGameOver: true,
      result: 'draw',
      reason: 'By Stalemate',
      outcome: 'Stalemate · Draw',
    }
  }

  if (game.isInsufficientMaterial()) {
    return {
      isGameOver: true,
      result: 'draw',
      reason: 'By Insufficient Material',
      outcome: 'Draw · Insufficient Material',
    }
  }

  if (game.isThreefoldRepetition()) {
    return {
      isGameOver: true,
      result: 'draw',
      reason: 'By Threefold Repetition',
      outcome: 'Draw · Repetition',
    }
  }

  if (typeof game.isDrawByFiftyMoves === 'function' && game.isDrawByFiftyMoves()) {
    return {
      isGameOver: true,
      result: 'draw',
      reason: 'By Fifty-Move Rule',
      outcome: 'Draw · 50-Move Rule',
    }
  }

  return {
    isGameOver: true,
    result: 'draw',
    reason: 'By Draw',
    outcome: 'Draw',
  }
}

/**
 * Builds structured terminal match metadata when either clock hits zero.
 *
 * @param {'w' | 'b'} loserColor
 * @param {'w' | 'b'} [playerColor='w']
 */
export function createTimeoutGameOver(loserColor, playerColor = 'w') {
  const result = loserColor === playerColor ? 'loss' : 'win'
  return {
    isGameOver: true,
    result,
    reason: 'By Timeout',
    outcome: result === 'loss' ? 'Time out · Stockfish wins' : 'Time out · Player wins',
  }
}
