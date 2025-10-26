/**
 * AI Types
 * Types for AI-powered features
 */

import type { PostureSnapshot, PostureMetrics } from './posture.types'
import type { Quest } from './game.types'

// ============ PERSONALIZATION ============

export interface UserBaseline {
  userId: string
  createdAt: number // timestamp
  calibrationData: {
    idealHeadForward: number
    idealShoulderWidth: number
    neutralSpineCurvature: number
  }
  adaptiveThresholds: {
    excellent: number // Score threshold
    good: number
    warning: number
  }
  personalityProfile: {
    motivationStyle: 'competitive' | 'cooperative' | 'personal-best'
    reminderPreference: 'frequent' | 'moderate' | 'minimal'
    questDifficulty: 'easy' | 'medium' | 'hard'
  }
}

// ============ FATIGUE DETECTION ============

export interface FatigueState {
  level: number // 0-100
  indicators: {
    microMovements: number // Fidgeting frequency
    scoreDegrade: number // Rate of score decline
    timeSitting: number // Minutes since last break
    postureVariability: number // How much posture varies
  }
  recommendation: {
    shouldBreak: boolean
    breakType: 'micro' | 'short' | 'long'
    urgency: 'low' | 'medium' | 'high'
    suggestedQuest?: Quest
  }
  timestamp: number
}

// ============ PATTERN RECOGNITION ============

export interface BehaviorPattern {
  patternId: string
  name: string
  description: string
  confidence: number // 0-100
  frequency: {
    timesPerDay: number
    timesPerWeek: number
    daysActive: number
  }
  timePattern: {
    preferredHours: number[] // Hours of day 0-23
    preferredDays: number[] // Days of week 0-6
  }
  characteristics: {
    averageScore: number
    commonIssues: string[]
    triggers: string[]
  }
  impact: 'positive' | 'negative' | 'neutral'
}

export interface PatternInsight {
  insightId: string
  pattern: BehaviorPattern
  insight: string
  recommendation: string
  evidence: PostureSnapshot[]
  actionable: boolean
  priority: 'low' | 'medium' | 'high'
  timestamp: number
}

// ============ RECOMMENDATION ENGINE ============

export interface Recommendation {
  recommendationId: string
  type: 'quest' | 'break' | 'adjustment' | 'tip'
  title: string
  description: string
  reasoning: string
  confidence: number // 0-100
  priority: 'low' | 'medium' | 'high'
  expectedImpact: {
    scoreImprovement: number // Expected points
    fatigueReduction: number // 0-100
  }
  suggestedTiming: {
    immediate: boolean
    preferredTime?: number // Hour of day
    duration: number // minutes
  }
  quest?: Quest
  timestamp: number
}

// ============ LEARNING & ADAPTATION ============

export interface LearningModel {
  userId: string
  version: string
  lastUpdated: number // timestamp
  parameters: {
    sensitivityLevel: number // How strict scoring is
    adaptationRate: number // How quickly thresholds adjust
    personalizationFactor: number // How much to personalize
  }
  performance: {
    accuracy: number // 0-100
    falsePositiveRate: number
    falseNegativeRate: number
    userSatisfaction: number // Based on feedback
  }
  trainingData: {
    sampleCount: number
    lastSampleDate: number
  }
}

// ============ SMART NOTIFICATIONS ============

export interface SmartNotification {
  notificationId: string
  type: 'reminder' | 'achievement' | 'insight' | 'warning' | 'tip'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timing: {
    scheduledFor: number // timestamp
    expiresAt: number // timestamp
    repeating: boolean
    frequency?: 'daily' | 'weekly' | 'custom'
  }
  personalization: {
    basedOnPattern: boolean
    patternId?: string
    relevanceScore: number // 0-100
  }
  action?: {
    label: string
    type: 'open-quest' | 'view-stats' | 'adjust-settings'
    payload?: any
  }
  delivered: boolean
  read: boolean
  userFeedback?: 'helpful' | 'not-helpful' | 'annoying'
}

// ============ PREDICTIVE ANALYTICS ============

export interface Prediction {
  predictionId: string
  type: 'score' | 'fatigue' | 'streak' | 'milestone'
  timeframe: 'next-hour' | 'today' | 'this-week'
  prediction: {
    value: number
    confidence: number // 0-100
    range: {
      min: number
      max: number
    }
  }
  factors: {
    name: string
    impact: number // -100 to 100
  }[]
  recommendation?: string
  timestamp: number
}

// ============ COACHING & FEEDBACK ============

export interface CoachingMessage {
  messageId: string
  category: 'encouragement' | 'correction' | 'education' | 'celebration'
  message: string
  tone: 'supportive' | 'motivational' | 'informative' | 'congratulatory'
  timing: 'immediate' | 'delayed' | 'scheduled'
  context: {
    currentScore: number
    recentTrend: 'improving' | 'declining' | 'stable'
    userMood?: 'positive' | 'neutral' | 'negative'
  }
  personalized: boolean
  timestamp: number
}

// ============ GOAL SETTING ============

export interface SmartGoal {
  goalId: string
  type: 'score' | 'streak' | 'quests' | 'time'
  title: string
  description: string
  target: number
  current: number
  deadline: number // timestamp
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive'
  aiGenerated: boolean
  reasoning?: string
  milestones: {
    percentage: number
    reached: boolean
    reachedAt?: number
  }[]
  status: 'active' | 'completed' | 'failed' | 'abandoned'
  rewards: {
    xp: number
    achievements?: string[]
  }
}

// ============ CONTEXT AWARENESS ============

export interface UserContext {
  timestamp: number
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: number // 0-6
  sessionDuration: number // minutes
  recentActivity: {
    lastBreak: number // timestamp
    questsToday: number
    currentStreak: number
  }
  currentState: {
    fatigueLevel: number
    postureScore: number
    focusLevel?: number // If trackable
  }
  environment?: {
    location: 'home' | 'office' | 'other'
    lighting: 'good' | 'poor'
    ergonomics: 'good' | 'needs-improvement'
  }
}