/**
 * Achievement System
 * Defines all achievements and tracks progress
 */

import type { Achievement, PlayerStats } from '@/types/game.types'

// ============ ACHIEVEMENT DEFINITIONS ============

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    achievementId: 'first-quest',
    category: 'quests',
    rarity: 'common',
    name: 'First Quest',
    description: 'Complete your first micro-break quest',
    icon: '🏆',
    requirements: {
      type: 'quests-completed',
      target: 1,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 50,
    },
    hidden: false,
    showcase: false,
  },
  
  {
    achievementId: 'early-bird',
    category: 'special',
    rarity: 'uncommon',
    name: 'Early Bird',
    description: 'Complete a quest before 9 AM',
    icon: '🌅',
    requirements: {
      type: 'quest-time',
      target: 1,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 25,
    },
    hidden: false,
    showcase: false,
  },
  
  // Streak Achievements
  {
    achievementId: '3-day-streak',
    category: 'streaks',
    rarity: 'common',
    name: '3-Day Streak',
    description: 'Maintain good posture for 3 consecutive days',
    icon: '🔥',
    requirements: {
      type: 'streak',
      target: 3,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 100,
    },
    hidden: false,
    showcase: false,
  },
  
  {
    achievementId: 'week-warrior',
    category: 'streaks',
    rarity: 'rare',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⭐',
    requirements: {
      type: 'streak',
      target: 7,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 250,
      petUnlocks: ['rainbow-color'],
    },
    hidden: false,
    showcase: true,
  },
  
  {
    achievementId: 'consistency-king',
    category: 'streaks',
    rarity: 'epic',
    name: 'Consistency King',
    description: 'Achieve a 30-day streak',
    icon: '👑',
    requirements: {
      type: 'streak',
      target: 30,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 1000,
      petUnlocks: ['crown-accessory'],
      title: 'Posture King',
    },
    hidden: false,
    showcase: true,
  },
  
  // Quest Achievements
  {
    achievementId: 'quest-novice',
    category: 'quests',
    rarity: 'common',
    name: 'Quest Novice',
    description: 'Complete 10 quests',
    icon: '🎯',
    requirements: {
      type: 'quests-completed',
      target: 10,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 200,
    },
    hidden: false,
    showcase: false,
  },
  
  {
    achievementId: 'quest-master',
    category: 'quests',
    rarity: 'rare',
    name: 'Quest Master',
    description: 'Complete 50 quests',
    icon: '⚔️',
    requirements: {
      type: 'quests-completed',
      target: 50,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 500,
      petUnlocks: ['warrior-helmet'],
    },
    hidden: false,
    showcase: true,
  },
  
  {
    achievementId: 'centurion',
    category: 'quests',
    rarity: 'epic',
    name: 'Centurion',
    description: 'Complete 100 quests',
    icon: '💯',
    requirements: {
      type: 'quests-completed',
      target: 100,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 1500,
      petUnlocks: ['golden-armor'],
    },
    hidden: false,
    showcase: true,
  },
  
  // Posture Achievements
  {
    achievementId: 'perfect-posture',
    category: 'posture',
    rarity: 'rare',
    name: 'Perfect Posture',
    description: 'Maintain 95+ posture score for 1 hour',
    icon: '✨',
    requirements: {
      type: 'perfect-hour',
      target: 1,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 300,
    },
    hidden: false,
    showcase: false,
  },
  
  {
    achievementId: 'perfect-day',
    category: 'posture',
    rarity: 'epic',
    name: 'Perfect Day',
    description: 'Average 90+ posture score for an entire day',
    icon: '🌟',
    requirements: {
      type: 'perfect-day',
      target: 1,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 500,
      petUnlocks: ['halo'],
    },
    hidden: false,
    showcase: true,
  },
  
  // Milestone Achievements
  {
    achievementId: 'level-5',
    category: 'milestones',
    rarity: 'common',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '💎',
    requirements: {
      type: 'level',
      target: 5,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 100,
    },
    hidden: false,
    showcase: false,
  },
  
  {
    achievementId: 'level-10',
    category: 'milestones',
    rarity: 'rare',
    name: 'Posture Pro',
    description: 'Reach level 10',
    icon: '🚀',
    requirements: {
      type: 'level',
      target: 10,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 250,
      petUnlocks: ['pro-badge'],
    },
    hidden: false,
    showcase: true,
  },
  
  {
    achievementId: 'level-20',
    category: 'milestones',
    rarity: 'epic',
    name: 'Posture Legend',
    description: 'Reach level 20',
    icon: '🏅',
    requirements: {
      type: 'level',
      target: 20,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 1000,
      petUnlocks: ['legendary-aura'],
    },
    hidden: false,
    showcase: true,
  },
  
  // Secret Achievements
  {
    achievementId: 'night-owl',
    category: 'special',
    rarity: 'uncommon',
    name: 'Night Owl',
    description: 'Complete a quest after 10 PM',
    icon: '🦉',
    requirements: {
      type: 'quest-time',
      target: 1,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 25,
    },
    hidden: true,
    showcase: false,
  },
  
  {
    achievementId: 'weekend-warrior',
    category: 'special',
    rarity: 'rare',
    name: 'Weekend Warrior',
    description: 'Complete quests on both Saturday and Sunday',
    icon: '🏖️',
    requirements: {
      type: 'weekend-quests',
      target: 2,
      current: 0,
    },
    unlocked: false,
    progress: 0,
    rewards: {
      xp: 100,
    },
    hidden: true,
    showcase: false,
  },
]

