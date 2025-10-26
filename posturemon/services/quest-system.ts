/**
 * Quest System
 * Defines all quests and manages quest logic
 */

import type { Quest } from '@/types/game.types'
import { GAME_CONFIG, QUEST_TYPES } from '@/lib/constants'

// ============ QUEST DEFINITIONS ============

export const QUESTS: Record<string, Quest> = {
  'micro-break': {
    questId: 'micro-break',
    type: 'micro-break',
    title: 'Quick Reset',
    description: 'A 60-second breathing and shoulder reset',
    difficulty: 'easy',
    duration: 60,
    phases: [
      {
        phaseId: 'breathing',
        name: 'Box Breathing',
        description: 'Breathe in, hold, breathe out',
        duration: 30,
        instructions: [
          'Breathe in for 4 seconds',
          'Hold for 4 seconds',
          'Breathe out for 4 seconds',
          'Repeat',
        ],
        requiresValidation: false,
        successMessage: 'Great breathing!',
      },
      {
        phaseId: 'shoulders',
        name: 'Shoulder Reset',
        description: 'Roll and stretch your shoulders',
        duration: 30,
        instructions: [
          'Roll shoulders backward 5 times',
          'Roll shoulders forward 5 times',
          'Stretch neck side to side',
          'Take a deep breath',
        ],
        requiresValidation: false,
        successMessage: 'Shoulders reset!',
      },
    ],
    rewards: {
      xp: GAME_CONFIG.QUEST_BASE_XP,
    },
    timesCompleted: 0,
    aiRecommended: false,
  },
  
  'breathing': {
    questId: 'breathing',
    type: 'breathing',
    title: 'Deep Breathing',
    description: 'Extended breathing exercise for focus',
    difficulty: 'easy',
    duration: 120,
    phases: [
      {
        phaseId: 'breathing-1',
        name: 'Box Breathing',
        description: '2 minutes of focused breathing',
        duration: 120,
        instructions: [
          'Find a comfortable position',
          'Breathe in for 4 seconds',
          'Hold for 4 seconds',
          'Breathe out for 4 seconds',
          'Hold for 4 seconds',
          'Repeat',
        ],
        requiresValidation: false,
        successMessage: 'Excellent breathing!',
      },
    ],
    rewards: {
      xp: 40,
    },
    timesCompleted: 0,
    aiRecommended: false,
  },
  
  'neck-relief': {
    questId: 'neck-relief',
    type: 'stretching',
    title: 'Neck Relief',
    description: 'Gentle neck stretches to relieve tension',
    difficulty: 'easy',
    duration: 180,
    phases: [
      {
        phaseId: 'neck-1',
        name: 'Neck Stretches',
        description: 'Gentle side-to-side stretches',
        duration: 180,
        instructions: [
          'Tilt head to left shoulder, hold 10 seconds',
          'Tilt head to right shoulder, hold 10 seconds',
          'Look over left shoulder, hold 10 seconds',
          'Look over right shoulder, hold 10 seconds',
          'Roll head gently in circles',
          'Repeat sequence',
        ],
        requiresValidation: false,
        successMessage: 'Neck tension relieved!',
      },
    ],
    rewards: {
      xp: 45,
    },
    timesCompleted: 0,
    aiRecommended: true,
  },
  
  'shoulder-openers': {
    questId: 'shoulder-openers',
    type: 'stretching',
    title: 'Shoulder Openers',
    description: 'Stretches to open rounded shoulders',
    difficulty: 'medium',
    duration: 180,
    phases: [
      {
        phaseId: 'shoulders-1',
        name: 'Shoulder Stretches',
        description: 'Open up your chest and shoulders',
        duration: 180,
        instructions: [
          'Clasp hands behind back, straighten arms',
          'Lift arms away from body, hold 15 seconds',
          'Roll shoulders back 10 times',
          'Doorway stretch: arms on frame, lean forward',
          'Hold for 30 seconds',
          'Rest and repeat',
        ],
        requiresValidation: false,
        successMessage: 'Shoulders opened!',
      },
    ],
    rewards: {
      xp: 55,
    },
    timesCompleted: 0,
    aiRecommended: true,
  },
  
  'full-reset': {
    questId: 'full-reset',
    type: 'movement',
    title: 'Full Body Reset',
    description: 'Complete 5-minute break with multiple exercises',
    difficulty: 'hard',
    duration: 300,
    phases: [
      {
        phaseId: 'breathing-phase',
        name: 'Breathing',
        description: 'Start with deep breathing',
        duration: 60,
        instructions: ['Box breathing for 1 minute'],
        requiresValidation: false,
        successMessage: 'Breathing complete!',
      },
      {
        phaseId: 'neck-phase',
        name: 'Neck',
        description: 'Neck stretches',
        duration: 60,
        instructions: ['Gentle neck stretches'],
        requiresValidation: false,
        successMessage: 'Neck complete!',
      },
      {
        phaseId: 'shoulder-phase',
        name: 'Shoulders',
        description: 'Shoulder rolls and stretches',
        duration: 60,
        instructions: ['Shoulder exercises'],
        requiresValidation: false,
        successMessage: 'Shoulders complete!',
      },
      {
        phaseId: 'standing-phase',
        name: 'Standing',
        description: 'Stand and stretch',
        duration: 60,
        instructions: ['Stand up, reach for the sky', 'Side bends', 'Gentle twists'],
        requiresValidation: false,
        successMessage: 'Standing complete!',
      },
      {
        phaseId: 'core-phase',
        name: 'Core',
        description: 'Gentle core activation',
        duration: 60,
        instructions: ['Seated spinal twists', 'Gentle core engagement'],
        requiresValidation: false,
        successMessage: 'Core complete!',
      },
    ],
    rewards: {
      xp: 80,
      bonus: {
        type: 'perfect-score',
        multiplier: 1.5,
      },
    },
    timesCompleted: 0,
    aiRecommended: false,
  },
}

