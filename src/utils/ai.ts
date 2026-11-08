import { Chess } from 'chess.js'
import type { Move, PieceSymbol } from 'chess.js'
import type { CpuDifficulty } from '../types'

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
}

// Positional bonuses (Piece-Square Tables)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
]

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
]

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
]

function evaluateBoard(chess: Chess): number {
  let score = 0
  const board = chess.board()

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece) continue

      let val = PIECE_VALUES[piece.type]
      const squareIdx = r * 8 + c

      if (piece.type === 'p') {
        const pstVal = piece.color === 'w' ? PAWN_PST[squareIdx] : PAWN_PST[63 - squareIdx]
        val += pstVal
      } else if (piece.type === 'n') {
        const pstVal = piece.color === 'w' ? KNIGHT_PST[squareIdx] : KNIGHT_PST[63 - squareIdx]
        val += pstVal
      } else if (piece.type === 'b') {
        const pstVal = piece.color === 'w' ? BISHOP_PST[squareIdx] : BISHOP_PST[63 - squareIdx]
        val += pstVal
      }

      score += piece.color === 'w' ? val : -val
    }
  }

  return score
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess)
  }

  const moves = chess.moves({ verbose: true })
  moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0))

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of moves) {
      chess.move(move)
      const evaluation = minimax(chess, depth - 1, alpha, beta, false)
      chess.undo()
      maxEval = Math.max(maxEval, evaluation)
      alpha = Math.max(alpha, evaluation)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of moves) {
      chess.move(move)
      const evaluation = minimax(chess, depth - 1, alpha, beta, true)
      chess.undo()
      minEval = Math.min(minEval, evaluation)
      beta = Math.min(beta, evaluation)
      if (beta <= alpha) break
    }
    return minEval
  }
}

export function getBestCpuMove(chess: Chess, difficulty: CpuDifficulty): Move | null {
  // Always use a detached clone so we never mutate or conflict with the active game state
  const game = new Chess(chess.fen())
  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return null

  // Easy: occasionally make a random move
  if (difficulty === 'easy') {
    if (Math.random() < 0.4) {
      return moves[Math.floor(Math.random() * moves.length)]
    }
  }

  const isMaximizing = game.turn() === 'w'
  const depth = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1

  let bestMove: Move = moves[0]
  let bestScore = isMaximizing ? -Infinity : Infinity

  moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0))

  for (const move of moves) {
    game.move(move)
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing)
    game.undo()

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    } else {
      if (score < bestScore) {
        bestScore = score
        bestMove = move
      }
    }
  }

  return bestMove
}
