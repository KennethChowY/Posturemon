/**
 * Posture Store - Zustand State Management
 * This is the BRAIN of your app - all state lives here
 * Fixed for React 19 / Next.js 16 compatibility
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PetState, Quest, Achievement, PlayerStats } from '@/types/game.types'
import type { PostureSnapshot, PostureScore } from '@/types/posture.types'
import { GAME_CONFIG, POSTURE_CONFIG } from '@/lib/constants'

// ============ STATE INTERFACE ============

interface PostureStore {
  // ===== POSTURE DATA =====
  currentPosture: PostureSnapshot | null
  postureHistory: PostureSnapshot[]
  
  // ===== CAMERA & DETECTION =====
  cameraConnected: boolean
  isCalibrated: boolean
  calibrating: boolean
  
  // ===== PET STATE =====
  pet: PetState
  
  // ===== GAME STATE =====
  player: {
    level: number
    xp: number
    totalXP: number
    streak: number
    questsCompleted: number
  }
  
  // ===== ACTIVE QUEST =====
  activeQuest: Quest | null
  questProgress: number // 0-100
  
  // ===== ACHIEVEMENTS =====
  achievements: Achievement[]
  
  // ===== SESSION =====
  sessionStarted: number
  lastActive: number
  
  // ===== ACTIONS =====
  // Posture actions
  updatePosture: (snapshot: PostureSnapshot) => void
  addToHistory: (snapshot: PostureSnapshot) => void
  clearHistory: () => void
  
  // Camera actions
  connectCamera: () => void
  disconnectCamera: () => void
  setCalibrated: (value: boolean) => void
  
  // Pet actions
  updatePetMood: (mood: PetState['mood']) => void
  feedPet: () => void
  
  // Game actions
  addXP: (amount: number) => void
  completeQuest: (xpEarned: number) => void
  incrementStreak: () => void
  
  // Quest actions
  startQuest: (quest: Quest) => void
  updateQuestProgress: (progress: number) => void
  endQuest: () => void
  
  // Achievement actions
  unlockAchievement: (achievementId: string) => void
  
  // Utility actions
  reset: () => void
}

// ============ INITIAL STATE ============

const initialPetState: PetState = {
  id: 'pet-1',
  name: 'Posturo',
  mood: 'neutral',
  evolution: 'egg',
  level: 1,
  health: 100,
  happiness: 80,
  energy: 100,
  appearance: {
    color: '#8B5CF6', // Purple
  },
  bondLevel: 0,
  timeOwned: 0,
  interactionsCount: 0,
  currentAnimation: 'idle',
  lastAction: Date.now(),
}

const initialPlayerState = {
  level: 1,
  xp: 0,
  totalXP: 0,
  streak: 0,
  questsCompleted: 0,
}

// ============ HELPER FUNCTIONS ============

/**
 * Calculate level from total XP
 */
function getLevelFromXP(totalXP: number): number {
  const BASE = GAME_CONFIG.BASE_XP_PER_LEVEL
  const SCALE = GAME_CONFIG.XP_SCALING_FACTOR
  
  let level = 1
  let xpRequired = BASE
  
  while (totalXP >= xpRequired) {
    level++
    xpRequired += BASE * Math.pow(SCALE, level - 2)
  }
  
  return level
}

/**
 * Calculate XP needed for next level
 */
function getXPForNextLevel(level: number): number {
  return GAME_CONFIG.BASE_XP_PER_LEVEL * Math.pow(GAME_CONFIG.XP_SCALING_FACTOR, level - 1)
}

/**
 * Get pet evolution based on level
 */
function getPetEvolution(level: number): PetState['evolution'] {
  if (level >= 35) return 'legendary'
  if (level >= 20) return 'master'
  if (level >= 10) return 'adult'
  if (level >= 5) return 'juvenile'
  if (level >= 2) return 'baby'
  return 'egg'
}

/**
 * Get pet mood from posture score
 */
function getMoodFromScore(score: number): PetState['mood'] {
  if (score >= POSTURE_CONFIG.EXCELLENT_THRESHOLD) return 'cheerful'
  if (score >= POSTURE_CONFIG.GOOD_THRESHOLD) return 'happy'
  if (score >= POSTURE_CONFIG.WARNING_THRESHOLD) return 'worried'
  return 'sad'
}

// ============ CREATE STORE ============

