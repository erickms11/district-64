import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { Color } from '../types'
import { soundManager } from '../utils/audio'
import { Trophy, Skull, RotateCcw, Home, Timer } from 'lucide-react'

interface GameOverModalProps {
  winner: Color | 'draw' | null
  reason: string | null
  playerColor: Color
  isOnline: boolean
  onRestart: () => void
  onExit: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  reason,
  playerColor,
  isOnline,
  onRestart,
  onExit
}) => {
  const isWinner = isOnline ? winner === playerColor : winner !== null
  const isDraw = winner === 'draw'
  const isTimeout = reason === 'timeout'

  useEffect(() => {
    soundManager.playFallenCannon()
    if (isWinner && !isDraw) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ef4444']
      })
    }
  }, [isWinner, isDraw])

  const getTitle = () => {
    if (isDraw) return 'Tregua na Arena'
    if (isOnline) {
      return isWinner ? 'Sobrevivente da Arena!' : 'Tributo Caído'
    }
    return winner === 'w' ? 'Vitória das Brancas (Distritos)' : 'Vitória das Pretas (Capital)'
  }

  const getSubtitle = () => {
    if (reason === 'checkmate') return 'Xeque-mate definitivo nos 64 distritos.'
    if (reason === 'timeout') return 'O tempo da ampulheta esgotou!'
    if (reason === 'stalemate') return 'Empate por afogamento (Stalemate).'
    if (reason === 'surrender') return 'Rendição aceita na arena.'
    return 'Jogo finalizado.'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-amber-950/40">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            {isDraw ? (
              <span className="text-2xl font-black">½</span>
            ) : isTimeout && !isWinner ? (
              <Timer className="w-8 h-8 text-amber-500" />
            ) : isWinner ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <Skull className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-extrabold font-cinzel text-amber-400 mb-1">{getTitle()}</h2>
        <p className="text-xs text-slate-400 mb-6">{getSubtitle()}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-98 rounded-xl font-bold text-white shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novamente
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 active:scale-98 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            Voltar ao Menu Principal
          </button>
        </div>
      </div>
    </div>
  )
}
