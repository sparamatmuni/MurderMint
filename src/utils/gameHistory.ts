// Game History Persistence & Detective Stats Ranking System
// Stores completed game summaries in localStorage

import { GameState, CharacterId, WeaponId, RoomId } from '../types';
import { CHARACTERS, WEAPONS, ROOMS } from '../data/gameData';

export interface GameRecord {
  id: string;
  roomCode: string;
  roomName: string;
  timestamp: number;
  winnerId: string | null;
  winnerName: string;
  winnerCharacter: CharacterId | null;
  isColdCase: boolean;
  totalTurns: number;
  totalSuggestions: number;
  totalAccusations: number;
  playerCount: number;
  humanPlayerCount: number;
  secretSolution: {
    suspect: CharacterId;
    weapon: WeaponId;
    room: RoomId;
  };
  playerNames: string[];
  aiDifficulty: 'easy' | 'medium' | 'detective';
}

export interface DetectiveStats {
  totalGames: number;
  wins: number;
  losses: number;
  coldCases: number;
  totalTurns: number;
  totalSuggestions: number;
  totalAccusations: number;
  correctAccusations: number;
  winStreak: number;
  bestWinStreak: number;
  detectiveRank: string;
  detectiveRankIcon: string;
}

const STORAGE_KEY = 'murdermint_game_history';
const STATS_KEY = 'murdermint_detective_stats';

// ===== Rank System =====
const RANKS: { minWins: number; rank: string; icon: string }[] = [
  { minWins: 0, rank: 'Rookie', icon: '🔍' },
  { minWins: 3, rank: 'Constable', icon: '🗝️' },
  { minWins: 7, rank: 'Inspector', icon: '🔎' },
  { minWins: 15, rank: 'Chief Inspector', icon: '📜' },
  { minWins: 25, rank: 'Detective Sergeant', icon: '🎩' },
  { minWins: 40, rank: 'Superintendent', icon: '🏛️' },
  { minWins: 60, rank: 'Commissioner', icon: '👑' },
  { minWins: 100, rank: 'Grand Inquisitor', icon: '💀' },
];

function getRankForWins(wins: number): { rank: string; icon: string } {
  let result = RANKS[0];
  for (const r of RANKS) {
    if (wins >= r.minWins) result = r;
  }
  return result;
}

// ===== Storage Helpers =====
function readHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(records: GameRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage full — drop oldest records
    const trimmed = records.slice(-50);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
  }
}

function readStats(): DetectiveStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalGames: 0,
    wins: 0,
    losses: 0,
    coldCases: 0,
    totalTurns: 0,
    totalSuggestions: 0,
    totalAccusations: 0,
    correctAccusations: 0,
    winStreak: 0,
    bestWinStreak: 0,
    detectiveRank: 'Rookie',
    detectiveRankIcon: '🔍',
  };
}

function writeStats(stats: DetectiveStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

// ===== Public API =====

export function getGameHistory(): GameRecord[] {
  return readHistory().sort((a, b) => b.timestamp - a.timestamp);
}

export function getRecentGames(count: number): GameRecord[] {
  return getGameHistory().slice(0, count);
}

export function getDetectiveStats(): DetectiveStats {
  return readStats();
}

/**
 * Record a completed game into history and update cumulative stats.
 * Call this when a game reaches 'game_over' and the player navigates to results.
 */
export function recordGameCompletion(
  state: GameState,
  currentUserId: string
): void {
  const humanPlayer = state.players.find(p => p.id === currentUserId);
  const didWin = state.winnerId === currentUserId;

  const record: GameRecord = {
    id: `game-${state.roomCode}-${Date.now()}`,
    roomCode: state.roomCode,
    roomName: state.roomName,
    timestamp: Date.now(),
    winnerId: state.winnerId,
    winnerName: humanPlayer?.name || 'Unknown',
    winnerCharacter: humanPlayer?.characterId || null,
    isColdCase: state.isColdCase,
    totalTurns: state.turnNumber,
    totalSuggestions: state.suggestions.length,
    totalAccusations: state.accusations.length,
    playerCount: state.players.length,
    humanPlayerCount: state.players.filter(p => !p.isAi).length,
    secretSolution: state.secretSolution,
    playerNames: state.players.map(p => p.name),
    aiDifficulty: state.houseRules.aiDifficulty,
  };

  // Append to history
  const history = readHistory();
  history.push(record);
  writeHistory(history);

  // Update stats
  const stats = readStats();
  stats.totalGames += 1;
  stats.totalTurns += state.turnNumber;
  stats.totalSuggestions += state.suggestions.length;
  stats.totalAccusations += state.accusations.length;

  // Track correct accusations (from all players in the game)
  const humanAccusations = state.accusations.filter(a => a.accuserId === currentUserId);
  const correctAccusations = humanAccusations.filter(a => a.isCorrect).length;
  stats.correctAccusations += correctAccusations;

  if (didWin) {
    stats.wins += 1;
    stats.winStreak += 1;
    if (stats.winStreak > stats.bestWinStreak) {
      stats.bestWinStreak = stats.winStreak;
    }
  } else {
    stats.losses += 1;
    stats.winStreak = 0;
  }

  if (state.isColdCase) {
    stats.coldCases += 1;
  }

  // Recalculate rank
  const { rank, icon } = getRankForWins(stats.wins);
  stats.detectiveRank = rank;
  stats.detectiveRankIcon = icon;

  writeStats(stats);
}

export function getWinRate(): number {
  const stats = readStats();
  if (stats.totalGames === 0) return 0;
  return Math.round((stats.wins / stats.totalGames) * 100);
}

export function clearGameHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
}
