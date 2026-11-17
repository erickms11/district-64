import React from 'react'
import type { PieceSymbol, Color, PieceTheme } from '../types'
import { ChessPiece } from './ChessPiece'

interface PromotionModalProps {
  color: Color
  pieceTheme?: PieceTheme
  onSelect: (piece: PieceSymbol) => void
  onCancel: () => void
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, pieceTheme = 'duolingo', onSelect, onCancel }) => {
  const pieces: PieceSymbol[] = ['q', 'r', 'b', 'n']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center">
        <h3 className="text-lg font-bold text-amber-400 font-cinzel mb-2">Promoção de Peão</h3>
        <p className="text-xs text-slate-400 mb-4">Escolha a nova patente do seu tributo:</p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className="p-3 bg-slate-800 hover:bg-amber-950/60 active:scale-95 border border-slate-700 hover:border-amber-500/70 rounded-xl transition flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10">
                <ChessPiece type={piece} color={color} theme={pieceTheme} />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
