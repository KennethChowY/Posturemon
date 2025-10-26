/**
 * Posture Types
 * Types for pose detection and posture analysis
 */

// ============ POSE LANDMARKS ============

export interface Landmark {
  x: number // Normalized 0-1
  y: number // Normalized 0-1
  z: number // Depth (relative)
  visibility?: number // 0-1
}

export interface PoseLandmarks {
  nose: Landmark
  leftEye: Landmark
  rightEye: Landmark
  leftEar: Landmark
  rightEar: Landmark
  leftShoulder: Landmark
  rightShoulder: Landmark
  leftElbow: Landmark
  rightElbow: Landmark
  leftWrist: Landmark
  rightWrist: Landmark
  leftHip: Landmark
  rightHip: Landmark
}

// ============ POSTURE METRICS ============

export interface PostureMetrics {
  // Head position
  headForward: number // Distance forward from shoulders (cm)
  headTilt: number // Left/right tilt (degrees)
  
  // Shoulder alignment
  shoulderAlignment: number // Degrees from level
  shoulderWidth: number // Distance between shoulders (cm)
  shoulderRoundedness: number // 0-100 score
  
  // Spine
  spineCurvature: number // Degrees of forward bend
  spineAlignment: number // Left/right deviation (degrees)
  
  // Overall
  symmetry: number // 0-100 score (left vs right balance)
}

// ============ POSTURE SCORE ============

export interface PostureScore {
  overall: number // 0-100
  breakdown: {
    head: number // 0-100
    shoulders: number // 0-100
    spine: number // 0-100
    symmetry: number // 0-100
  }
  status: 'good' | 'warning' | 'bad' | 'unknown'
  confidence: number // 0-100
}

// ============ POSTURE SNAPSHOT ============

export interface PostureSnapshot {
  timestamp: number
  landmarks: PoseLandmarks
  metrics: PostureMetrics
  score: PostureScore
}

// ============ CALIBRATION DATA ============

export interface CalibrationData {
  userId: string
  calibratedAt: number // timestamp
  duration: number // milliseconds
  samples: PostureSnapshot[]
  baseline: {
    headForward: number
    shoulderWidth: number
    neutralSpineCurvature: number
  }
  thresholds: {
    good: number // Overall score threshold
    warning: number
    bad: number
  }
}

// ============ DETECTION STATE ============

export interface DetectionState {
  isActive: boolean
  isCalibrated: boolean
  cameraConnected: boolean
  lastDetection: number // timestamp
  fps: number
  errorCount: number
  lastError?: string
}

// ============ HISTORY & ANALYTICS ============

export interface PostureHistory {
  date: string // ISO date
  snapshots: PostureSnapshot[]
  summary: {
    averageScore: number
    timeInGoodPosture: number // milliseconds
    timeInBadPosture: number // milliseconds
    worstPeriods: TimeRange[]
    bestPeriods: TimeRange[]
  }
}

export interface TimeRange {
  start: number // timestamp
  end: number // timestamp
  averageScore: number
}

// ============ REAL-TIME FEEDBACK ============

export interface PostureFeedback {
  type: 'good' | 'warning' | 'bad' | 'improvement' | 'degradation'
  message: string
  suggestions: string[]
  urgency: 'low' | 'medium' | 'high'
  timestamp: number
}

// ============ POSTURE PATTERNS ============

export interface PosturePattern {
  patternId: string
  name: string
  description: string
  timeOfDay: {
    start: number // Hour 0-23
    end: number // Hour 0-23
  }
  averageScore: number
  frequency: number // Times per week
  commonIssues: string[]
}

// ============ INSIGHTS ============

export interface PostureInsight {
  insightId: string
  type: 'positive' | 'concern' | 'suggestion' | 'milestone'
  title: string
  description: string
  dataPoints: number[]
  trend: 'improving' | 'declining' | 'stable'
  actionable: boolean
  recommendedActions?: string[]
  timestamp: number
}