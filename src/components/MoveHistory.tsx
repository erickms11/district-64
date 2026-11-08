import React, { useState } from 'react'
import { ScrollText, X, Copy, Check } from 'lucide-react'

interface MoveHistoryProps {
  history: string[]
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Group moves into pairs (White move, Black move)
  const movePairs: { num: number; white: string; black?: string }[] = []
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1]
    })
  }

  // Get last 2 moves for inline preview
  const lastPair = movePairs[movePairs.length - 1]

  const handleCopyPgn = () => {
    const pgn = movePairs.map((p) => `${p.num}. ${p.white}${p.black ? ' ' + p.black : ''}`).join(' ')
    navigator.clipboard.writeText(pgn)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Mini Inline Ribbon */}
      <div className="w-full max-w-[420px] flex items-center justify-between px-2 py-1 bg-slate-900/60 border border-slate-800/80 rounded-xl my-1 text-xs">
        <div className="flex items-center gap-2 overflow-hidden text-slate-400">
          <span className="text-[10px] uppercase font-bold text-amber-500/80 tracking-wider">Lances:</span>
          {lastPair ? (
            <span className="font-mono text-slate-200 truncate">
              {lastPair.num}. {lastPair.white} {lastPair.black ? lastPair.black : ''}
            </span>
          ) : (
            <span className="text-slate-600 italic">Início da partida</span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 py-0.5 px-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition"
        >
          <ScrollText className="w-3 h-3" />
          Histórico ({history.length})
        </button>
      </div>

      {/* Expanded Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl flex flex-col max-h-[75vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-bold font-cinzel text-amber-400 flex items-center gap-2">
                <ScrollText className="w-4 h-4" />
                Histórico de Lances da Arena
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Move list */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 text-xs font-mono">
              {movePairs.length === 0 ? (
                <div className="text-slate-500 text-center py-8">Nenhum lance efetuado ainda.</div>
              ) : (
                movePairs.map((pair) => (
                  <div
                    key={pair.num}
                    className="flex items-center py-1 px-2 rounded hover:bg-slate-800/50 odd:bg-slate-950/40"
                  >
                    <span className="w-8 text-slate-500 font-bold">{pair.num}.</span>
                    <span className="flex-1 text-slate-200">{pair.white}</span>
                    <span className="flex-1 text-amber-300/90">{pair.black || '—'}</span>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {movePairs.length > 0 && (
              <div className="pt-3 border-t border-slate-800 mt-2 flex justify-end">
                <button
                  onClick={handleCopyPgn}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'PGN Copiado!' : 'Copiar PGN'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