export const usePostureStore = create<PostureStore>()(
  persist(
    (set, get) => ({
      // ===== INITIAL STATE =====
      currentPosture: null,
      postureHistory: [],
      cameraConnected: false,
      isCalibrated: false,
      calibrating: false,
      pet: initialPetState,
      player: initialPlayerState,
      activeQuest: null,
      questProgress: 0,
      achievements: [],
      sessionStarted: Date.now(),
      lastActive: Date.now(),
      
      // ===== POSTURE ACTIONS =====
      
      updatePosture: (snapshot) => {
        set({ 
          currentPosture: snapshot,
          lastActive: Date.now(),
        })
        
        // Update pet mood based on score
        if (snapshot.score) {
          const mood = getMoodFromScore(snapshot.score.overall)
          get().updatePetMood(mood)
        }
        
        // Add to history
        get().addToHistory(snapshot)
      },
      
      addToHistory: (snapshot) => {
        set((state) => {
          const newHistory = [...state.postureHistory, snapshot]
          
          // Keep only last 300 points (5 minutes at 1/sec)
          if (newHistory.length > POSTURE_CONFIG.MAX_HISTORY_POINTS) {
            newHistory.shift()
          }
          
          return { postureHistory: newHistory }
        })
      },
      
      clearHistory: () => set({ postureHistory: [] }),
      
      // ===== CAMERA ACTIONS =====
      
      connectCamera: () => set({
        cameraConnected: true,
      }),
      
      disconnectCamera: () => set({ 
        cameraConnected: false,
        currentPosture: null,
      }),
      
      setCalibrated: (value) => set({
        isCalibrated: value,
        calibrating: false,
      }),
      
      // ===== PET ACTIONS =====
      
      updatePetMood: (mood) => {
        set((state) => ({
          pet: {
            ...state.pet,
            mood,
            lastAction: Date.now(),
          },
        }))
      },
      
      feedPet: () => {
        set((state) => ({
          pet: {
            ...state.pet,
            happiness: Math.min(100, state.pet.happiness + 10),
            interactionsCount: state.pet.interactionsCount + 1,
          },
        }))
      },
      
      // ===== GAME ACTIONS =====
      
      addXP: (amount) => {
        set((state) => {
          const newTotalXP = state.player.totalXP + amount
          const newLevel = getLevelFromXP(newTotalXP)
          const xpForCurrentLevel = getXPForNextLevel(newLevel - 1)
          const xpForNextLevel = getXPForNextLevel(newLevel)
          const currentLevelXP = newTotalXP - xpForCurrentLevel
          
          // Check if leveled up
          const leveledUp = newLevel > state.player.level
          
          // Update pet evolution if leveled up
          const newEvolution = leveledUp ? getPetEvolution(newLevel) : state.pet.evolution
          
          return {
            player: {
              ...state.player,
              xp: currentLevelXP,
              totalXP: newTotalXP,
              level: newLevel,
            },
            pet: {
              ...state.pet,
              level: newLevel,
              evolution: newEvolution,
              happiness: leveledUp ? 100 : state.pet.happiness, // Full happiness on level up
            },
          }
        })
      },
      
      completeQuest: (xpEarned) => {
        set((state) => ({
          player: {
            ...state.player,
            questsCompleted: state.player.questsCompleted + 1,
          },
          pet: {
            ...state.pet,
            happiness: Math.min(100, state.pet.happiness + GAME_CONFIG.HAPPINESS_GAIN_QUEST),
          },
        }))
        
        // Add XP
        get().addXP(xpEarned)
        
        // End quest
        get().endQuest()
      },
      
      incrementStreak: () => {
        set((state) => ({
          player: {
            ...state.player,
            streak: state.player.streak + 1,
          },
        }))
      },
      
      // ===== QUEST ACTIONS =====
      
      startQuest: (quest) => {
        set({ 
          activeQuest: quest,
          questProgress: 0,
        })
      },
      
      updateQuestProgress: (progress) => {
        set({ questProgress: Math.min(100, Math.max(0, progress)) })
      },
      
      endQuest: () => {
        set({ 
          activeQuest: null,
          questProgress: 0,
        })
      },
      
      // ===== ACHIEVEMENT ACTIONS =====
      
      unlockAchievement: (achievementId) => {
        set((state) => {
          const achievement = state.achievements.find((a) => a.achievementId === achievementId)
          
          if (!achievement || achievement.unlocked) {
            return state
          }
          
          const updatedAchievements = state.achievements.map((a) =>
            a.achievementId === achievementId
              ? { ...a, unlocked: true, unlockedAt: Date.now() }
              : a
          )
          
          return { achievements: updatedAchievements }
        })
      },
      
      // ===== UTILITY ACTIONS =====
      
      reset: () => {
        set({
          currentPosture: null,
          postureHistory: [],
          cameraConnected: false,
          isCalibrated: false,
          calibrating: false,
          pet: initialPetState,
          player: initialPlayerState,
          activeQuest: null,
          questProgress: 0,
          achievements: [],
          sessionStarted: Date.now(),
          lastActive: Date.now(),
        })
      },
    }),
    {
      name: 'posturemon-store', // LocalStorage key
      partialize: (state) => ({
        // Only persist these fields
        isCalibrated: state.isCalibrated,
        pet: state.pet,
        player: state.player,
        achievements: state.achievements,
      }),
    }
  )
)