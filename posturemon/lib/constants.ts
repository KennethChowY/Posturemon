/**
 * Game Configuration Constants
 */

// ============ GAME CONFIGURATION ============

export const GAME_CONFIG = {
  // XP and Leveling
  BASE_XP_PER_LEVEL: 100,
  XP_SCALING_FACTOR: 1.2,
  
  // Quest Rewards
  QUEST_BASE_XP: 50,
  QUEST_PERFECT_MULTIPLIER: 1.5,
  QUEST_SPEED_BONUS: 10,
  
  // Happiness
  HAPPINESS_GAIN_QUEST: 15,
  HAPPINESS_DECAY_RATE: 0.5, // per hour
  HAPPINESS_GAIN_GOOD_POSTURE: 2, // per minute
  
  // Energy
  ENERGY_DECAY_RATE: 1, // per hour
  ENERGY_GAIN_BREAK: 20,
  
  // Streaks
  STREAK_THRESHOLD_HOURS: 4, // Hours of good posture to count as a day
  STREAK_GRACE_PERIOD_DAYS: 1, // Days you can miss before losing streak
  
  // History
  MAX_HISTORY_POINTS: 300, // Store last 5 minutes at 1 sample/sec
} as const

// ============ POSTURE CONFIGURATION ============

export const POSTURE_CONFIG = {
  // Thresholds (0-100 score)
  EXCELLENT_THRESHOLD: 85,
  GOOD_THRESHOLD: 70,
  WARNING_THRESHOLD: 50,
  
  // Sampling
  SAMPLE_RATE_MS: 1000, // Sample posture every 1 second
  CALIBRATION_DURATION_MS: 60000, // 60 seconds
  
  // Detection
  MIN_CONFIDENCE: 0.5,
  MIN_VISIBILITY: 0.5,
  
  // History
  MAX_HISTORY_POINTS: 300, // 5 minutes at 1/sec
  
  // Metrics weights (must sum to 1.0)
  WEIGHTS: {
    headForward: 0.3,
    shoulderAlignment: 0.25,
    spineCurvature: 0.25,
    symmetry: 0.2,
  },
} as const

// ============ QUEST TYPES ============

export const QUEST_TYPES = {
  MICRO_BREAK: 'micro-break',
  BREATHING: 'breathing',
  STRETCHING: 'stretching',
  MOVEMENT: 'movement',
  POSTURE_CHECK: 'posture-check',
} as const

// ============ PET EVOLUTION STAGES ============

export const PET_EVOLUTIONS = {
  EGG: {
    name: 'Egg',
    minLevel: 1,
    size: 80,
  },
  BABY: {
    name: 'Baby',
    minLevel: 2,
    size: 100,
  },
  JUVENILE: {
    name: 'Juvenile',
    minLevel: 5,
    size: 120,
  },
  ADULT: {
    name: 'Adult',
    minLevel: 10,
    size: 140,
  },
  MASTER: {
    name: 'Master',
    minLevel: 20,
    size: 160,
  },
  LEGENDARY: {
    name: 'Legendary',
    minLevel: 35,
    size: 180,
  },
} as const

// ============ PET MOODS ============

export const PET_MOODS = {
  CHEERFUL: 'cheerful', // Score >= 85
  HAPPY: 'happy',       // Score >= 70
  NEUTRAL: 'neutral',   // Score >= 50
  WORRIED: 'worried',   // Score >= 30
  SAD: 'sad',           // Score < 30
  SLEEPING: 'sleeping', // No detection
} as const

// ============ ACHIEVEMENT CATEGORIES ============

export const ACHIEVEMENT_CATEGORIES = {
  QUESTS: 'quests',
  STREAKS: 'streaks',
  POSTURE: 'posture',
  MILESTONES: 'milestones',
  SPECIAL: 'special',
} as const

// ============ ACHIEVEMENT RARITIES ============

export const ACHIEVEMENT_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
} as const

// ============ POSE LANDMARK INDICES ============

export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const

// ============ TIME CONSTANTS ============

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

// ============ LOCAL STORAGE KEYS ============

export const STORAGE_KEYS = {
  GAME_STATE: 'posturemon-game-state',
  USER_PROFILE: 'posturemon-user-profile',
  SETTINGS: 'posturemon-settings',
  CALIBRATION: 'posturemon-calibration',
  STATISTICS: 'posturemon-statistics',
} as const

// ============ UI CONSTANTS ============

export const UI_CONFIG = {
  // Animation durations (ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
  
  // Notification durations (ms)
  NOTIFICATION_SHORT: 2000,
  NOTIFICATION_NORMAL: 4000,
  NOTIFICATION_LONG: 6000,
  
  // Chart colors
  CHART_COLORS: {
    excellent: '#22c55e', // green-500
    good: '#3b82f6',      // blue-500
    warning: '#f59e0b',   // amber-500
    bad: '#ef4444',       // red-500
  },
} as const

// ============ BROWSER STORAGE LIMITS ============

export const STORAGE_LIMITS = {
  MAX_HISTORY_DAYS: 30,
  MAX_SNAPSHOTS_PER_DAY: 28800, // 8 hours at 1/sec
  MAX_TOTAL_SNAPSHOTS: 100000,
} as const