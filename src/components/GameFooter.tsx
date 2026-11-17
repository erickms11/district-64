import React from 'react'
import type { Color, PieceSymbol, GameMode } from '../types'
import { ChessPiece } from './ChessPiece'
import { Clock } from 'lucide-react'

interface GameFooterProps {
  mode: GameMode
  playerColor: Color
  currentTurn?: Color
  isMyTurn: boolean
  inCheck?: boolean
  playerName?: string
  playerRating?: number
  timeRemaining?: number
  capturedByMe: PieceSymbol[]
}

function formatTime(seconds?: number): string | null {
  if (seconds === undefined || seconds === null) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const GameFooter: React.FC<GameFooterProps> = ({
  mode,
  playerColor,
  isMyTurn,
  playerName,
  playerRating,
  timeRemaining,
  capturedByMe
}) => {
  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w'

  const getMyTitle = () => {
    if (mode === 'local') {
      return playerColor === 'w' ? 'Distrito 12 (Vermelho)' : 'Pacificadores (Branco)'
    }
    if (playerName) {
      return `${playerName} (${playerRating || 1200} ELO)`
    }
    return playerColor === 'w' ? 'Distrito 12 - Katniss (Você)' : 'Pacificadores da Capital (Você)'
  }

  const formattedTime = formatTime(timeRemaining)

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-2 mt-1 select-none">
      {/* Player Card (Bottom) */}
      <div
        className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
          isMyTurn
            ? 'bg-gradient-to-r from-amber-950/60 to-orange-950/50 border-amber-500 shadow-lg shadow-amber-950/40'
            : 'bg-[#0e1017]/85 border-amber-950/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#08090e] flex items-center justify-center border border-amber-900/50 shadow-inner">
            <div className="w-6 h-6">
              <ChessPiece type="k" color={playerColor} />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 font-cinzel">{getMyTitle()}</div>
            <div className="text-[10px]">
              {isMyTurn ? (
                <span className="text-amber-300 font-bold tracking-wide animate-pulse flex items-center gap-1 font-cinzel">
                  🏹 SEU LANCE
                </span>
              ) : (
                <span className="text-slate-500">Aguardando oponente...</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Timer & Captured Pieces */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 overflow-x-auto max-w-[100px]">
            {capturedByMe.map((p, idx) => (
              <div key={idx} className="w-4 h-4 opacity-80">
                <ChessPiece type={p} color={opponentColor} />
              </div>
            ))}
          </div>

          {formattedTime && (
            <div className={`px-2 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1 border ${
              (timeRemaining ?? 0) <= 30
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-md shadow-red-950/50'
                : 'bg-[#08090e] border-amber-900/50 text-amber-200'
            }`}>
              <Clock className="w-3 h-3 text-amber-400" />
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
