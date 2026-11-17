import React, { useMemo } from 'react'
import type { Chess, Square, Color, Move } from 'chess.js'
import { ChessPiece, type PieceTheme } from './ChessPiece'
import { getBoardSquares, getSquareCoords } from '../utils/chess'

interface BoardProps {
  chess: Chess
  playerColor?: Color
  isFlipped: boolean
  isMyTurn?: boolean
  pieceTheme?: PieceTheme
  selectedSquare: Square | null
  validMoves: Move[]
  lastMove?: { from: Square; to: Square } | null
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

  // Fiery trajectory path calculation for the last move
  const movePath = useMemo(() => {
    if (!lastMove) return null

    const fromCoords = getSquareCoords(lastMove.from, isFlipped)
    const toCoords = getSquareCoords(lastMove.to, isFlipped)

    const x1 = fromCoords.col * 100 + 50
    const y1 = fromCoords.row * 100 + 50
    const x2 = toCoords.col * 100 + 50
    const y2 = toCoords.row * 100 + 50

    const colDiff = Math.abs(fromCoords.col - toCoords.col)
    const rowDiff = Math.abs(fromCoords.row - toCoords.row)
    const isKnight = (colDiff === 1 && rowDiff === 2) || (colDiff === 2 && rowDiff === 1)

    if (isKnight) {
      // 2-segment L path for knight trajectory
      const cornerX = Math.abs(toCoords.row - fromCoords.row) === 2 ? x1 : x2
      const cornerY = Math.abs(toCoords.row - fromCoords.row) === 2 ? y2 : y1

      const finalDx = x2 - cornerX
      const finalDy = y2 - cornerY
      const finalLen = Math.hypot(finalDx, finalDy)
      const ux = finalDx / finalLen
      const uy = finalDy / finalLen

      const endOffset = 24
      const headLength = 22
      const headWidth = 18

      const tipX = x2 - ux * endOffset
      const tipY = y2 - uy * endOffset
      const baseX = tipX - ux * headLength
      const baseY = tipY - uy * headLength

      const nx = -uy
      const ny = ux
      const leftX = baseX + nx * (headWidth / 2)
      const leftY = baseY + ny * (headWidth / 2)
      const rightX = baseX - nx * (headWidth / 2)
      const rightY = baseY - ny * (headWidth / 2)

      return {
        d: `M ${x1} ${y1} L ${cornerX} ${cornerY} L ${baseX} ${baseY}`,
        headPolygon: `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`,
        originX: x1,
        originY: y1
      }
    } else {
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.hypot(dx, dy)
      if (len === 0) return null

      const ux = dx / len
      const uy = dy / len

      const endOffset = 24
      const headLength = 22
      const headWidth = 18

      const tipX = x2 - ux * endOffset
      const tipY = y2 - uy * endOffset
      const baseX = tipX - ux * headLength
      const baseY = tipY - uy * headLength

      const nx = -uy
      const ny = ux
      const leftX = baseX + nx * (headWidth / 2)
      const leftY = baseY + ny * (headWidth / 2)
      const rightX = baseX - nx * (headWidth / 2)
      const rightY = baseY - ny * (headWidth / 2)

      return {
        d: `M ${x1} ${y1} L ${baseX} ${baseY}`,
        headPolygon: `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`,
        originX: x1,
        originY: y1
      }
    }
  }, [lastMove, isFlipped])

