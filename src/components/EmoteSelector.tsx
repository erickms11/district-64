import React, { useState } from 'react'
import type { PeerEmote } from '../types'
import { MessageSquare, X } from 'lucide-react'

interface EmoteSelectorProps {
  onSendEmote: (emote: PeerEmote) => void
}

export const ARENA_EMOTES: PeerEmote[] = [
  { icon: '🏹', label: 'Que a sorte esteja a seu favor!' },
  { icon: '🕊️', label: 'O Tordo vive!' },
  { icon: '🔥', label: 'A garota em chamas!' },
  { icon: '🌹', label: 'A Capital sempre vence.' },
  { icon: '⚔️', label: 'Excelente lance!' },
  { icon: '💥', label: 'O canhão disparou!' },
  { icon: '👑', label: 'Cuidado com o Rei...' },
  { icon: '🤝', label: 'Boa batalha, tributo!' }
]

export const EmoteSelector: React.FC<EmoteSelectorProps> = ({ onSendEmote }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (emote: PeerEmote) => {
    onSendEmote(emote)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-xl bg-[#0e1017] hover:bg-[#151824] text-amber-300 border border-amber-900/40 shadow flex items-center justify-center transition"
        title="Enviar Reação da Arena"
      >
        <MessageSquare className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 bg-[#0e1017]/95 border-2 border-amber-500/70 rounded-2xl p-2.5 shadow-2xl shadow-black max-w-[260px] w-64 backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-cinzel">
              Reações da Arena
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {ARENA_EMOTES.map((emote, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(emote)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#08090e] hover:bg-[#161a29] border border-amber-950 hover:border-amber-500/50 text-left transition active:scale-95"
              >
                <span className="text-base">{emote.icon}</span>
                <span className="text-[10px] text-slate-200 line-clamp-1 font-medium">
                  {emote.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
