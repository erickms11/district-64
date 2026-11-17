import React, { useState } from 'react'
import type { Move } from 'chess.js'
import { ScrollText, X, Copy, Check } from 'lucide-react'

interface MoveHistoryProps {
  moves?: Move[]
  history?: string[]
  pgn?: string
}

const PIECE_NAMES: Record<string, string> = {
  p: 'Peão',
  n: 'Cavalo',
  b: 'Bispo',
  r: 'Torre',
  q: 'Dama',
  k: 'Rei'
}

export function formatMovePt(move: Move): string {
  const piece = PIECE_NAMES[move.piece] || 'Peça'
  if (move.flags.includes('k')) return 'Roque menor (Ala do Rei)'
  if (move.flags.includes('q')) return 'Roque maior (Ala da Dama)'
  const promo = move.promotion ? ` (promove a ${PIECE_NAMES[move.promotion] || 'Dama'})` : ''
  const check = move.san.includes('#') ? ' • Xeque-Mate!' : move.san.includes('+') ? ' • Xeque!' : ''

  if (move.captured) {
    const captured = PIECE_NAMES[move.captured] || 'peça'
    return `${piece} de ${move.from} captura ${captured} em ${move.to}${promo}${check}`
  }
  return `${piece} de ${move.from} para ${move.to}${promo}${check}`
}

export function formatMoveCompact(move: Move): string {
  const piece = PIECE_NAMES[move.piece] || 'Peça'
  if (move.flags.includes('k')) return 'Roque menor'
  if (move.flags.includes('q')) return 'Roque maior'
  const promo = move.promotion ? `=${PIECE_NAMES[move.promotion] || 'D'}` : ''
  const check = move.san.includes('#') ? '#' : move.san.includes('+') ? '+' : ''
  return `${piece} ${move.from} ➜ ${move.to}${promo}${check}`
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves = [], history = [], pgn = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Pair up moves (White move, Black move)
  const movePairs: { num: number; white: Move; black?: Move }[] = []
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    })
  }

  // Last move played
  const lastMove = moves.length > 0 ? moves[moves.length - 1] : null

  const handleCopyPgn = () => {
    const textToCopy = pgn || history.join(' ')
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Mini Inline Ribbon under the board */}
      <div className="w-full max-w-[420px] flex items-center justify-between px-2.5 py-1.5 bg-[#0e1017]/90 border border-amber-900/40 rounded-xl my-1 text-xs shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-hidden text-slate-300">
          {lastMove ? (
            <div className="flex items-center gap-1.5 text-xs truncate">
              <span className="text-[10px] uppercase font-bold text-amber-400 font-cinzel tracking-wider">
                Último:
              </span>
              <span className="font-medium text-amber-200/90 truncate">
                {formatMovePt(lastMove)}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic text-[11px]">Início da batalha no Distrito 64</span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-100 py-1 px-2.5 bg-[#171a26] hover:bg-[#202538] rounded-lg border border-amber-900/40 transition shrink-0 ml-2"
        >
          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
          <span>Histórico ({moves.length})</span>
        </button>
      </div>

      {/* Expanded Modal with full Portuguese descriptive move list */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="bg-gradient-to-b from-[#141724] via-[#0c0e17] to-[#06070a] border-2 border-amber-600/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/40 mb-3">
              <h3 className="text-sm font-bold font-cinzel text-amber-300 flex items-center gap-2 tracking-wider">
                <ScrollText className="w-4 h-4 text-amber-400" />
                Histórico de Lances da Arena
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Move list with detailed Portuguese descriptions */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 text-xs">
              {movePairs.length === 0 ? (
                <div className="text-slate-500 text-center py-8">Nenhum lance efetuado ainda.</div>
              ) : (
                movePairs.map((pair) => (
                  <div
                    key={pair.num}
                    className="flex flex-col gap-1 p-2 rounded-xl bg-[#090b12] border border-amber-950/40 hover:border-amber-600/30 transition"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-6 font-bold text-amber-500/90 font-cinzel pt-0.5 text-[11px]">
                        {pair.num}.
                      </span>
                      <div className="flex-1 flex flex-col gap-1 text-[11px]">
                        {/* Lance do Distrito 12 / Katniss (Vermelho) */}
                        <div className="flex items-center gap-1.5 text-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-500 border border-red-300 shadow-sm shrink-0" />
                          <span className="font-medium">{formatMovePt(pair.white)}</span>
                        </div>
                        {/* Lance dos Pacificadores / Capital (Branco) */}
                        {pair.black && (
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-400 shadow-sm shrink-0" />
                            <span className="font-medium">{formatMovePt(pair.black)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {moves.length > 0 && (
              <div className="pt-3 border-t border-amber-900/40 mt-2 flex justify-end">
                <button
                  onClick={handleCopyPgn}
                  className="py-1.5 px-3 bg-[#171a26] hover:bg-[#22273a] active:scale-95 border border-amber-900/40 rounded-xl text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
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