  return (
    <div className="relative w-full max-w-[420px] aspect-square rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-[#331c0e] via-[#1f1007] to-[#0d0704] border-2 border-amber-600/50 shadow-2xl shadow-black ring-1 ring-amber-500/20">
      {/* Decorative Arena Cornucopia Rivets */}
      <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />
      <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shadow" />

      {/* Board Inner Grid */}
      <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 border-[#422411] shadow-inner select-none touch-manipulation">
        {/* SVG Arrow & Trajectory Path showing where the piece moved */}
        {movePath && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            viewBox="0 0 800 800"
          >
            <defs>
              <filter id="flamePathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer flame glow */}
            <path
              d={movePath.d}
              fill="none"
              stroke="#ea580c"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
              filter="url(#flamePathGlow)"
            />

            {/* Inner burning energy core */}
            <path
              d={movePath.d}
              fill="none"
              stroke="#fef08a"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 6"
              className="animate-pulse"
            />

            {/* Origin node ring */}
            <circle
              cx={movePath.originX}
              cy={movePath.originY}
              r="12"
              fill="#ea580c"
              fillOpacity="0.45"
              stroke="#f97316"
              strokeWidth="3"
            />
            <circle
              cx={movePath.originX}
              cy={movePath.originY}
              r="4.5"
              fill="#fef08a"
            />

            {/* Arrowhead */}
            <polygon
              points={movePath.headPolygon}
              fill="#ea580c"
              stroke="#fef08a"
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter="url(#flamePathGlow)"
            />
          </svg>
        )}

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
          const isKingInCheck = inCheck && piece?.type === 'k' && piece?.color === turn
          const isLastMoveFrom = lastMove?.from === sq
          const isLastMoveTo = lastMove?.to === sq

          // Calculate sliding translation if this piece just arrived at destination
          let slideStyle: React.CSSProperties | undefined = undefined
          if (isLastMoveTo && lastMove) {
            const fromCoords = getSquareCoords(lastMove.from, isFlipped)
            const toCoords = getSquareCoords(lastMove.to, isFlipped)
            const deltaCol = fromCoords.col - toCoords.col
            const deltaRow = fromCoords.row - toCoords.row
            slideStyle = {
              '--slide-x': `${deltaCol * 100}%`,
              '--slide-y': `${deltaRow * 100}%`
            } as React.CSSProperties
          }

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
                ${isKingInCheck ? '!bg-red-600/80 animate-pulse' : ''}
              `}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Last Move Origin: dashed fiery border showing where the piece came from */}
              {isLastMoveFrom && !isSelected && (
                <div className="absolute inset-0.5 border-2 border-dashed border-orange-500/70 rounded pointer-events-none z-15" />
              )}

              {/* Last Move Destination: prominent high-contrast fiery flame border */}
              {isLastMoveTo && !isSelected && (
                <div className="absolute inset-0 border-[3px] border-orange-500 rounded-sm pointer-events-none z-15 shadow-[0_0_10px_rgba(249,115,22,0.85),inset_0_0_8px_rgba(249,115,22,0.45)]">
                  {/* Glowing fiery ember beacon in the top-right corner */}
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400 ring-1 ring-amber-100 shadow-md shadow-orange-500 animate-pulse" />
                </div>
              )}

              {/* Coordinate label for rank (left edge) and file (bottom edge) */}
              {((isFlipped ? file === 'h' : file === 'a')) && (
                <span className={`absolute top-0.5 left-1 text-[9px] font-bold pointer-events-none select-none z-10 ${coordColor}`}>
                  {rank}
                </span>
              )}
              {((isFlipped ? rank === '8' : rank === '1')) && (
                <span className={`absolute bottom-0.5 right-1 text-[9px] font-bold pointer-events-none select-none z-10 ${coordColor}`}>
                  {file}
                </span>
              )}

              {/* Chess Piece with smooth sliding animation on destination square */}
              {piece && (
                <div
                  key={isLastMoveTo && lastMove ? `${lastMove.from}-${lastMove.to}` : sq}
                  style={slideStyle}
                  className={`w-full h-full p-1 sm:p-1.5 flex items-center justify-center transition-transform ${
                    isSelected
                      ? 'scale-110 z-30'
                      : isLastMoveTo
                      ? 'animate-piece-slide z-20'
                      : 'z-20'
                  }`}
                >
                  <ChessPiece type={piece.type} color={piece.color} theme={pieceTheme} />
                </div>
              )}

              {/* Fire Ember Move Indicators */}
              {isTargetMove && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
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
