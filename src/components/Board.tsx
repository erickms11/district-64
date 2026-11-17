import React from 'react'
import type { Chess, Square, Color, Move } from 'chess.js'
import { ChessPiece, type PieceTheme } from './ChessPiece'
import type { BoardTheme } from '../types'
import { getBoardSquares, getSquareCoords } from '../utils/chess'

interface BoardProps {
  chess: Chess
  playerColor?: Color
  isFlipped: boolean
  isMyTurn?: boolean
  pieceTheme?: PieceTheme
  boardTheme?: BoardTheme
  selectedSquare: Square | null
  validMoves: Move[]
  lastMove?: { from: Square; to: Square } | null
  onSquareClick: (square: Square) => void
}

// 🦅 Símbolo do Tordo (Mockingjay) com a Flecha e o Anel - Marca d'água sutil e elegante no centro do tabuleiro
const MockingjayWatermark: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    className="w-56 h-56 sm:w-64 sm:h-64 pointer-events-none select-none text-amber-500 opacity-[0.11]"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="tordoGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Outer Circular Ring of the Hunger Games Emblem */}
    <circle cx="100" cy="100" r="86" fill="none" stroke="url(#tordoGold)" strokeWidth="4.5" />
    <circle cx="100" cy="100" r="80" fill="none" stroke="url(#tordoGold)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

    {/* The Arrow (shaft, tip, fletching) passing diagonally */}
    <line x1="32" y1="168" x2="162" y2="38" stroke="url(#tordoGold)" strokeWidth="4.5" strokeLinecap="round" />
    <polygon points="176,24 154,34 166,46" fill="url(#tordoGold)" />
    <polygon points="32,168 22,162 26,176" fill="url(#tordoGold)" />

    {/* The Mockingjay Wings and Silhouette */}
    <path
      d="M 100 102 C 86 86 70 74 52 68 C 66 62 86 64 98 72 C 106 60 120 44 144 38 C 136 50 130 64 128 78 C 138 74 152 72 168 76 C 150 82 134 88 124 96 C 134 104 142 118 148 136 C 136 126 124 118 114 114 C 112 126 108 142 98 162 C 100 144 102 128 102 116 C 94 122 84 130 72 144 C 80 130 88 118 94 110 Z"
      fill="url(#tordoGold)"
    />
    {/* Head & Beak holding arrow */}
    <path
      d="M 112 82 C 114 74 120 70 128 72 C 136 74 142 70 148 64 C 142 74 134 80 128 84 C 120 86 114 84 112 82 Z"
      fill="url(#tordoGold)"
    />
  </svg>
)

// 🔥 Brilho lateral e faíscas ao redor do tabuleiro (Arena Catching Fire)
const BoardFlames: React.FC = () => (
  <div className="absolute -inset-2 sm:-inset-2.5 rounded-2xl pointer-events-none z-0 overflow-visible animate-flame-aura">
    {/* Borda lateral brilhante com efeito de brasa viva */}
    <div className="absolute inset-0 rounded-2xl border border-orange-500/50 ring-1 ring-amber-400/40" />

    {/* Faíscas e brasas flutuantes ao redor do tabuleiro */}
    <div className="absolute -bottom-1 left-6 w-2 h-2 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-ember-1" />
    <div className="absolute -bottom-2 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[0.5px] shadow-[0_0_8px_#ea580c] animate-ember-2" />
    <div className="absolute -bottom-1 right-1/4 w-2 h-2 rounded-full bg-yellow-300 blur-[0.5px] shadow-[0_0_8px_#fde047] animate-ember-3" />
    <div className="absolute -bottom-2 right-8 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-ember-1" />

    {/* Faíscas laterais */}
    <div className="absolute top-1/3 -left-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[0.5px] shadow-[0_0_8px_#ea580c] animate-ember-2" />
    <div className="absolute top-2/3 -left-1 w-2 h-2 rounded-full bg-amber-400 blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-ember-3" />
    <div className="absolute top-1/2 -right-1.5 w-2 h-2 rounded-full bg-amber-300 blur-[0.5px] shadow-[0_0_8px_#fde047] animate-ember-1" />
    <div className="absolute top-3/4 -right-1 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[0.5px] shadow-[0_0_8px_#ea580c] animate-ember-2" />

    {/* Faíscas no topo */}
    <div className="absolute -top-1 left-1/4 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[0.5px] shadow-[0_0_8px_#ea580c] animate-ember-2" />
    <div className="absolute -top-1.5 right-1/3 w-2 h-2 rounded-full bg-amber-300 blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-ember-3" />
  </div>
)