// ============ QUEST HELPERS ============

/**
 * Get all available quests
 */
export function getAllQuests(): Quest[] {
  return Object.values(QUESTS)
}

/**
 * Get quest by ID
 */
export function getQuestById(questId: string): Quest | undefined {
  return QUESTS[questId]
}

/**
 * Get quests by difficulty
 */
export function getQuestsByDifficulty(difficulty: Quest['difficulty']): Quest[] {
  return getAllQuests().filter((quest) => quest.difficulty === difficulty)
}

/**
 * Get quests by type
 */
export function getQuestsByType(type: Quest['type']): Quest[] {
  return getAllQuests().filter((quest) => quest.type === type)
}

/**
 * Get recommended quests (AI-recommended)
 */
export function getRecommendedQuests(): Quest[] {
  return getAllQuests().filter((quest) => quest.aiRecommended)
}

/**
 * Calculate XP for quest with bonuses
 */
export function calculateQuestXP(
  quest: Quest,
  options: {
    perfectScore?: boolean
    speedBonus?: boolean
    streakBonus?: number
  } = {}
): number {
  let totalXP = quest.rewards.xp
  
  // Perfect score bonus
  if (options.perfectScore && quest.rewards.bonus?.type === 'perfect-score') {
    totalXP *= quest.rewards.bonus.multiplier
  }
  
  // Speed bonus
  if (options.speedBonus) {
    totalXP += 10
  }
  
  // Streak bonus
  if (options.streakBonus && options.streakBonus >= 5) {
    totalXP += 5
  }
  
  return Math.floor(totalXP)
}

/**
 * Check if quest requirements are met
 */
export function canStartQuest(quest: Quest, playerLevel: number, completedQuests: string[]): boolean {
  // Check level requirement
  if (quest.requirements?.minLevel && playerLevel < quest.requirements.minLevel) {
    return false
  }
  
  // Check prerequisite quests
  if (quest.requirements?.completedQuests) {
    const hasPrerequisites = quest.requirements.completedQuests.every((reqQuestId) =>
      completedQuests.includes(reqQuestId)
    )
    if (!hasPrerequisites) {
      return false
    }
  }
  
  return true
}

/**
 * Get next suggested quest based on user progress
 */
export function getNextQuest(playerLevel: number, completedQuestsCount: number): Quest {
  // Beginner: micro-break
  if (completedQuestsCount < 3) {
    return QUESTS['micro-break']
  }
  
  // Early: breathing
  if (completedQuestsCount < 10) {
    return QUESTS['breathing']
  }
  
  // Mid: neck relief or shoulder openers
  if (completedQuestsCount < 20) {
    return Math.random() > 0.5 ? QUESTS['neck-relief'] : QUESTS['shoulder-openers']
  }
  
  // Advanced: full reset
  return QUESTS['full-reset']
}

/**
 * Update quest completion count
 */
export function markQuestComplete(questId: string): void {
  const quest = QUESTS[questId]
  if (quest) {
    quest.timesCompleted += 1
    quest.lastCompleted = Date.now()
  }
}