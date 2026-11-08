import React from 'react'
import type { Chess, Square, Color, Move } from 'chess.js'
import { ChessPiece, type PieceTheme } from './ChessPiece'
import { getBoardSquares } from '../utils/chess'

interface BoardProps {
  chess: Chess
  playerColor?: Color
  isFlipped: boolean
  isMyTurn?: boolean
  pieceTheme?: PieceTheme
  selectedSquare: Square | null
  validMoves: Move[]
  lastMove: { from: Square; to: Square } | null
  onSquareClick: (square: Square) => void
}

export const Board: React.FC<BoardProps> = ({
  chess,
  isFlipped,
  pieceTheme = 'staunton',
  selectedSquare,
  validMoves,
  lastMove,
  onSquareClick
}) => {
  const squares = getBoardSquares(isFlipped)
  const inCheck = chess.inCheck()
  const turn = chess.turn()

  // Set of squares that are valid destinations
  const validDestinations = new Map<Square, Move>()
  validMoves.forEach((m) => validDestinations.set(m.to as Square, m))

  return (
    <div className="relative w-full max-w-[420px] aspect-square rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-[#331c0e] via-[#1f1007] to-[#0d0704] border-2 border-amber-600/50 shadow-2xl shadow-black ring-1 ring-amber-500/20">
      {/* Decorative Arena Cornucopia Rivets */}
      <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />

      {/* Board Inner Grid */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 border-[#422411] shadow-inner select-none touch-manipulation">
        {squares.map((sq) => {
          const file = sq[0]
          const rank = sq[1]
          const fileIdx = file.charCodeAt(0) - 97
          const rankIdx = parseInt(rank, 10) - 1
          const isDark = (fileIdx + rankIdx) % 2 === 0

          const piece = chess.get(sq)
          const isSelected = selectedSquare === sq
          const isTargetMove = validDestinations.has(sq)
          const targetMove = validDestinations.get(sq)
          const isLastMoveFrom = lastMove?.from === sq
          const isLastMoveTo = lastMove?.to === sq
          const isKingInCheck = inCheck && piece?.type === 'k' && piece?.color === turn

          // Hunger Games Arena Square Palette:
          // Light: Areia Dourada da Arena (#ecdcb9)
          // Dark: Madeira Queimada / Terra Calcinada (#734b26)
          const bgSquare = isDark ? 'bg-[#734b26]' : 'bg-[#ecdcb9]'
          const coordColor = isDark ? 'text-[#ecdcb9]/60' : 'text-[#543519]'

          return (
            <div
              key={sq}
              onClick={() => onSquareClick(sq)}
              className={`
                relative flex items-center justify-center cursor-pointer transition-colors duration-150
                ${bgSquare}
                ${isSelected ? '!bg-amber-400/80 ring-2 ring-amber-500 inset-0 z-10 shadow-lg shadow-amber-500/30' : ''}
                ${isLastMoveFrom || isLastMoveTo ? '!bg-amber-500/35' : ''}
                ${isKingInCheck ? '!bg-red-600/80 animate-pulse' : ''}
              `}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Coordinate label for rank (left edge) and file (bottom edge) */}
              {((isFlipped ? file === 'h' : file === 'a')) && (
                <span className={`absolute top-0.5 left-1 text-[9px] font-bold pointer-events-none select-none ${coordColor}`}>
                  {rank}
                </span>
              )}
              {((isFlipped ? rank === '8' : rank === '1')) && (
                <span className={`absolute bottom-0.5 right-1 text-[9px] font-bold pointer-events-none select-none ${coordColor}`}>
                  {file}
                </span>
              )}

              {/* Chess Piece */}
              {piece && (
                <div
                  className={`w-full h-full p-1 sm:p-1.5 flex items-center justify-center z-10 transition-transform ${
                    isSelected ? 'scale-110' : ''
                  }`}
                >
                  <ChessPiece type={piece.type} color={piece.color} theme={pieceTheme} />
                </div>
              )}

              {/* Fire Ember Move Indicators */}
              {isTargetMove && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  {piece || targetMove?.flags.includes('e') ? (
                    // Capture target: flame ring
                    <div className="w-full h-full border-4 border-orange-500 rounded-full animate-ping opacity-50" />
                  ) : (
                    // Empty target: burning ember core
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md ring-2 ring-amber-300 shadow-orange-500/50" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
