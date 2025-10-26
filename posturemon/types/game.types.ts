/**
 * Game Types
 * Core types for the game system
 */

// ============ PET TYPES ============

export interface PetState {
  id: string
  name: string
  mood: 'cheerful' | 'happy' | 'neutral' | 'worried' | 'sad' | 'sleeping'
  evolution: 'egg' | 'baby' | 'juvenile' | 'adult' | 'master' | 'legendary'
  level: number
  health: number // 0-100
  happiness: number // 0-100
  energy: number // 0-100
  appearance: {
    color: string
    accessories?: string[]
  }
  bondLevel: number // 0-100
  timeOwned: number // milliseconds
  interactionsCount: number
  currentAnimation: string
  lastAction: number // timestamp
}

// ============ QUEST TYPES ============

export interface Quest {
  questId: string
  type: 'micro-break' | 'breathing' | 'stretching' | 'movement' | 'posture-check'
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // seconds
  phases: QuestPhase[]
  rewards: QuestRewards
  requirements?: QuestRequirements
  timesCompleted: number
  lastCompleted?: number // timestamp
  aiRecommended: boolean
}

export interface QuestPhase {
  phaseId: string
  name: string
  description: string
  duration: number // seconds
  instructions: string[]
  requiresValidation: boolean
  validationCriteria?: {
    minPostureScore?: number
    requiredMovements?: string[]
  }
  successMessage: string
}

export interface QuestRewards {
  xp: number
  happiness?: number
  energy?: number
  bonus?: {
    type: 'perfect-score' | 'speed' | 'streak'
    multiplier: number
  }
  petUnlocks?: string[]
}

export interface QuestRequirements {
  minLevel?: number
  completedQuests?: string[]
  minStreak?: number
}

// ============ ACHIEVEMENT TYPES ============

export interface Achievement {
  achievementId: string
  category: 'quests' | 'streaks' | 'posture' | 'milestones' | 'special'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  name: string
  description: string
  icon: string
  requirements: AchievementRequirements
  unlocked: boolean
  unlockedAt?: number // timestamp
  progress: number // 0-100
  rewards: AchievementRewards
  hidden: boolean // Hidden until unlocked
  showcase: boolean // Can be displayed on profile
}

export interface AchievementRequirements {
  type: 'quests-completed' | 'streak' | 'level' | 'perfect-hour' | 'perfect-day' | 'quest-time' | 'weekend-quests'
  target: number
  current: number
}

export interface AchievementRewards {
  xp: number
  petUnlocks?: string[]
  title?: string
  badge?: string
}

// ============ PLAYER STATS ============

export interface PlayerStats {
  level: number
  xp: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  totalQuestsCompleted: number
  totalPlayTime: number // milliseconds
  joinedAt: number // timestamp
  lastActive: number // timestamp
}

// ============ DAILY STATS ============

export interface DailyStats {
  date: string // ISO date string
  averagePostureScore: number
  timeInGoodPosture: number // milliseconds
  questsCompleted: number
  xpEarned: number
  achievements: string[] // Achievement IDs unlocked today
  streakMaintained: boolean
}

// ============ USER PROFILE ============

export interface UserProfile {
  userId: string
  displayName: string
  createdAt: number // timestamp
  pet: PetState
  stats: PlayerStats
  achievements: Achievement[]
  dailyStats: DailyStats[]
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  soundEnabled: boolean
  breakReminders: boolean
  breakReminderInterval: number // minutes
  targetHoursPerDay: number
  theme: 'light' | 'dark' | 'auto'
}

// ============ GAME SESSION ============

export interface GameSession {
  sessionId: string
  startTime: number // timestamp
  endTime?: number // timestamp
  duration: number // milliseconds
  averageScore: number
  questsCompleted: number
  xpEarned: number
  streakMaintained: boolean
}

// ============ LEADERBOARD ============

export interface LeaderboardEntry {
  userId: string
  displayName: string
  petEvolution: string
  level: number
  totalXP: number
  currentStreak: number
  rank: number
}

// ============ NOTIFICATION ============

export interface GameNotification {
  id: string
  type: 'achievement' | 'quest-complete' | 'level-up' | 'streak' | 'reminder'
  title: string
  message: string
  timestamp: number
  read: boolean
  actionText?: string
  actionHandler?: () => void
}