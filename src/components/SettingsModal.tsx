import React from 'react'
import type { CpuDifficulty, TimeControl, Color, PieceTheme, BoardTheme } from '../types'
import { X, Clock, Bot, Trash2, Palette, Sparkles } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  timeControl: TimeControl
  onSelectTimeControl: (tc: TimeControl) => void
  cpuDifficulty: CpuDifficulty
  onSelectCpuDifficulty: (diff: CpuDifficulty) => void
  cpuPlayerColor: Color
  onSelectCpuPlayerColor: (color: Color) => void
  pieceTheme: PieceTheme
  onSelectPieceTheme: (theme: PieceTheme) => void
  boardTheme: BoardTheme
  onSelectBoardTheme: (theme: BoardTheme) => void
  onResetStats: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  timeControl,
  onSelectTimeControl,
  cpuDifficulty,
  onSelectCpuDifficulty,
  cpuPlayerColor,
  onSelectCpuPlayerColor,
  pieceTheme,
  onSelectPieceTheme,
  boardTheme,
  onSelectBoardTheme,
  onResetStats
}) => {
  if (!isOpen) return null

  const timeControlOptions: { label: string; value: TimeControl }[] = [
    { label: '♾️ Ilimitado', value: 0 },
    { label: '⚡ 3 min', value: 180 },
    { label: '🔥 5 min', value: 300 },
    { label: '⏱️ 10 min', value: 600 }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-[#141724] via-[#0c0e17] to-[#06070a] border-2 border-amber-600/50 rounded-3xl p-5 sm:p-6 max-w-xs w-full shadow-2xl shadow-amber-950/70 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
          <h3 className="text-sm font-bold font-cinzel text-amber-300 tracking-wider">
            Ajustes da Arena
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Ajuste de Tempo (Ampulheta) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5 font-cinzel">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Ampulheta (Tempo de Partida)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {timeControlOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelectTimeControl(opt.value)}
                className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition ${
                  timeControl === opt.value
                    ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm'
                    : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Dificuldade da CPU */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5 font-cinzel">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            Nível da CPU (A Capital)
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['easy', 'medium', 'hard', 'expert'] as CpuDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectCpuDifficulty(diff)}
                className={`py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border transition ${
                  cpuDifficulty === diff
                    ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm ring-1 ring-amber-400/50'
                    : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'easy' ? 'Recruta' : diff === 'medium' ? 'Pacificador' : diff === 'hard' ? 'Elite' : 'Expert'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Lado das Peças contra a CPU */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-amber-200/90 font-cinzel">
            Sua Facção contra a CPU
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSelectCpuPlayerColor('w')}
              className={`py-2 text-[11px] font-bold rounded-xl border transition ${
                cpuPlayerColor === 'w'
                  ? 'bg-gradient-to-r from-red-600/40 to-amber-600/40 border-red-400 text-red-200 shadow-sm ring-1 ring-red-500/50'
                  : 'bg-[#08090e] border-slate-800 text-slate-400'
              }`}
            >
              🔥 Distrito (Vermelho)
            </button>
            <button
              onClick={() => onSelectCpuPlayerColor('b')}
              className={`py-2 text-[11px] font-bold rounded-xl border transition ${
                cpuPlayerColor === 'b'
                  ? 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-slate-300 text-slate-100 shadow-sm ring-1 ring-slate-400/50'
                  : 'bg-[#08090e] border-slate-800 text-slate-400'
              }`}
            >
              🛡️ Pacificadores (Branco)
            </button>
          </div>
        </div>

        {/* 4. Estilo Visual das Peças */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5 font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Estilo das Peças
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSelectPieceTheme('duolingo')}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition ${
                pieceTheme === 'duolingo'
                  ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              🦉 Duolingo (Moderno)
            </button>
            <button
              onClick={() => onSelectPieceTheme('staunton')}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition ${
                pieceTheme === 'staunton'
                  ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ♟️ Staunton Clássico
            </button>
          </div>
        </div>

        {/* 5. Estilo do Tabuleiro */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5 font-cinzel">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Cores do Tabuleiro
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSelectBoardTheme('clean')}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition ${
                boardTheme === 'clean'
                  ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚪ Duolingo Clean
            </button>
            <button
              onClick={() => onSelectBoardTheme('arena')}
              className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition ${
                boardTheme === 'arena'
                  ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-[#08090e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              🪵 Arena Hunger Games
            </button>
          </div>
        </div>

        {/* 6. Zerar Estatísticas */}
        <div className="pt-2 border-t border-amber-900/40">
          <button
            onClick={() => {
              if (window.confirm('Deseja realmente zerar todo o seu registro de vitórias e derrotas?')) {
                onResetStats()
                onClose()
              }
            }}
            className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 rounded-xl text-[11px] font-semibold text-red-300 flex items-center justify-center gap-1.5 transition font-cinzel"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Zerar Registro do Tributo
          </button>
        </div>
      </div>
    </div>
  )
}
