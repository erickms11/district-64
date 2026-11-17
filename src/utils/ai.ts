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

// Positional bonuses (Piece-Square Tables) - Oriented from White's perspective (0 = a8, 63 = h1)
const PAWN_PST = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 27, 27, 10,  5,  5,
   0,  0,  0, 25, 25,  0,  0,  0,
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

// Rook table: rewards 7th rank (+35) and active central/open files, disincentivizes passive corner shuffling
const ROOK_PST = [
   0,   0,   0,   5,   5,   0,   0,   0,
  25,  30,  30,  35,  35,  30,  30,  25,
  -5,   5,  10,  15,  15,  10,   5,  -5,
  -5,   5,  10,  15,  15,  10,   5,  -5,
  -5,   5,  10,  15,  15,  10,   5,  -5,
  -5,   5,  10,  15,  15,  10,   5,  -5,
  -5,   5,  10,  15,  15,  10,   5,  -5,
   0,   5,  10,  15,  15,  10,   5,   0
]

const QUEEN_PST = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5, 10, 10,  5,  0, -5,
    0,  0,  5, 10, 10,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
]

const KING_MIDGAME_PST = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
]

const KING_ENDGAME_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 20, 25, 25, 20, 10,-10,
  -10, 10, 25, 30, 30, 25, 10,-10,
  -10, 10, 25, 30, 30, 25, 10,-10,
  -10, 10, 20, 25, 25, 20, 10,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
]

function evaluateBoard(chess: Chess): number {
  let score = 0
  const board = chess.board()

  // Detect endgame condition (no queens or reduced major/minor pieces)
  let queensCount = 0
  let majorMinorPiecesCount = 0

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece) continue

      if (piece.type === 'q') queensCount++
      else if (piece.type !== 'p' && piece.type !== 'k') majorMinorPiecesCount++

      let val = PIECE_VALUES[piece.type]
      const squareIdx = r * 8 + c
      const pstIdx = piece.color === 'w' ? squareIdx : 63 - squareIdx

      if (piece.type === 'p') {
        val += PAWN_PST[pstIdx]
      } else if (piece.type === 'n') {
        val += KNIGHT_PST[pstIdx]
      } else if (piece.type === 'b') {
        val += BISHOP_PST[pstIdx]
      } else if (piece.type === 'r') {
        val += ROOK_PST[pstIdx]
      } else if (piece.type === 'q') {
        val += QUEEN_PST[pstIdx]
      } else if (piece.type === 'k') {
        const isEndgame = queensCount === 0 || (queensCount <= 2 && majorMinorPiecesCount <= 2)
        val += isEndgame ? KING_ENDGAME_PST[pstIdx] : KING_MIDGAME_PST[pstIdx]
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
  // Evaluation of terminal game states
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      // The side to move is in checkmate
      return chess.turn() === 'w' ? -100000 - depth * 100 : 100000 + depth * 100
    }
    // Draw by stalemate, repetition, or 50 moves
    return 0
  }

  if (depth === 0) {
    return evaluateBoard(chess)
  }

  const moves = chess.moves({ verbose: true })
  // Move ordering: sort captures and promotions first for faster alpha-beta cutoffs
  moves.sort((a, b) => {
    let scoreA = a.captured ? PIECE_VALUES[a.captured] : 0
    let scoreB = b.captured ? PIECE_VALUES[b.captured] : 0
    if (a.promotion) scoreA += 800
    if (b.promotion) scoreB += 800
    return scoreB - scoreA
  })

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
  // Clone the game with full PGN history so repetition detection works accurately
  const game = new Chess()
  try {
    game.loadPgn(chess.pgn())
  } catch {
    game.load(chess.fen())
  }

  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return null

  // Easy (Recruta): chance frequente de lance imprevisível e lúdico
  if (difficulty === 'easy' && Math.random() < 0.35) {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Medium (Pacificador) - Ajustado para ser mais acessível e divertido!
  // ~22% das vezes faz um lance humano casual de desenvolvimento em vez de combos implacáveis
  if (difficulty === 'medium' && Math.random() < 0.22) {
    const safeMoves = moves.filter((m) => m.piece !== 'q' || !m.to.match(/[d-e][4-5]/))
    const pool = safeMoves.length > 0 ? safeMoves : moves
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const isMaximizing = game.turn() === 'w'

  // Profundidade minimax baseada na dificuldade
  let depth = 1
  if (difficulty === 'expert') {
    // Expert (Snow): depth 4 no meio/final, depth 3 com muitas peças para resposta fluida
    depth = moves.length > 30 ? 3 : 4
  } else if (difficulty === 'hard') {
    depth = 3
  } else if (difficulty === 'medium') {
    depth = 2
  } else {
    depth = 1
  }

  // Extract CPU's own last move (2 half-moves ago in history) to detect and penalize immediate shuffling
  const history = game.history({ verbose: true })
  const lastCpuMove = history.length >= 2 ? history[history.length - 2] : null

  // Sort candidate moves
  moves.sort((a, b) => {
    let scoreA = a.captured ? PIECE_VALUES[a.captured] : 0
    let scoreB = b.captured ? PIECE_VALUES[b.captured] : 0
    if (a.promotion) scoreA += 800
    if (b.promotion) scoreB += 800
    return scoreB - scoreA
  })

  const scoredMoves: { move: Move; score: number }[] = []

  for (const move of moves) {
    game.move(move)
    let score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing)

    // Threefold repetition guard: heavily penalize triggering a repetition draw if not in a losing state
    if (game.isThreefoldRepetition() || game.isDraw()) {
      if (isMaximizing) {
        score -= 900
      } else {
        score += 900
      }
    }

    // Anti-shuffle penalty: penalize immediately undoing the previous move without capturing or checking
    if (lastCpuMove && move.from === lastCpuMove.to && move.to === lastCpuMove.from) {
      if (!move.captured && !game.inCheck()) {
        if (isMaximizing) {
          score -= 300
        } else {
          score += 300
        }
      }
    }

    game.undo()
    scoredMoves.push({ move, score })
  }

  if (scoredMoves.length === 0) return moves[0]

  // Sort by score according to turn
  scoredMoves.sort((a, b) => (isMaximizing ? b.score - a.score : a.score - b.score))

  const bestScore = scoredMoves[0].score

  // Margem de seleção de candidatos:
  // - Expert: 0 (sempre o lance matematicamente superior)
  // - Hard: 8 (firme e competitivo)
  // - Medium: 140 (ampla margem para variedade humana e acessível, permitindo vitórias ao jogador)
  // - Easy: 260
  const margin = difficulty === 'expert' ? 0 : difficulty === 'hard' ? 8 : difficulty === 'medium' ? 140 : 260
  const topCandidates = scoredMoves.filter((sm) => Math.abs(sm.score - bestScore) <= margin)

  // No expert ou quando só há 1 candidato de ponta, joga o melhor absoluto
  if (difficulty === 'expert' || topCandidates.length === 1) {
    return topCandidates[0].move
  }

  // No hard, 90% das vezes escolhe o melhor absoluto
  if (difficulty === 'hard' && Math.random() < 0.9) {
    return topCandidates[0].move
  }

  // No medium/easy, sorteia entre os candidatos válidos para um jogo natural e equilibrado
  const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)]
  return chosen.move
}
