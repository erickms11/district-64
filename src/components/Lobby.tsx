import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import type { CpuDifficulty, Color, TimeControl } from '../types'
import { loadPlayerStats, type PlayerStats } from '../utils/stats'
import { DistrictSeal } from './DistrictSeal'
import {
  Swords,
  Users,
  Copy,
  Check,
  Share2,
  ArrowRight,
  ArrowLeft,
  Bot,
  Download,
  Trophy,
  QrCode,
  Settings2,
  Volume2,
  VolumeX
} from 'lucide-react'

interface LobbyProps {
  onCreateRoom: () => void
  onJoinRoom: (code: string) => void
  onCancelRoom: () => void
  onStartLocal: () => void
  onStartCpu: () => void
  onOpenSettings: () => void
  playerStats?: PlayerStats
  isMusicMuted?: boolean
  onToggleMusic?: () => void
  timeControl?: TimeControl
  cpuDifficulty?: CpuDifficulty
  cpuPlayerColor?: Color
  roomCode: string | null
  connectionStatus: string
  isWaiting: boolean
}

export const Lobby: React.FC<LobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  onCancelRoom,
  onStartLocal,
  onStartCpu,
  onOpenSettings,
  playerStats,
  isMusicMuted = false,
  onToggleMusic,
  roomCode,
  connectionStatus,
  isWaiting
}) => {
  const [inputCode, setInputCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [stats, setStats] = useState<PlayerStats>(() => playerStats || loadPlayerStats())
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showQrCode, setShowQrCode] = useState(false)

  // Refresh stats on mount or when playerStats prop updates
  useEffect(() => {
    setStats(playerStats || loadPlayerStats())
  }, [playerStats])

  const shareUrl = roomCode
    ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    : ''

  // Generate QR Code for fast mobile joining
  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, {
        margin: 1.5,
        width: 180,
        color: {
          dark: '#08090d',
          light: '#f8fafc'
        }
      })
        .then(setQrCodeUrl)
        .catch(console.error)
    } else {
      setQrCodeUrl('')
    }
  }, [shareUrl])

  // Listen for PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setCanInstall(false)
    }
    setDeferredPrompt(null)
  }

  const handleCopyLink = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!shareUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'District 64 - Arena de Xadrez',
          text: `Você foi convocado para a arena! Código da sala: ${roomCode}`,
          url: shareUrl
        })
      } catch {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  const winRate =
    stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0

  return (
    <div className="w-full max-w-sm flex flex-col items-center px-4 py-4 select-none">
      {/* Top Header Actions (Settings, Music & Title) */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-mono tracking-widest text-amber-500/70 uppercase">
          PANEM • DISTRICT 64
        </span>
        <div className="flex items-center gap-1.5">
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              className="p-1.5 rounded-xl bg-[#0e1017] hover:bg-[#181c2b] text-amber-300 border border-amber-900/40 shadow-sm transition"
              title={isMusicMuted ? 'Ativar Música' : 'Silenciar Música'}
            >
              {isMusicMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-1.5 px-2.5 rounded-xl bg-[#0e1017] hover:bg-[#181c2b] text-amber-300 border border-amber-900/40 shadow-sm flex items-center gap-1.5 text-xs font-cinzel transition"
            title="Ajustes da Arena"
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold">Ajustes</span>
          </button>
        </div>
      </div>

      {/* Emblem & Logo Header (Inspirado no Selo Oficial do Distrito 12 de Panem) */}
      <div className="flex flex-col items-center mb-3 text-center">
        <DistrictSeal className="w-20 h-20 mb-1.5 animate-fade-in" />

        <h1 className="text-xl font-black font-cinzel tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600">
          DISTRICT 64
        </h1>
        <p className="text-[10px] text-amber-200/70 italic font-cinzel tracking-wider mt-0.5">
          "Que a sorte esteja sempre a seu favor"
        </p>
      </div>

      {/* Registro do Tributo com Nome e ELO */}
      <div
        onClick={onOpenSettings}
        className="w-full bg-[#0e1017]/85 hover:bg-[#121622] border border-amber-900/40 rounded-xl px-3 py-2 mb-3 flex items-center justify-between text-xs shadow-sm backdrop-blur-md cursor-pointer transition"
        title="Clique para ver ou alterar ajustes do Tributo"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-cinzel font-bold text-amber-200 text-xs truncate max-w-[95px]" title={stats.name || 'Tributo'}>
              {stats.name || 'Tributo'}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 bg-[#08090e] border border-amber-800/40 rounded-md shrink-0 shadow-inner">
              {stats.rating || 1200} ELO
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <span className="text-emerald-400 font-bold" title="Vitórias">{stats.wins}V</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400 font-bold" title="Derrotas">{stats.losses}D</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-300 font-bold" title="Taxa de Vitória">{winRate}%</span>
        </div>
      </div>

      {/* PWA Install Button if available */}
      {canInstall && (
        <button
          onClick={handleInstallClick}
          className="w-full mb-2.5 py-1.5 px-3 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/40 rounded-xl text-[11px] font-bold text-amber-300 flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar App na Tela Inicial
        </button>
      )}

      {/* Main Options */}
      <div className="w-full flex flex-col gap-2">
        {/* Waiting screen when room is created */}
        {isWaiting && roomCode ? (
          <div className="bg-[#0e1017]/95 border-2 border-amber-500/60 rounded-2xl p-5 text-center shadow-2xl shadow-amber-950/40 animate-fade-in backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1 font-cinzel">
              Arena Convocada
            </p>
            <div className="text-3xl font-black font-mono tracking-widest text-white my-2 py-2 bg-[#08090e] rounded-xl border border-amber-900/50 shadow-inner">
              {roomCode}
            </div>

            <p className="text-xs text-amber-200/70 mb-3">{connectionStatus}</p>

            {/* QR Code Toggle / Display */}
            {qrCodeUrl && (
              <div className="mb-3 flex flex-col items-center">
                {showQrCode ? (
                  <div className="p-2.5 bg-white rounded-xl shadow-xl border-2 border-amber-500 mb-2">
                    <img src={qrCodeUrl} alt="QR Code da Sala" className="w-36 h-36" />
                    <span className="text-[10px] text-slate-950 font-bold block mt-1">
                      Aponte a câmera do celular
                    </span>
                  </div>
                ) : null}

                <button
                  onClick={() => setShowQrCode((prev) => !prev)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 py-1 px-2.5 bg-[#08090e] rounded-lg border border-amber-800/40"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  {showQrCode ? 'Ocultar QR Code' : 'Exibir QR Code para Celular'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-[#131622] hover:bg-[#1a1e2e] active:scale-95 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 active:scale-95 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950/40 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Convidar
              </button>
            </div>

            {/* BOTÃO VOLTAR / CANCELAR ARENA */}
            <button
              onClick={onCancelRoom}
              className="w-full py-2.5 px-3 bg-[#131622] hover:bg-slate-800 active:scale-95 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              Voltar ao Menu Principal
            </button>
          </div>
        ) : (
          <>
            {/* Create Room Button - 1 Linha de texto, mais clean */}
            <button
              onClick={onCreateRoom}
              className="group w-full py-2.5 px-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 active:scale-98 rounded-xl font-bold text-white shadow-md shadow-amber-950/40 flex items-center justify-between border border-amber-400/40 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-black/20 rounded-lg">
                  <Swords className="w-4 h-4 text-amber-200" />
                </div>
                <span className="text-xs font-bold font-cinzel tracking-wide">Criar Arena Online</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Join Room Box - Compacto e integrado */}
            <div className="w-full bg-[#0e1017]/85 border border-amber-900/40 rounded-xl p-1.5 pl-3 flex items-center gap-2 shadow-sm">
              <input
                type="text"
                placeholder="CÓDIGO DA SALA (EX: K8X2A)"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent font-mono font-bold tracking-widest text-amber-300 uppercase placeholder:text-slate-600 text-xs focus:outline-none"
              />
              <button
                disabled={inputCode.trim().length < 3}
                onClick={() => onJoinRoom(inputCode)}
                className="px-3 py-1.5 bg-[#161a26] hover:bg-[#202538] disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-amber-400 font-bold text-xs rounded-lg border border-amber-800/40 transition font-cinzel shrink-0"
              >
                Entrar
              </button>
            </div>

            {/* Play vs CPU Button - 1 Linha de texto, mais clean */}
            <button
              onClick={onStartCpu}
              className="group w-full py-2.5 px-3.5 bg-[#0e1017]/85 hover:bg-[#151926] active:scale-98 border border-amber-900/40 rounded-xl flex items-center justify-between shadow-sm transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#08090e] rounded-lg text-amber-400 border border-amber-900/40">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 font-cinzel tracking-wide">
                  Batalha Contra a CPU
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Local 2P - 1 Linha de texto, mais clean */}
            <button
              onClick={onStartLocal}
              className="group w-full py-2.5 px-3.5 bg-[#0e1017]/85 hover:bg-[#151926] active:scale-98 border border-amber-900/30 rounded-xl flex items-center justify-between shadow-sm transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#08090e] rounded-lg text-amber-400/80 border border-amber-900/30">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-300 font-cinzel tracking-wide">
                  Partida Local (Pass & Play)
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400/50 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-[10px] text-slate-500 font-cinzel tracking-wider">
        PANEM • DISTRICT 64 • FIDE RULES
      </div>
    </div>
  )
}
