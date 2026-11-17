import type { Square, PieceSymbol, Color } from 'chess.js'

export type { Square, PieceSymbol, Color }

export type GameMode = 'online' | 'local' | 'cpu'

export type CpuDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type TimeControl = 0 | 180 | 300 | 600 // 0 = sem tempo, 3m, 5m, 10m

export type PieceTheme = 'duolingo' | 'staunton'

export type BoardTheme = 'clean' | 'arena'

export interface PeerEmote {
  icon: string
  label: string
}

export interface PeerMessage {
  type: 'MOVE' | 'RESTART' | 'SURRENDER' | 'SYNC_STATE' | 'TIMEOUT' | 'EMOTE'
  move?: {
    from: Square
    to: Square
    promotion?: PieceSymbol
  }
  emote?: PeerEmote
  fen?: string
  color?: Color
  timestamp?: number
  timeRemaining?: { w: number; b: number }
  timeControl?: TimeControl
  clocks?: { w: number; b: number }
}

export interface GameStatus {
  isOver: boolean
  winner: Color | 'draw' | null
  reason: 'checkmate' | 'stalemate' | 'draw' | 'surrender' | 'timeout' | null
  inCheck: boolean
}

export interface CapturedPieces {
  w: PieceSymbol[]
  b: PieceSymbol[]
}
