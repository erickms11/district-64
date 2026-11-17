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
  ratingChange?: { delta: number; newRating: number } | null
  onRestart: () => void
  onExit: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  reason,
  playerColor,
  isOnline,
  ratingChange,
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
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#fbbf24', '#dc2626']
      })
    }
  }, [isWinner, isDraw])

  const getTitle = () => {
    if (isDraw) return 'Trégua na Arena'
    if (isOnline) {
      return isWinner ? 'Vitorioso dos Jogos!' : 'Tributo Caído'
    }
    return winner === 'w' ? 'Vitória do Distrito 12' : 'A Capital Prevaleceu'
  }

  const getSubtitle = () => {
    if (reason === 'checkmate') return 'Xeque-mate definitivo nos 64 distritos.'
    if (reason === 'timeout') return 'O tempo da ampulheta esgotou na arena!'
    if (reason === 'stalemate') return 'Empate por afogamento de tropas.'
    if (reason === 'surrender') return 'Rendição aceita pelos idealizadores dos jogos.'
    return 'Fim do combate.'
  }

  const getQuote = () => {
    if (isWinner && !isDraw) return '"O fogo está pegando. E se nós queimarmos, vocês queimarão conosco!"'
    if (!isWinner && !isDraw) return '"O canhão disparou. A arena não perdoa hesitações."'
    return '"Que a sorte esteja sempre a seu favor."'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#141724] via-[#0c0e17] to-[#06070a] border-2 border-amber-500/70 rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl shadow-amber-950/70 ring-1 ring-amber-400/30">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-500/30 to-amber-400/20 border-2 border-amber-500/60 flex items-center justify-center shadow-inner">
            {isDraw ? (
              <span className="text-2xl font-black font-cinzel text-amber-300">½</span>
            ) : isTimeout && !isWinner ? (
              <Timer className="w-8 h-8 text-orange-400" />
            ) : isWinner ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <Skull className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>

        {reason === 'checkmate' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/80 text-[11px] font-black font-cinzel text-red-300 tracking-wider mb-2 shadow-md shadow-red-950/50">
            <span>⚔️ Xeque-Mate!</span>
          </div>
        )}

        <h2 className="text-2xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 mb-1">
          {getTitle()}
        </h2>
        <p className="text-xs text-slate-300 mb-1">{getSubtitle()}</p>

        {/* Variação de Rating ELO */}
        {ratingChange && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#08090e] border border-amber-900/50 rounded-xl my-2 text-xs font-mono shadow-sm">
            <span className="text-slate-400 font-cinzel text-[10px] uppercase font-bold tracking-wider">
              Rating ELO:
            </span>
            <span
              className={`font-black font-mono ${
                ratingChange.delta > 0
                  ? 'text-emerald-400'
                  : ratingChange.delta < 0
                  ? 'text-red-400'
                  : 'text-slate-300'
              }`}
            >
              {ratingChange.delta > 0 ? `+${ratingChange.delta}` : ratingChange.delta}
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-bold text-amber-300 font-mono">
              {ratingChange.newRating} ELO
            </span>
          </div>
        )}

        {/* Thematic Quote */}
        <div className="my-4 py-2 px-3 bg-[#07080d] rounded-xl border border-amber-900/40 text-[11px] italic text-amber-200/80 font-cinzel">
          {getQuote()}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 active:scale-98 rounded-xl font-bold text-white shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition font-cinzel text-xs tracking-wider border border-amber-400/40"
          >
            <RotateCcw className="w-4 h-4" />
            Nova Batalha na Arena
          </button>

          <button
            onClick={onExit}
            className="w-full py-2.5 px-4 bg-[#0e1017] hover:bg-[#151926] active:scale-98 rounded-xl text-xs font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-2 transition font-cinzel"
          >
            <Home className="w-4 h-4 text-slate-400" />
            Retornar ao Menu
          </button>
        </div>
      </div>
    </div>
  )
}
