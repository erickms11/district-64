import React from 'react'
import type { Color, PieceSymbol, GameMode } from '../types'
import { ChessPiece } from './ChessPiece'
import { Clock } from 'lucide-react'

interface GameFooterProps {
  mode: GameMode
  playerColor: Color
  currentTurn?: Color
  isMyTurn: boolean
  inCheck: boolean
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
  inCheck,
  timeRemaining,
  capturedByMe
}) => {
  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w'

  const getMyTitle = () => {
    if (mode === 'local') {
      return playerColor === 'w' ? 'Tributo das Brancas' : 'Tributo das Pretas'
    }
    return playerColor === 'w' ? 'Distrito 12 (Você)' : 'A Capital (Você)'
  }

  const formattedTime = formatTime(timeRemaining)

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-2 mt-1 select-none">
      {/* Player Card (Bottom) */}
      <div
        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
          isMyTurn
            ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/30'
            : 'bg-slate-900/60 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
            <div className="w-5 h-5">
              <ChessPiece type="k" color={playerColor} />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">{getMyTitle()}</div>
            <div className="text-[10px]">
              {isMyTurn ? (
                <span className="text-amber-400 font-bold tracking-wide animate-pulse">
                  ⚔️ SEU LANCE
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
                ? 'bg-red-950/80 border-red-500/80 text-red-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}>
              <Clock className="w-3 h-3 text-slate-400" />
              {formattedTime}
            </div>
          )}
        </div>
      </div>

      {/* Check Alert Bar */}
      {inCheck && (
        <div className="w-full py-1.5 px-3 bg-red-950/80 border border-red-600/70 rounded-xl text-center text-xs font-bold text-red-200 animate-pulse tracking-wide shadow-md">
          ⚠️ O REI ESTÁ EM XEQUE!
        </div>
      )}
    </div>
  )
}
