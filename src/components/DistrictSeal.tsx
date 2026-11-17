import React from 'react'

interface DistrictSealProps {
  className?: string
  size?: number
}

export const DistrictSeal: React.FC<DistrictSealProps> = ({
  className = 'w-20 h-20',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Bronze/Gold Gradients */}
        <linearGradient id="sealGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <linearGradient id="sealDarkIron" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1c26" />
          <stop offset="50%" stopColor="#0f1118" />
          <stop offset="100%" stopColor="#07080d" />
        </linearGradient>

        <linearGradient id="sealSteelPick" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="sealWoodShaft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Hunger Games Flame Gradient */}
        <linearGradient id="sealFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Text Paths for Curved District Arch */}
        <path id="textArcTop" d="M 28,100 A 72,72 0 1,1 172,100" fill="none" />
        <path id="textArcBottom" d="M 168,100 A 68,68 0 0,1 32,100" fill="none" />
      </defs>

      {/* Outer Subtle Flame Ambient Glow */}
      <circle cx="100" cy="100" r="96" fill="url(#emberGlow)" />

      {/* Base Dark Iron Medallion */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="url(#sealDarkIron)"
        stroke="url(#sealGoldRim)"
        strokeWidth="4"
      />

      {/* Outer Gear / Rivet Ring */}
      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* 12 Industrial Rivets (representing Districts) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const cx = 100 + 88 * Math.cos(rad)
        const cy = 100 + 88 * Math.sin(rad)
        return (
          <circle
            key={deg}
            cx={cx}
            cy={cy}
            r="2"
            fill="url(#sealGoldRim)"
            stroke="#451a03"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Circular Arch Inscriptions: DISTRICT 64 • PANEM */}
      <text
        fill="url(#sealGoldRim)"
        fontSize="11"
        fontWeight="900"
        letterSpacing="3.5"
        fontFamily="Cinzel, serif"
      >
        <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
          DISTRICT 64
        </textPath>
      </text>

      <text
        fill="#b45309"
        fontSize="8.5"
        fontWeight="800"
        letterSpacing="4"
        fontFamily="Cinzel, serif"
      >
        <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
          • PANEM •
        </textPath>
      </text>

      {/* Inner Inset Ring */}
      <circle
        cx="100"
        cy="100"
        r="64"
        fill="#0b0d14"
        stroke="url(#sealGoldRim)"
        strokeWidth="2.5"
      />
      <circle
        cx="100"
        cy="100"
        r="59"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.6"
      />

      {/* ⛏️ CROSSED MINING PICKAXES (Ícone clássico do Distrito 12) */}
      {/* Pickaxe 1 (Tilted Left) */}
      <g transform="rotate(-36 100 102)">
        {/* Shaft */}
        <rect
          x="97"
          y="62"
          width="6"
          height="78"
          rx="3"
          fill="url(#sealWoodShaft)"
          stroke="#331405"
          strokeWidth="1"
        />
        {/* Shaft Metal Bands */}
        <rect x="96.5" y="70" width="7" height="3" fill="url(#sealGoldRim)" />
        <rect x="96.5" y="128" width="7" height="3" fill="url(#sealGoldRim)" />
        {/* Curved Steel Pick Head */}
        <path
          d="M 64 64 C 82 56 100 58 100 62 C 100 58 118 56 136 64 C 130 68 118 69 104 69 L 104 74 L 96 74 L 96 69 C 82 69 70 68 64 64 Z"
          fill="url(#sealSteelPick)"
          stroke="url(#sealGoldRim)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>

      {/* Pickaxe 2 (Tilted Right) */}
      <g transform="rotate(36 100 102)">
        {/* Shaft */}
        <rect
          x="97"
          y="62"
          width="6"
          height="78"
          rx="3"
          fill="url(#sealWoodShaft)"
          stroke="#331405"
          strokeWidth="1"
        />
        {/* Shaft Metal Bands */}
        <rect x="96.5" y="70" width="7" height="3" fill="url(#sealGoldRim)" />
        <rect x="96.5" y="128" width="7" height="3" fill="url(#sealGoldRim)" />
        {/* Curved Steel Pick Head */}
        <path
          d="M 64 64 C 82 56 100 58 100 62 C 100 58 118 56 136 64 C 130 68 118 69 104 69 L 104 74 L 96 74 L 96 69 C 82 69 70 68 64 64 Z"
          fill="url(#sealSteelPick)"
          stroke="url(#sealGoldRim)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>

      {/* 🔥 THE FLAME OF REBELLION (No centro das picaretas) */}
      <path
        d="M 100 58 C 93 68 89 77 93 85 C 96 91 104 93 107 89 C 111 85 111 78 108 74 C 107 72 108 67 112 70 C 116 74 117 83 114 89 C 111 96 102 101 94 98 C 86 94 82 85 86 74 C 89 65 96 59 100 58 Z"
        fill="url(#sealFlameGrad)"
        filter="drop-shadow(0 0 4px rgba(245,158,11,0.8))"
      />
      {/* Inner Flame Core */}
      <path
        d="M 100 70 C 97 76 96 81 99 85 C 101 88 105 88 106 85 C 108 81 106 77 100 70 Z"
        fill="#ffffff"
        opacity="0.85"
      />

      {/* 🏅 CENTRAL SHIELD BADGE COM "64" STENCIL INDUSTRIAL */}
      <g transform="translate(100, 116)">
        {/* Industrial Hex Badge Plaque */}
        <path
          d="M -26 -14 L 26 -14 L 21 16 L 0 24 L -21 16 Z"
          fill="#06070a"
          stroke="url(#sealGoldRim)"
          strokeWidth="2"
        />
        {/* Inner Border */}
        <path
          d="M -22 -11 L 22 -11 L 18 13 L 0 20 L -18 13 Z"
          fill="none"
          stroke="#b45309"
          strokeWidth="1"
        />

        {/* Number 64 - Typography Stencil */}
        <text
          x="0"
          y="7"
          fill="url(#sealGoldRim)"
          fontSize="20"
          fontWeight="900"
          fontFamily="Cinzel, serif"
          textAnchor="middle"
          letterSpacing="1"
          style={{
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.9))'
          }}
        >
          64
        </text>
      </g>
    </svg>
  )
}

