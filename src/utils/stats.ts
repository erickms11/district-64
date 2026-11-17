import type { CpuDifficulty } from '../types'

export interface PlayerStats {
  name: string
  rating: number // Rating ELO (FIDE / Padrão Xadrez, início em 1200)
  wins: number
  losses: number
  draws: number
  totalGames: number
  currentStreak: number
  bestStreak: number
}

const STATS_KEY = 'district64_player_stats_v1'

const DEFAULT_STATS: PlayerStats = {
  name: '',
  rating: 1200,
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  currentStreak: 0,
  bestStreak: 0
}

// Ratings estimados da CPU em cada nível
export const CPU_RATINGS: Record<CpuDifficulty, number> = {
  easy: 800,       // Recruta
  medium: 1200,    // Pacificador
  hard: 1600,      // Elite da Capital
  expert: 2000     // Presidente Snow (Expert)
}

/**
 * Retorna o título / patente em Panem de acordo com o Rating ELO do jogador
 */
export function getRatingTier(rating: number): { title: string; badge: string; color: string } {
  if (rating < 1000) return { title: 'Recruta dos Distritos', badge: '🔰', color: 'text-slate-400' }
  if (rating < 1200) return { title: 'Tributo de Panem', badge: '🏹', color: 'text-amber-200' }
  if (rating < 1400) return { title: 'Guerreiro do Distrito 12', badge: '🔥', color: 'text-orange-400' }
  if (rating < 1600) return { title: 'Sobrevivente da Arena', badge: '⚔️', color: 'text-amber-400' }
  if (rating < 1800) return { title: 'Vencedor dos Jogos', badge: '🏆', color: 'text-yellow-400' }
  if (rating < 2000) return { title: 'Líder da Rebelião', badge: '🦅', color: 'text-red-400' }
  return { title: 'Lenda dos 64 Distritos', badge: '👑', color: 'text-purple-300' }
}

export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return DEFAULT_STATS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_STATS,
      ...parsed,
      name: typeof parsed.name === 'string' ? parsed.name : '',
      rating: typeof parsed.rating === 'number' && parsed.rating > 0 ? parsed.rating : 1200
    }
  } catch {
    return DEFAULT_STATS
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // Ignore localStorage quotas
  }
}

export function setPlayerName(name: string): PlayerStats {
  const stats = loadPlayerStats()
  stats.name = name.trim()
  savePlayerStats(stats)
  return stats
}

/**
 * Algoritmo ELO padrão FIDE / Chess.com
 * Calcula a variação de pontuação baseada na probabilidade esperada de vitória
 */
export function calculateEloChange(
  playerRating: number,
  opponentRating: number,
  outcome: 'win' | 'loss' | 'draw',
  totalGames: number
): { delta: number; newRating: number } {
  const actualScore = outcome === 'win' ? 1 : outcome === 'draw' ? 0.5 : 0

  // Probabilidade esperada de vitória (Curva logística de ELO)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))

  // Fator K: maior nas primeiras 15 partidas para calibrar rápido o nível do jogador
  const k = totalGames < 15 ? 40 : totalGames < 30 ? 32 : 24

  const delta = Math.round(k * (actualScore - expectedScore))
  const newRating = Math.max(400, playerRating + delta) // Piso mínimo oficial de 400

  return { delta, newRating }
}

export interface MatchResultOutcome {
  stats: PlayerStats
  delta: number
  newRating: number
  oldRating: number
}

export function recordMatchResult(
  outcome: 'win' | 'loss' | 'draw',
  opponentRating: number = 1200
): MatchResultOutcome {
  const stats = loadPlayerStats()
  const oldRating = stats.rating || 1200

  // Calcula novo ELO
  const { delta, newRating } = calculateEloChange(oldRating, opponentRating, outcome, stats.totalGames)

  stats.totalGames += 1
  stats.rating = newRating

  if (outcome === 'win') {
    stats.wins += 1
    stats.currentStreak += 1
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak
    }
  } else if (outcome === 'loss') {
    stats.losses += 1
    stats.currentStreak = 0
  } else {
    stats.draws += 1
  }

  savePlayerStats(stats)
  return { stats, delta, newRating, oldRating }
}

export function resetPlayerStats(): PlayerStats {
  const stats = loadPlayerStats()
  const resetStats: PlayerStats = {
    ...DEFAULT_STATS,
    name: stats.name // Mantém o nome cadastrado
  }
  savePlayerStats(resetStats)
  return resetStats
}