export const Board: React.FC<BoardProps> = ({
  chess,
  isFlipped,
  pieceTheme = 'duolingo',
  boardTheme = 'arena',
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

  const isClean = boardTheme === 'clean'

  return (
    <div
      className={`relative w-full max-w-[420px] aspect-square rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black transition-colors ${
        isClean
          ? 'bg-gradient-to-b from-[#1e2530] via-[#141a22] to-[#0c1015] border-2 border-slate-700/80 ring-1 ring-slate-600/40'
          : 'bg-gradient-to-b from-[#3a1d0c] via-[#211006] to-[#0f0602] border-2 border-amber-600/70 ring-1 ring-amber-500/40'
      }`}
    >
      {/* 🔥 Chamas em volta do tabuleiro (Teste de Efeito da Arena) */}
      {!isClean && <BoardFlames />}

      {/* Decorative Rivets */}
      <div className={`absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full shadow ${isClean ? 'bg-slate-400/60' : 'bg-gradient-to-br from-amber-400 to-yellow-600 ring-1 ring-amber-300/60'}`} />
      <div className={`absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full shadow ${isClean ? 'bg-slate-400/60' : 'bg-gradient-to-br from-amber-400 to-yellow-600 ring-1 ring-amber-300/60'}`} />
      <div className={`absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full shadow ${isClean ? 'bg-slate-400/60' : 'bg-gradient-to-br from-amber-400 to-yellow-600 ring-1 ring-amber-300/60'}`} />
      <div className={`absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full shadow ${isClean ? 'bg-slate-400/60' : 'bg-gradient-to-br from-amber-400 to-yellow-600 ring-1 ring-amber-300/60'}`} />

      {/* Board Inner Grid */}
      <div
        className={`relative w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 shadow-inner select-none touch-manipulation ${
          isClean ? 'border-[#334155]' : 'border-[#4a240f]'
        }`}
      >
        {/* Marca d'água elegante do Tordo no centro do tabuleiro */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <MockingjayWatermark />
        </div>

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

          // Square Palette (Hunger Games Arena or Clean Duolingo):
          const bgSquare = isClean
            ? isDark
              ? 'bg-[#ebf0f5]'
              : 'bg-[#ffffff]'
            : isDark
            ? 'bg-[#693a19]'
            : 'bg-[#ebdcb9]'

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
              {/* Last Move Destination: prominent high-contrast fiery flame border */}
              {isLastMoveTo && !isSelected && (
                <div className="absolute inset-0 border-[3px] border-orange-500 rounded-sm pointer-events-none z-15 shadow-[0_0_10px_rgba(249,115,22,0.85),inset_0_0_8px_rgba(249,115,22,0.45)]">
                  {/* Glowing fiery ember beacon in the top-right corner */}
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400 ring-1 ring-amber-100 shadow-md shadow-orange-500 animate-pulse" />
                </div>
              )}

              {/* Chess Piece with smooth sliding animation on destination square */}
              {piece && (
                <div
                  key={isLastMoveTo && lastMove ? `${lastMove.from}-${lastMove.to}` : sq}
                  style={slideStyle}
                  className={`w-full h-full p-0.5 flex items-center justify-center transition-transform ${
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
