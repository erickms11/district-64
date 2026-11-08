export interface PlayerStats {
  wins: number
  losses: number
  draws: number
  totalGames: number
  currentStreak: number
  bestStreak: number
}

const STATS_KEY = 'district64_player_stats_v1'

const DEFAULT_STATS: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  currentStreak: 0,
  bestStreak: 0
}

export function loadPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') return DEFAULT_STATS
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return DEFAULT_STATS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_STATS, ...parsed }
  } catch {
    return DEFAULT_STATS
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // Ignore localStorage quotas or disabled errors
  }
}

export function recordMatchResult(outcome: 'win' | 'loss' | 'draw'): PlayerStats {
  const stats = loadPlayerStats()

  stats.totalGames += 1

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
  return stats
}

export function resetPlayerStats(): PlayerStats {
  savePlayerStats(DEFAULT_STATS)
  return DEFAULT_STATS
}

