import { Chess } from 'chess.js'
import type { Square, PieceSymbol } from 'chess.js'
import type { CapturedPieces, GameStatus } from '../types'

export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const INITIAL_PIECE_COUNTS: Record<PieceSymbol, number> = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1
}

export function computeCapturedPieces(chess: Chess): CapturedPieces {
  const currentCounts = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  }

  const board = chess.board()
  for (const row of board) {
    for (const cell of row) {
      if (cell) {
        currentCounts[cell.color][cell.type]++
      }
    }
  }

  const captured: CapturedPieces = {
    w: [],
    b: []
  }

  const order: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p']

  for (const p of order) {
    const whiteMissing = INITIAL_PIECE_COUNTS[p] - currentCounts.w[p]
    for (let i = 0; i < whiteMissing; i++) {
      captured.w.push(p)
    }

    const blackMissing = INITIAL_PIECE_COUNTS[p] - currentCounts.b[p]
    for (let i = 0; i < blackMissing; i++) {
      captured.b.push(p)
    }
  }

  return captured
}

export function evaluateGameStatus(chess: Chess): GameStatus {
  const inCheck = chess.inCheck()
  const isOver = chess.isGameOver()

  if (!isOver) {
    return {
      isOver: false,
      winner: null,
      reason: null,
      inCheck
    }
  }

  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'b' : 'w'
    return {
      isOver: true,
      winner,
      reason: 'checkmate',
      inCheck: true
    }
  }

  if (chess.isStalemate()) {
    return {
      isOver: true,
      winner: 'draw',
      reason: 'stalemate',
      inCheck: false
    }
  }

  return {
    isOver: true,
    winner: 'draw',
    reason: 'draw',
    inCheck: false
  }
}

export function getBoardSquares(isFlipped: boolean): Square[] {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  const orderedFiles = isFlipped ? [...files].reverse() : files
  const orderedRanks = isFlipped ? [...ranks].reverse() : ranks

  const squares: Square[] = []
  for (const rank of orderedRanks) {
    for (const file of orderedFiles) {
      squares.push(`${file}${rank}` as Square)
    }
  }
  return squares
}

export function getSquareCoords(sq: Square, isFlipped: boolean): { col: number; row: number } {
  const file = sq.charCodeAt(0) - 97 // 0=a .. 7=h
  const rank = parseInt(sq[1], 10) - 1 // 0=1 .. 7=8
  if (!isFlipped) {
    return { col: file, row: 7 - rank }
  } else {
    return { col: 7 - file, row: rank }
  }
}
