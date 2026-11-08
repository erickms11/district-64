import React from 'react'
import type { Color, PieceSymbol, GameMode, CpuDifficulty } from '../types'
import { ChessPiece } from './ChessPiece'
import { Volume2, VolumeX, RotateCw, Flag, Home, Clock } from 'lucide-react'

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
  isMuted: boolean
  onToggleMute: () => void
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
  isMuted,
  onToggleMute,
  onRotateBoard,
  onSurrender,
  onExit
}) => {
  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w'

  const getOpponentTitle = () => {
    if (mode === 'cpu') {
      const diffLabel = difficulty === 'hard' ? 'Elite' : difficulty === 'medium' ? 'Médio' : 'Fácil'
      return `Sentinela da Capital (${diffLabel})`
    }
    if (mode === 'local') {
      return opponentColor === 'w' ? 'Tributo das Brancas' : 'Tributo das Pretas'
    }
    return opponentColor === 'w' ? 'Distrito das Brancas' : 'Capital das Pretas'
  }

  const formattedTime = formatTime(timeRemaining)

  return (
    <div className="w-full max-w-[420px] flex flex-col gap-2 mb-2 select-none">
      {/* Top Bar: Controls & Room Code */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
          title="Sair para o Menu"
        >
          <Home className="w-4 h-4" />
        </button>

        {mode === 'online' && roomCode && (
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-600/30 rounded-full text-[11px] font-mono font-bold text-amber-300">
            ARENA: {roomCode}
          </div>
        )}

        {mode === 'cpu' && (
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            IA OFFLINE
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRotateBoard}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            title="Girar Tabuleiro"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            title={isMuted ? 'Ativar Som' : 'Desativar Som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={onSurrender}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800"
            title="Render-se"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Opponent Card (Top) */}
      <div
        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
          currentTurn === opponentColor
            ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/20'
            : 'bg-slate-900/60 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
            <div className="w-5 h-5">
              <ChessPiece type="k" color={opponentColor} />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">{getOpponentTitle()}</div>
            <div className="text-[10px] text-slate-400">
              {currentTurn === opponentColor ? (
                <span className="text-amber-400 font-semibold animate-pulse">Calculando lance...</span>
              ) : (
                'Aguardando sua jogada'
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
                ? 'bg-red-950/80 border-red-500/80 text-red-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}>
              <Clock className="w-3 h-3 text-slate-400" />
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
