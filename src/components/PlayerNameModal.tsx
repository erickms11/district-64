import React, { useState } from 'react'
import { DistrictSeal } from './DistrictSeal'
import { Sparkles, ArrowRight } from 'lucide-react'

interface PlayerNameModalProps {
  initialName?: string
  onSave: (name: string) => void
}

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  initialName = '',
  onSave
}) => {
  const [name, setName] = useState(initialName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length > 0) {
      onSave(trimmed)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-[#141724] via-[#0c0e17] to-[#06070a] border-2 border-amber-500/70 rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl shadow-amber-950/80 ring-1 ring-amber-400/30">
        {/* District Seal */}
        <div className="flex justify-center mb-3">
          <DistrictSeal className="w-18 h-18 sm:w-20 sm:h-20" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-[10px] uppercase font-mono font-bold text-amber-400 tracking-widest mb-2">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Panem • Convocação da Arena
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600 mb-1">
          Registro de Tributo
        </h2>

        <p className="text-xs text-amber-200/75 italic font-cinzel mb-5 leading-relaxed">
          Informe seu nome ou apelido para ingressar na Arena do Distrito 64 e iniciar sua contagem de Rating ELO.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              autoFocus
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome ou apelido (Ex: Katniss)"
              className="w-full bg-[#08090e] border-2 border-amber-700/60 rounded-xl px-4 py-3 text-center font-cinzel font-bold text-sm sm:text-base text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 shadow-inner tracking-wide"
            />
          </div>

          <button
            type="submit"
            disabled={name.trim().length === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 active:scale-98 disabled:opacity-40 disabled:pointer-events-none rounded-xl font-bold font-cinzel text-sm text-white shadow-lg shadow-amber-950/60 border border-amber-400/40 flex items-center justify-center gap-2 transition"
          >
            <span>Entrar na Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 font-cinzel mt-4">
          Rating inicial: <strong>1200 ELO</strong> • Regras FIDE
        </p>
      </div>
    </div>
  )
}

