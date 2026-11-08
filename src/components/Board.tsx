import React from 'react'
import type { Chess, Square, Color, Move } from 'chess.js'
import { ChessPiece } from './ChessPiece'
import { getBoardSquares } from '../utils/chess'

interface BoardProps {
  chess: Chess
  playerColor?: Color
  isFlipped: boolean
  isMyTurn?: boolean
  selectedSquare: Square | null
  validMoves: Move[]
  lastMove: { from: Square; to: Square } | null
  onSquareClick: (square: Square) => void
}

export const Board: React.FC<BoardProps> = ({
  chess,
  isFlipped,
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
    <div className="relative w-full max-w-[420px] aspect-square rounded-2xl p-2 sm:p-2.5 bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 border-2 border-amber-500/60 shadow-2xl shadow-black/80">
      {/* Board Inner Grid */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-amber-950/70 shadow-inner select-none touch-manipulation">
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

          // High-contrast Arena theme:
          // Light: Marfim/Areia dourada quente (#f3ebd7)
          // Dark: Madeira/Bronze nobre da Arena (#a67344)
          const bgSquare = isDark ? 'bg-[#a67344]' : 'bg-[#f4ecdc]'
          const coordColor = isDark ? 'text-[#f4ecdc]/70' : 'text-[#85572b]'

          return (
            <div
              key={sq}
              onClick={() => onSquareClick(sq)}
              className={`
                relative flex items-center justify-center cursor-pointer transition-colors duration-150
                ${bgSquare}
                ${isSelected ? '!bg-amber-400/70 ring-2 ring-amber-500 inset-0 z-10' : ''}
                ${isLastMoveFrom || isLastMoveTo ? '!bg-amber-300/50' : ''}
                ${isKingInCheck ? '!bg-red-500/80 animate-pulse' : ''}
              `}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Coordinate label for rank (left edge) and file (bottom edge) */}
              {((isFlipped ? file === 'h' : file === 'a')) && (
                <span className={`absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none select-none ${coordColor}`}>
                  {rank}
                </span>
              )}
              {((isFlipped ? rank === '8' : rank === '1')) && (
                <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold pointer-events-none select-none ${coordColor}`}>
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
                  <ChessPiece type={piece.type} color={piece.color} />
                </div>
              )}

              {/* Move Indicator Dots / Ring */}
              {isTargetMove && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  {piece || targetMove?.flags.includes('e') ? (
                    // Capture target: strong ring
                    <div className="w-full h-full border-4 border-amber-600/90 rounded-full animate-ping opacity-40" />
                  ) : (
                    // Simple empty move: center dot with good contrast
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-900/60 shadow-md ring-2 ring-amber-400" />
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
