import React, { useState } from 'react'
import type { PieceSymbol, Color, PieceTheme } from '../types'

export type { PieceTheme }

interface ChessPieceProps {
  type: PieceSymbol
  color: Color
  theme?: PieceTheme
  className?: string
}

// 🎯 REGISTRO DE PEÇAS TEMÁTICAS DE PERSONAGENS DO DISTRICT 64
export const CHARACTER_PIECES: Record<string, string> = {
  'w_k': '/pieces/katniss_king.png',   // Katniss Everdeen como Líder dos Distritos
  'b_k': '/pieces/president_snow.png', // Presidente Snow como Líder da Capital
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color,
  theme = 'duolingo',
  className = 'w-full h-full'
}) => {
  const isWhite = color === 'w'
  const pieceKey = `${color}_${type}`
  const customImage = (theme as string) === 'characters' ? CHARACTER_PIECES[pieceKey] : null
  const [imgError, setImgError] = useState(false)

  // Se o tema "Personagens" estiver ativo e a peça tiver uma imagem
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
          {type === 'k' && (
            <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
              <span className="text-[10px] leading-none drop-shadow-md">👑</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 🦉 TEMA DUOLINGO MODERNO (PADRÃO): Grande, arredondado, volumétrico e altamente distinto
  // Distrito 12 / Katniss (VERMELHO - Começam) vs Pacificadores / Sentinela da Capital (BRANCO - Respondem)
  if (theme === 'duolingo') {
    const isRed = isWhite // No xadrez, 'w' joga primeiro: aqui são os Vermelhos (Katniss / Distrito 12)
    const strokeColor = isRed ? '#5c0812' : '#334155'
    const innerColor = isRed ? '#ffa8b0' : '#94a3b8'
    const cutoutFill = isRed ? '#3f060b' : '#1e293b'
    const gradId = isRed ? 'duoRedGrad' : 'duoPeacekeeperGrad'
    const strokeWidth = 4.2

    const renderDuolingoShape = () => {
      switch (type) {
        case 'k': // REI (King) - Coroa com formato de coração e Cruz grande no topo
          return (
            <g>
              {/* Royal Heart Body */}
              <path
                d="M 50 25 C 40 25 24 33 17 44 C 12 52 14 62 20 68 C 24 72 26 73 26 76 C 26 80 23 83 20 86 C 18 88 20 90 24 90 L 76 90 C 80 90 82 88 80 86 C 77 83 74 80 74 76 C 74 73 76 72 80 68 C 86 62 88 52 83 44 C 76 33 60 25 50 25 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Inner Royal Collar Contour */}
              <path
                d="M 30 64 C 40 76 60 76 70 64"
                fill="none"
                stroke={innerColor}
                strokeWidth={3.8}
                strokeLinecap="round"
              />
              {/* Cross Base Stem */}
              <path
                d="M 46 25 L 54 25 L 54 28 L 46 28 Z"
                fill={strokeColor}
              />
              {/* Grand Rounded Greek Cross */}
              <rect
                x="45.5"
                y="5"
                width="9"
                height="22"
                rx="4.5"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <rect
                x="37"
                y="11.5"
                width="26"
                height="9"
                rx="4.5"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              {/* Gloss Highlight */}
              <ellipse
                cx="34"
                cy="40"
                rx="7"
                ry="3"
                transform="rotate(-25 34 40)"
                fill="#ffffff"
                opacity={isRed ? 0.75 : 0.85}
              />
            </g>
          )

        case 'q': // RAINHA (Queen) - Coroa lótus de 4 pontas curvadas com joia vazada
          return (
            <g>
              {/* 4-Petal Crown Body */}
              <path
                d="M 14 26 C 16 23 20 23 22 26 C 26 31 29 36 34 33 C 35 32 36 26 36 22 C 37 15 42 13 44 16 C 47 21 48 26 50 26 C 52 26 53 21 56 16 C 58 13 63 15 64 22 C 64 26 65 32 66 33 C 71 36 74 31 78 26 C 80 23 84 23 86 26 C 88 30 84 46 76 60 C 72 67 72 71 74 76 C 76 81 78 84 79 86 C 80 88 78 90 74 90 L 26 90 C 22 90 20 88 21 86 C 22 84 24 81 26 76 C 28 71 28 67 24 60 C 16 46 12 30 14 26 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Center Jewel Opening Cutout */}
              <path
                d="M 50 36 C 42 36 37 43 37 51 C 37 58 43 62 50 62 C 57 62 63 58 63 51 C 63 43 58 36 50 36 Z"
                fill={cutoutFill}
                stroke={strokeColor}
                strokeWidth={3.8}
              />
              {/* Base Trim Line */}
              <path
                d="M 28 76 C 40 80 60 80 72 76"
                fill="none"
                stroke={innerColor}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Gloss Highlight */}
              <ellipse
                cx="28"
                cy="44"
                rx="5"
                ry="2.5"
                transform="rotate(-40 28 44)"
                fill="#ffffff"
                opacity={isRed ? 0.7 : 0.8}
              />
            </g>
          )

        case 'b': // BISPO (Bishop) - Mitra esférica elegante com corte circular na lateral direita
          return (
            <g>
              {/* Top Spherical Finial Ball */}
              <circle
                cx="50"
                cy="12"
                r="6.5"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              {/* Mitre Body with Iconic Circular Scoop Notch on the right */}
              <path
                d="M 50 18 C 41 18 31 26 26 36 C 20 48 20 62 23 72 C 25 78 24 81 21 84 C 19 86 21 89 25 89 L 75 89 C 79 89 81 86 79 84 C 76 81 75 78 77 72 C 80 62 80 54 77 46 C 73 47 67 44 65 39 C 63 34 66 28 70 26 C 65 21 58 18 50 18 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Circular Notch Cutout Accent */}
              <path
                d="M 77 46 C 73 47 67 44 65 39 C 63 34 66 28 70 26"
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Base Shadow Line */}
              <path
                d="M 28 77 C 42 81 58 81 72 77"
                fill="none"
                stroke={innerColor}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              {/* Gloss Highlight */}
              <ellipse
                cx="38"
                cy="32"
                rx="6"
                ry="3"
                transform="rotate(-30 38 32)"
                fill="#ffffff"
                opacity={isRed ? 0.75 : 0.85}
              />
            </g>
          )

        case 'n': // CAVALO (Knight) - Cabeça de pônei/cavalo fofo e expressivo de perfil
          return (
            <g>
              {/* Cute Cartoon Horse Profile Body */}
              <path
                d="M 18 42 C 16 46 17 50 22 53 C 27 55 33 55 36 57 C 32 63 28 70 27 77 C 26 81 24 84 21 86 C 19 88 21 90 26 90 L 76 90 C 80 90 82 87 79 84 C 75 80 76 74 79 66 C 83 54 84 38 78 28 C 73 20 64 16 54 18 C 50 19 46 20 44 19 C 43 17 41 12 37 12 C 34 12 33 16 32 20 C 31 23 27 27 24 31 C 20 35 19 39 18 42 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Cute Eye Dot */}
              <circle
                cx="34"
                cy="34"
                r="3.2"
                fill={isRed ? '#ffffff' : '#0f172a'}
                opacity={isRed ? 0.95 : 0.85}
              />
              {/* Ear Crease */}
              <path
                d="M 37 19 L 41 23"
                fill="none"
                stroke={innerColor}
                strokeWidth={2.8}
                strokeLinecap="round"
              />
              {/* Jaw & Mane Accent Line */}
              <path
                d="M 23 53 C 30 55 35 53 38 48"
                fill="none"
                stroke={innerColor}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Back Neck Muscle Arc */}
              <path
                d="M 64 30 C 72 40 72 60 70 76"
                fill="none"
                stroke={innerColor}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Gloss Highlight */}
              <ellipse
                cx="50"
                cy="23"
                rx="6"
                ry="2.5"
                transform="rotate(-15 50 23)"
                fill="#ffffff"
                opacity={isRed ? 0.75 : 0.85}
              />
            </g>
          )

        case 'r': // TORRE (Rook) - Castelo robusto com ameias arredondadas e janela vazada
          return (
            <g>
              {/* Castle Tower Body with Crenellations */}
              <path
                d="M 18 17 C 18 15 20 14 22 14 L 32 14 C 34 14 34 16 34 18 L 34 25 C 34 26 35 27 36 27 L 44 27 C 45 27 46 26 46 25 L 46 18 C 46 16 46 14 48 14 L 52 14 C 54 14 54 16 54 18 L 54 25 C 54 26 55 27 56 27 L 64 27 C 65 27 66 26 66 25 L 66 18 C 66 16 66 14 68 14 L 78 14 C 80 14 82 15 82 17 L 82 31 C 82 34 80 37 78 39 L 75 66 C 75 72 77 76 80 80 C 82 82 82 85 81 87 C 80 89 77 90 74 90 L 26 90 C 23 90 20 89 19 87 C 18 85 18 82 20 80 C 23 76 25 72 25 66 L 22 39 C 20 37 18 34 18 31 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Center Tower Loop / Arch Recess */}
              <path
                d="M 50 36 C 42 36 37 42 37 50 C 37 58 42 64 50 64 C 58 64 63 58 63 50 C 63 42 58 36 50 36 Z"
                fill={cutoutFill}
                stroke={strokeColor}
                strokeWidth={3.8}
              />
              {/* Base Trim Line */}
              <path
                d="M 27 76 C 40 80 60 80 73 76"
                fill="none"
                stroke={innerColor}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
              {/* Gloss Highlight */}
              <ellipse
                cx="27"
                cy="44"
                rx="3.5"
                ry="8"
                fill="#ffffff"
                opacity={isRed ? 0.7 : 0.8}
              />
            </g>
          )

        case 'p': // PEÃO (Pawn) - Bolha fofa com cabeça redonda e corpo de pino de boliche
          return (
            <g>
              {/* Bulbous Bowling-Pin Pawn Body */}
              <path
                d="M 50 10 C 38 10 29 19 29 31 C 29 39 34 46 40 49 C 32 55 24 66 23 77 C 23 82 25 86 28 88 C 30 89 33 90 38 90 L 62 90 C 67 90 70 89 72 88 C 75 86 77 82 77 77 C 76 66 68 55 60 49 C 66 46 71 39 71 31 C 71 19 62 10 50 10 Z"
                fill={`url(#${gradId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Neck Shadow Line */}
              <path
                d="M 40 49 C 46 52 54 52 60 49"
                fill="none"
                stroke={innerColor}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Base Shadow Line */}
              <path
                d="M 32 78 C 42 82 58 82 68 78"
                fill="none"
                stroke={innerColor}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
              {/* Gloss Specular Highlight on Head */}
              <ellipse
                cx="42"
                cy="23"
                rx="6"
                ry="3"
                transform="rotate(-25 42 23)"
                fill="#ffffff"
                opacity={isRed ? 0.8 : 0.85}
              />
            </g>
          )

        default:
          return null
      }
    }

    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        style={{
          filter: isRed
            ? 'drop-shadow(0px 3px 6px rgba(220,38,38,0.55)) drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
            : 'drop-shadow(0px 3px 6px rgba(15,23,42,0.45))',
          transition: 'transform 0.15s ease',
          transformOrigin: 'center'
        }}
      >
        <defs>
          {/* Fogo Escarlate de Katniss / Distrito 12 (Vermelho - Joga Primeiro) */}
          <linearGradient id="duoRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5964" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Armadura Imaculada dos Pacificadores / Sentinela da Capital (Branco - Joga Segundo) */}
          <linearGradient id="duoPeacekeeperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ebf2f8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {renderDuolingoShape()}
      </svg>
    )
  }

  // ♟️ CONJUNTO CLÁSSICO STAUNTON VETORIAL (Distrito Vermelho vs Pacificador Branco)
  const isRed = isWhite
  const fill = isRed ? '#dc2626' : '#ffffff'
  const stroke = isRed ? '#7f1d1d' : '#334155'
  const gold = '#f59e0b'

  const filterStyle = isRed
    ? 'drop-shadow(0px 2px 4px rgba(220,38,38,0.5))'
    : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'

  const renderStauntonShape = () => {
    switch (type) {
      case 'k': // REI (King)
        return (
          <g>
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
            <path
              d="M14 36.5 C15 28 17 25 19 22 C17 21 16 19 16 16.5 C16 13 18.5 11 24 11 C29.5 11 32 13 32 16.5 C32 19 31 21 29 22 C31 25 33 28 34 36.5 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <g transform="translate(0, -1)">
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
            </g>
          </g>
        )

      case 'q': // RAINHA (Queen)
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

      case 'b': // BISPO (Bishop)
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

      case 'n': // CAVALO (Knight)
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
            <circle cx="23" cy="16.5" r="1.5" fill={gold} />
          </g>
        )

      case 'r': // TORRE (Rook)
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
              d="M14 13.5 h4.5 v3 h3 v-3 h5 v3 h3 v-3 h4.5 v6 h-20 z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        )

      case 'p': // PEÃO (Pawn)
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
            <circle
              cx="24"
              cy="16"
              r="5.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
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
      {renderStauntonShape()}
    </svg>
  )
}
