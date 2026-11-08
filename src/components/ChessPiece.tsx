import React, { useState } from 'react'
import type { PieceSymbol, Color } from '../types'

interface ChessPieceProps {
  type: PieceSymbol
  color: Color
  className?: string
}

// 🎯 REGISTRO DE PEÇAS PERSONALIZADAS DO DISTRICT 64
// Quando quiser adicionar modelos/artes customizadas, basta mapear aqui:
export const CUSTOM_PIECES: Record<string, string> = {
  // 'w_k': '/pieces/katniss_king.png',
  // 'b_k': '/pieces/president_snow.png',
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w'
  const pieceKey = `${color}_${type}`
  const customImage = CUSTOM_PIECES[pieceKey]
  const [imgError, setImgError] = useState(false)

  // Se houver uma arte personalizada (como a Katniss), renderiza o token customizado
  if (customImage && !imgError) {
    return (
      <div className={`relative flex items-center justify-center p-0.5 ${className}`}>
        <div
          className={`relative w-full h-full rounded-full overflow-hidden border-2 transition-transform duration-150 ${
            isWhite
              ? 'border-amber-400 shadow-lg shadow-amber-950/60 ring-1 ring-amber-300/50'
              : 'border-red-600 shadow-lg shadow-black/80 ring-1 ring-red-500/50'
          }`}
          style={{
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))',
          }}
        >
          <img
            src={customImage}
            alt={`${color} ${type}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
          {/* Indicador sutil de patente (coroa dourada para Rei) */}
          {type === 'k' && (
            <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[10px] leading-none drop-shadow-md">👑</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Cores do conjunto vetorial clássico Staunton do District 64
  const fill = isWhite ? '#ffffff' : '#1e2530'
  const stroke = isWhite ? '#1e293b' : '#f8fafc'
  const gold = '#f59e0b'

  const filterStyle = isWhite
    ? 'drop-shadow(0px 2px 3px rgba(0,0,0,0.4))'
    : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))'

  const renderShape = () => {
    switch (type) {
      case 'k': // REI (King) - Cruz grande e marcante, coroa imperial imponente
        return (
          <g>
            {/* Base sólida do Rei */}
            <path
              d="M11 41 h26 c1.5 0 2 1.5 2 2.5 H9 c0-1 0.5-2.5 2-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M13 37 h22 c1 0 1.5 1.5 1.5 2.5 H11.5 c0-1 0.5-2.5 1.5-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />

            {/* Corpo e Manto Real */}
            <path
              d="M14 36.5 C15 28 17 25 19 22 C17 21 16 19 16 16.5 C16 13 18.5 11 24 11 C29.5 11 32 13 32 16.5 C32 19 31 21 29 22 C31 25 33 28 34 36.5 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />

            {/* Ornamento do Peito */}
            <path
              d="M19 23 C22 25 26 25 29 23"
              stroke={stroke}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M17 31 C21 33 27 33 31 31"
              stroke={stroke}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* CRUZ MAJESTOSA DO REI */}
            <g transform="translate(0, -1)">
              <circle cx="24" cy="6.5" r="4.5" fill={gold} opacity="0.3" />
              <rect
                x="22.2"
                y="2"
                width="3.6"
                height="9"
                rx="0.8"
                fill={isWhite ? gold : fill}
                stroke={stroke}
                strokeWidth="1.2"
              />
              <rect
                x="19.5"
                y="4.2"
                width="9"
                height="3.6"
                rx="0.8"
                fill={isWhite ? gold : fill}
                stroke={stroke}
                strokeWidth="1.2"
              />
              <circle cx="24" cy="6" r="1.2" fill={isWhite ? '#ffffff' : gold} />
            </g>
          </g>
        )

      case 'q': // RAINHA (Queen) - Coroa elegante com 5 pontas e pérolas
        return (
          <g>
            <path
              d="M12 41 h24 c1.2 0 1.8 1.5 1.8 2.5 H10.2 c0-1 0.6-2.5 1.8-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M13.5 37.5 h21 c1 0 1.5 1.2 1.5 2 H12 c0-0.8 0.5-2 1.5-2 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14.5 37 C16 30 18 27 19.5 24 C17 23 15 20 15 17.5 L19.5 22 L24 14.5 L28.5 22 L33 17.5 C33 20 31 23 28.5 24 C30 27 32 30 33.5 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="15" cy="17" r="2" fill={gold} stroke={stroke} strokeWidth="1" />
            <circle cx="19.5" cy="21" r="1.7" fill={gold} stroke={stroke} strokeWidth="1" />
            <circle cx="24" cy="13.5" r="2.3" fill={gold} stroke={stroke} strokeWidth="1" />
            <circle cx="28.5" cy="21" r="1.7" fill={gold} stroke={stroke} strokeWidth="1" />
            <circle cx="33" cy="17" r="2" fill={gold} stroke={stroke} strokeWidth="1" />
          </g>
        )

      case 'b': // BISPO (Bishop) - Mitra eclesiástica com fenda e cruz de topo
        return (
          <g>
            <path
              d="M13 41 h22 c1 0 1.8 1.5 1.8 2.5 H11.2 c0-1 0.8-2.5 1.8-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14.5 37.5 h19 c0.8 0 1.2 1.2 1.2 2 H13.3 c0-0.8 0.4-2 1.2-2 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M15 37 C16 30 17 26 24 19 C31 26 32 30 33 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M17.5 26 C16.5 20 19 14 24 11 C29 14 31.5 20 30.5 26 C29 30 19 30 17.5 26 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M21 16 L27 22"
              stroke={stroke}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="24" cy="9.5" r="2" fill={gold} stroke={stroke} strokeWidth="1" />
          </g>
        )

      case 'n': // CAVALO (Knight) - Cabeça e crina estilizada de caçador
        return (
          <g>
            <path
              d="M13 41 h22 c1 0 1.8 1.5 1.8 2.5 H11.2 c0-1 0.8-2.5 1.8-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14.5 37.5 h19 c0.8 0 1.2 1.2 1.2 2 H13.3 c0-0.8 0.4-2 1.2-2 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M15 37 C15 33 16 30 19 28 C17 27 15 24 15 21 C15 16 19 12 25 11 C28 11 31 12.5 32 15 C33 17 32 19 30 20 C29 20.5 28 20.5 27 21 C27 23 29 24 31 26 C33 28 33 32 33 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M15 21 C14 23 16 26 19 26.5 L19 28"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="23" cy="16.5" r="1.5" fill={gold} />
            <path
              d="M27 13 C26 15 27 18 29 19"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        )

      case 'r': // TORRE (Rook) - Castelo de muralha com ameias bem definidas
        return (
          <g>
            <path
              d="M12 41 h24 c1.2 0 1.8 1.5 1.8 2.5 H10.2 c0-1 0.6-2.5 1.8-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M13.5 37.5 h21 c1 0 1.5 1.2 1.5 2 H12 c0-0.8 0.5-2 1.5-2 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M16 37 L17.5 22 H30.5 L32 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14.5 19.5 h19 v2.5 h-19 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M14 13.5 h4.5 v3 h3 v-3 h5 v3 h3 v-3 h4.5 v6 h-20 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <rect x="22.5" y="26" width="3" height="5" rx="1.5" fill={stroke} opacity="0.7" />
          </g>
        )

      case 'p': // PEÃO (Pawn) - Esfera compacta no topo e gola arredondada
        return (
          <g>
            <path
              d="M14 41 h20 c1 0 1.5 1.5 1.5 2.5 H12.5 c0-1 0.5-2.5 1.5-2.5 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M16 37.5 h16 c0.8 0 1.2 1.2 1.2 2 H14.8 c0-0.8 0.4-2 1.2-2 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M17.5 37 C18.5 30 20 27 21 24 H27 C28 27 29.5 30 30.5 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <ellipse cx="24" cy="23.5" rx="4.5" ry="1.5" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle
              cx="24"
              cy="16"
              r="5.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="22.5" cy="14.5" r="1.5" fill={gold} opacity="0.6" />
          </g>
        )

      default:
        return null
    }
  }

  return (
    <svg
      viewBox="6 0 36 46"
      className={className}
      style={{
        filter: filterStyle,
        transition: 'transform 0.15s ease',
        transformOrigin: 'center'
      }}
    >
      {renderShape()}
    </svg>
  )
}
