import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import type { CpuDifficulty, Color, TimeControl } from '../types'
import { loadPlayerStats, type PlayerStats } from '../utils/stats'
import {
  Swords,
  Users,
  Copy,
  Check,
  Share2,
  ArrowRight,
  ArrowLeft,
  Bot,
  ChevronDown,
  Clock,
  Download,
  Trophy,
  Skull,
  Flame,
  QrCode
} from 'lucide-react'

interface LobbyProps {
  onCreateRoom: (timeControl: TimeControl) => void
  onJoinRoom: (code: string) => void
  onCancelRoom: () => void
  onStartLocal: (timeControl: TimeControl) => void
  onStartCpu: (difficulty: CpuDifficulty, playerColor: Color, timeControl: TimeControl) => void
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
  roomCode,
  connectionStatus,
  isWaiting
}) => {
  const [inputCode, setInputCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCpuOptions, setShowCpuOptions] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<CpuDifficulty>('medium')
  const [selectedColor, setSelectedColor] = useState<Color>('w')
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl>(0)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats())
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showQrCode, setShowQrCode] = useState(false)

  // Refresh stats on mount
  useEffect(() => {
    setStats(loadPlayerStats())
  }, [])

  const shareUrl = roomCode ? `${window.location.origin}?room=${roomCode}` : ''

  // Generate QR Code for fast mobile joining
  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, {
        margin: 1.5,
        width: 180,
        color: {
          dark: '#090d16',
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

  const timeControlOptions: { label: string; value: TimeControl }[] = [
    { label: '♾️ Sem Tempo', value: 0 },
    { label: '⚡ 3 min', value: 180 },
    { label: '🔥 5 min', value: 300 },
    { label: '⏱️ 10 min', value: 600 }
  ]

  const winRate =
    stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0

  return (
    <div className="w-full max-w-sm flex flex-col items-center px-4 py-4 select-none">
      {/* Emblem & Logo Header */}
      <div className="flex flex-col items-center mb-4 text-center">
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[2px] shadow-lg shadow-amber-950/60 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border border-amber-600/30">
              <span className="font-cinzel text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600">
                64
              </span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wider">
            Arena
          </div>
        </div>

        <h1 className="text-2xl font-black font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
          DISTRICT 64
        </h1>
        <p className="text-[11px] text-slate-400 font-medium tracking-wide">
          Xadrez de Sobrevivência Mobile P2P
        </p>
      </div>

      {/* Player Stats Card */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 mb-3 shadow-sm">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
          <span className="uppercase tracking-wider text-amber-400/90 font-cinzel text-[10px]">
            Registro do Tributo
          </span>
          <span className="text-slate-500 font-mono text-[10px]">
            {stats.totalGames} {stats.totalGames === 1 ? 'partida' : 'partidas'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-1.5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <Trophy className="w-3 h-3" />
              <span>{stats.wins}</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5">Vitórias</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-1.5 flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
              <Skull className="w-3 h-3" />
              <span>{stats.losses}</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5">Derrotas</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-1.5 flex flex-col items-center">
            <div className="text-slate-300 text-xs font-bold">
              <span>{stats.draws}</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5">Empates</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-1.5 flex flex-col items-center">
            <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
              {stats.currentStreak > 1 && <Flame className="w-3 h-3 text-orange-400 animate-pulse" />}
              <span>{winRate}%</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5">Taxa</span>
          </div>
        </div>
      </div>

      {/* PWA Install Button if available */}
      {canInstall && (
        <button
          onClick={handleInstallClick}
          className="w-full mb-3 py-2 px-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 shadow transition"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar App na Tela Inicial
        </button>
      )}

      {/* Global Time Control Selector */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Relógio de Partida:</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {timeControlOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedTimeControl(opt.value)}
              className={`py-1.5 text-[11px] font-bold rounded-lg border transition ${
                selectedTimeControl === opt.value
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Options */}
      <div className="w-full flex flex-col gap-2.5">
        {/* Waiting screen when room is created */}
        {isWaiting && roomCode ? (
          <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-5 text-center shadow-xl shadow-amber-950/30 animate-fade-in">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1 font-cinzel">
              Arena Criada
            </p>
            <div className="text-3xl font-black font-mono tracking-widest text-white my-2 py-2 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
              {roomCode}
            </div>

            <p className="text-xs text-slate-400 mb-3">{connectionStatus}</p>

            {/* QR Code Toggle / Display */}
            {qrCodeUrl && (
              <div className="mb-3 flex flex-col items-center">
                {showQrCode ? (
                  <div className="p-2 bg-white rounded-xl shadow-lg border border-amber-500/30 mb-2">
                    <img src={qrCodeUrl} alt="QR Code da Sala" className="w-36 h-36" />
                    <span className="text-[10px] text-slate-950 font-semibold block mt-1">
                      Aponte a câmera do celular
                    </span>
                  </div>
                ) : null}

                <button
                  onClick={() => setShowQrCode((prev) => !prev)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 py-1 px-2.5 bg-slate-950 rounded-lg border border-slate-800"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  {showQrCode ? 'Ocultar QR Code' : 'Exibir QR Code para Celular'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 active:scale-95 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Convidar
              </button>
            </div>

            {/* BOTÃO VOLTAR / CANCELAR ARENA */}
            <button
              onClick={onCancelRoom}
              className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-750 active:scale-95 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              Voltar ao Menu Principal
            </button>
          </div>
        ) : (
          <>
            {/* Create Room Button */}
            <button
              onClick={() => onCreateRoom(selectedTimeControl)}
              className="group relative w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-98 rounded-2xl font-bold text-white shadow-lg shadow-amber-950/40 flex items-center justify-between border border-amber-400/30 transition overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Swords className="w-5 h-5 text-amber-200" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold tracking-wide">Criar Arena Online</div>
                  <div className="text-[11px] text-amber-200/80 font-normal">Gere um código e convide um amigo (P2P)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Join Room Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-slate-400">Entrar em uma Arena Existente</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: K8X2A"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-center font-mono font-bold tracking-widest text-white uppercase placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  disabled={inputCode.trim().length < 3}
                  onClick={() => onJoinRoom(inputCode)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none active:scale-95 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition"
                >
                  Entrar
                </button>
              </div>
            </div>

            {/* Play vs CPU Section */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setShowCpuOptions((prev) => !prev)}
                className="w-full py-3 px-4 flex items-center justify-between text-left hover:bg-slate-850 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-xl text-amber-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Batalhar Contra a Capital (CPU)</div>
                    <div className="text-[11px] text-slate-400">Treine sozinho contra a IA offline</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCpuOptions ? 'rotate-180' : ''}`} />
              </button>

              {showCpuOptions && (
                <div className="p-3 pt-0 border-t border-slate-800/80 flex flex-col gap-2.5 mt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Nível de Dificuldade</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['easy', 'medium', 'hard'] as CpuDifficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                            selectedDifficulty === diff
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Médio' : 'Difícil'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Suas Peças</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setSelectedColor('w')}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                          selectedColor === 'w'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Brancas (Distrito)
                      </button>
                      <button
                        onClick={() => setSelectedColor('b')}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                          selectedColor === 'b'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Pretas (Infiltrado)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartCpu(selectedDifficulty, selectedColor, selectedTimeControl)}
                    className="w-full mt-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 active:scale-98 rounded-xl text-xs font-bold text-white shadow transition"
                  >
                    Iniciar Partida Contra CPU
                  </button>
                </div>
              )}
            </div>

            {/* Local 2P */}
            <button
              onClick={() => onStartLocal(selectedTimeControl)}
              className="w-full py-3 px-4 bg-slate-900/80 hover:bg-slate-850 active:scale-98 border border-slate-800 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2.5 transition"
            >
              <Users className="w-4 h-4 text-slate-400" />
              Jogar Local (Pass & Play no Aparelho)
            </button>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-[10px] text-slate-500">
        PWA Mobile First • Regras FIDE • CPU Offline • WebRTC P2P
      </div>
    </div>
  )
}