// ============ ACHIEVEMENT HELPERS ============

/**
 * Get all achievements
 */
export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENTS
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category)
}

/**
 * Get unlocked achievements
 */
export function getUnlockedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.unlocked)
}

/**
 * Get locked achievements (excluding hidden ones not yet revealed)
 */
export function getLockedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => !achievement.unlocked && !achievement.hidden)
}

/**
 * Check and update achievement progress
 */
export function updateAchievementProgress(
  achievementId: string,
  playerStats: PlayerStats
): Achievement | null {
  const achievement = ACHIEVEMENTS.find((a) => a.achievementId === achievementId)
  if (!achievement || achievement.unlocked) return null
  
  // Update progress based on requirement type
  switch (achievement.requirements.type) {
    case 'quests-completed':
      achievement.requirements.current = playerStats.totalQuestsCompleted
      break
    case 'streak':
      achievement.requirements.current = playerStats.currentStreak
      break
    case 'level':
      achievement.requirements.current = playerStats.level
      break
  }
  
  // Calculate progress percentage
  achievement.progress = Math.min(
    100,
    (achievement.requirements.current / achievement.requirements.target) * 100
  )
  
  // Check if unlocked
  if (achievement.requirements.current >= achievement.requirements.target) {
    achievement.unlocked = true
    achievement.unlockedAt = Date.now()
    return achievement
  }
  
  return null
}

/**
 * Check all achievements and return newly unlocked ones
 */
export function checkAchievements(playerStats: PlayerStats): Achievement[] {
  const newlyUnlocked: Achievement[] = []
  
  ACHIEVEMENTS.forEach((achievement) => {
    if (achievement.unlocked) return
    
    const unlocked = updateAchievementProgress(achievement.achievementId, playerStats)
    if (unlocked) {
      newlyUnlocked.push(unlocked)
    }
  })
  
  return newlyUnlocked
}

/**
 * Get achievement by ID
 */
export function getAchievementById(achievementId: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.achievementId === achievementId)
}

/**
 * Get showcased achievements (for profile display)
 */
export function getShowcaseAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.showcase && a.unlocked)
}

/**
 * Calculate total XP from achievements
 */
export function getTotalAchievementXP(): number {
  return ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.rewards.xp, 0)
}

/**
 * Get achievement completion percentage
 */
export function getAchievementCompletionRate(): number {
  const total = ACHIEVEMENTS.filter((a) => !a.hidden).length
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked && !a.hidden).length
  return Math.round((unlocked / total) * 100)
}