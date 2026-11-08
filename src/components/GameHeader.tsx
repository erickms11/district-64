import React from 'react'
import type { Color, PieceSymbol, GameMode, CpuDifficulty } from '../types'
import { ChessPiece } from './ChessPiece'
import { RotateCw, Flag, Home, Clock } from 'lucide-react'

interface GameHeaderProps {
  mode: GameMode
  playerColor: Color
  currentTurn: Color
  isMyTurn: boolean
  roomCode?: string
  difficulty?: CpuDifficulty
  timeRemaining?: number
  capturedByOpponent: PieceSymbol[]
  capturedByMe: PieceSymbol[]
  onRotateBoard: () => void
  onSurrender: () => void
  onExit: () => void
}

function formatTime(seconds?: number): string | null {
  if (seconds === undefined || seconds === null) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  mode,
  playerColor,
  currentTurn,
  roomCode,
  difficulty,
  timeRemaining,
  capturedByOpponent,
  onRotateBoard,
  onSurrender,
  onExit
}) => {
  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w'

  const getOpponentTitle = () => {
    if (mode === 'cpu') {
      const diffLabel = difficulty === 'hard' ? 'Elite da Capital' : difficulty === 'medium' ? 'Pacificador' : 'Recruta'
      return `Sentinela (${diffLabel})`
    }
    if (mode === 'local') {
      return opponentColor === 'w' ? 'Tributo dos Distritos' : 'Tributo da Capital'
    }
    return opponentColor === 'w' ? 'Distrito 12 (Oponente)' : 'A Capital (Oponente)'
  }

  const formattedTime = formatTime(timeRemaining)

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-2 mb-1.5 select-none">
      {/* Top Bar: Controls & Room Code */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-[#0e1017] hover:bg-[#151824] text-amber-200/80 hover:text-white border border-amber-900/40 shadow"
          title="Sair para o Menu"
        >
          <Home className="w-4 h-4" />
        </button>

        {mode === 'online' && roomCode && (
          <div className="px-3 py-1 bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-amber-600/40 rounded-full text-[11px] font-mono font-bold text-amber-300 shadow">
            ARENA: {roomCode}
          </div>
        )}

        {mode === 'cpu' && (
          <div className="px-3 py-1 bg-[#0e1017] border border-amber-900/50 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-1.5 font-cinzel">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            PACIFICADOR CPU
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRotateBoard}
            className="p-2 rounded-xl bg-[#0e1017] hover:bg-[#151824] text-amber-200/80 hover:text-white border border-amber-900/40 shadow"
            title="Girar Tabuleiro"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={onSurrender}
            className="p-2 rounded-xl bg-[#0e1017] hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-amber-900/40 shadow"
            title="Render-se"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Opponent Card (Top) */}
      <div
        className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
          currentTurn === opponentColor
            ? 'bg-gradient-to-r from-amber-950/50 to-orange-950/40 border-amber-500 shadow-md shadow-amber-950/40'
            : 'bg-[#0e1017]/85 border-amber-950/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#08090e] flex items-center justify-center border border-amber-900/50 shadow-inner">
            <div className="w-6 h-6">
              <ChessPiece type="k" color={opponentColor} />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 font-cinzel">{getOpponentTitle()}</div>
            <div className="text-[10px] text-slate-400">
              {currentTurn === opponentColor ? (
                <span className="text-amber-400 font-semibold animate-pulse">Planejando ataque...</span>
              ) : (
                'Aguardando seu lance'
              )}
            </div>
          </div>
        </div>

        {/* Right side: Timer & Captured pieces */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 overflow-x-auto max-w-[100px]">
            {capturedByOpponent.map((p, idx) => (
              <div key={idx} className="w-4 h-4 opacity-75">
                <ChessPiece type={p} color={playerColor} />
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
