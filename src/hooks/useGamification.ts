import { useEffect, useReducer, useCallback } from 'react'
import type {
  GamificationState,
  GamificationAction,
  Achievement,
  Challenge,
  Quest,
  UserProgress,
  GamificationEvent
} from '@/types/gamification'
import { emotionalIntelligence } from '@/lib/ai/emotionalIntelligence'
import { experienceEngine } from '@/lib/services/experienceEngine'
import { gamificationEngine } from '@/lib/services/gamificationEngine'
import { communityEngine } from '@/lib/services/communityEngine'

const initialState: GamificationState = {
  userId: '',
  progress: {
    level: 1,
    experience: 0,
    achievements: [],
    activeChallenges: [],
    completedChallenges: [],
    activeQuests: [],
    completedQuests: [],
    stats: []
  },
  config: {
    levelThresholds: [100, 250, 500, 1000, 2000, 4000, 8000, 16000],
    experienceMultipliers: [
      { category: 'financial', multiplier: 1.2 },
      { category: 'community', multiplier: 1.5 },
      { category: 'learning', multiplier: 1.3 },
      { category: 'impact', multiplier: 1.4 },
      { category: 'personal', multiplier: 1.1 }
    ],
    challengeFrequency: [
      { category: 'financial', daysInterval: 7 },
      { category: 'community', daysInterval: 14 },
      { category: 'learning', daysInterval: 10 },
      { category: 'impact', daysInterval: 30 },
      { category: 'personal', daysInterval: 5 }
    ],
    questDifficulty: [
      { level: 1, complexity: 1 },
      { level: 5, complexity: 1.5 },
      { level: 10, complexity: 2 },
      { level: 20, complexity: 2.5 },
      { level: 50, complexity: 3 }
    ]
  },
  events: []
}

function gamificationReducer(
  state: GamificationState,
  action: GamificationAction
): GamificationState {
  switch (action.type) {
    case 'UNLOCK_ACHIEVEMENT': {
      const achievement = action.achievement
      if (state.progress.achievements.some(a => a.id === achievement.id)) {
        return state
      }

      const event: GamificationEvent = {
        type: 'achievement_unlocked',
        timestamp: new Date().toISOString(),
        data: {
          userId: state.userId,
          achievement
        }
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          achievements: [...state.progress.achievements, achievement],
          experience: state.progress.experience + calculateExperienceGain(achievement, state)
        },
        events: [...state.events, event]
      }
    }

    case 'COMPLETE_CHALLENGE': {
      const challenge = action.challenge
      const activeChallenges = state.progress.activeChallenges.filter(
        c => c.id !== challenge.id
      )

      const event: GamificationEvent = {
        type: 'challenge_completed',
        timestamp: new Date().toISOString(),
        data: {
          userId: state.userId,
          challenge
        }
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          activeChallenges,
          completedChallenges: [...state.progress.completedChallenges, challenge],
          experience:
            state.progress.experience + calculateExperienceGain(challenge, state)
        },
        events: [...state.events, event]
      }
    }

    case 'PROGRESS_QUEST': {
      const { quest, progress } = action
      const activeQuests = state.progress.activeQuests.map(q =>
        q.id === quest.id ? { ...q, progress } : q
      )

      const event: GamificationEvent = {
        type: 'quest_progress',
        timestamp: new Date().toISOString(),
        data: {
          userId: state.userId,
          quest: { ...quest, progress }
        }
      }

      if (progress >= 100) {
        return {
          ...state,
          progress: {
            ...state.progress,
            activeQuests: activeQuests.filter(q => q.id !== quest.id),
            completedQuests: [...state.progress.completedQuests, { ...quest, progress: 100 }],
            experience:
              state.progress.experience + calculateExperienceGain(quest, state)
          },
          events: [...state.events, event]
        }
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          activeQuests
        },
        events: [...state.events, event]
      }
    }

    case 'GAIN_EXPERIENCE': {
      const newExperience = state.progress.experience + action.amount
      const currentLevel = state.progress.level
      const newLevel = calculateLevel(newExperience, state.config.levelThresholds)

      if (newLevel > currentLevel) {
        const event: GamificationEvent = {
          type: 'level_up',
          timestamp: new Date().toISOString(),
          data: {
            userId: state.userId,
            level: newLevel,
            experience: newExperience
          }
        }

        return {
          ...state,
          progress: {
            ...state.progress,
            level: newLevel,
            experience: newExperience
          },
          events: [...state.events, event]
        }
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          experience: newExperience
        }
      }
    }

    case 'LEVEL_UP': {
      const event: GamificationEvent = {
        type: 'level_up',
        timestamp: new Date().toISOString(),
        data: {
          userId: state.userId,
          level: state.progress.level + 1
        }
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          level: state.progress.level + 1
        },
        events: [...state.events, event]
      }
    }

    case 'UPDATE_STATS': {
      return {
        ...state,
        progress: {
          ...state.progress,
          stats: action.stats
        }
      }
    }

    default:
      return state
  }
}

function calculateExperienceGain(
  item: Achievement | Challenge | Quest,
  state: GamificationState
): number {
  const baseExperience = 'difficulty' in item ? getDifficultyMultiplier(item.difficulty) : 100
  const categoryMultiplier =
    state.config.experienceMultipliers.find(m => m.category === item.category)?.multiplier || 1

  return Math.round(baseExperience * categoryMultiplier)
}

function getDifficultyMultiplier(difficulty: Achievement['difficulty']): number {
  switch (difficulty) {
    case 'beginner':
      return 50
    case 'intermediate':
      return 100
    case 'advanced':
      return 200
    case 'expert':
      return 500
    default:
      return 100
  }
}

function calculateLevel(experience: number, thresholds: number[]): number {
  let level = 1
  for (const threshold of thresholds) {
    if (experience >= threshold) {
      level++
    } else {
      break
    }
  }
  return level
}

export function useGamification(userId: string) {
  const [state, dispatch] = useReducer(gamificationReducer, {
    ...initialState,
    userId
  })

  useEffect(() => {
    const initializeGamification = async () => {
      const progress = await gamificationEngine.initializeUserProgress(userId)
      dispatch({ type: 'UPDATE_STATS', stats: progress.stats })
    }

    initializeGamification()
  }, [userId])

  const unlockAchievement = useCallback(
    async (achievement: Achievement) => {
      const emotionalContext = await emotionalIntelligence.analyzeEmotionalContext({
        achievement,
        progress: state.progress
      })

      const experience = await experienceEngine.generateExperienceContext({
        achievement,
        progress: state.progress
      })

      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievement })
    },
    [state.progress]
  )

  const completeChallenge = useCallback(
    async (challenge: Challenge) => {
      const emotionalContext = await emotionalIntelligence.analyzeEmotionalContext({
        challenge,
        progress: state.progress
      })

      const experience = await experienceEngine.generateExperienceContext({
        challenge,
        progress: state.progress
      })

      dispatch({ type: 'COMPLETE_CHALLENGE', challenge })
    },
    [state.progress]
  )

  const progressQuest = useCallback(
    async (quest: Quest, progress: number) => {
      const emotionalContext = await emotionalIntelligence.analyzeEmotionalContext({
        quest,
        progress: state.progress
      })

      const experience = await experienceEngine.generateExperienceContext({
        quest,
        progress: state.progress
      })

      dispatch({ type: 'PROGRESS_QUEST', quest, progress })
    },
    [state.progress]
  )

  const gainExperience = useCallback(
    (amount: number) => {
      dispatch({ type: 'GAIN_EXPERIENCE', amount })
    },
    []
  )

  const getAvailableChallenges = useCallback(async () => {
    return gamificationEngine.generatePersonalizedChallenges({
      userId: state.userId,
      progress: state.progress,
      preferences: {}
    })
  }, [state.userId, state.progress])

  const getCommunityImpact = useCallback(async () => {
    return communityEngine.createCommunityExperience({
      member: { id: state.userId } as any,
      transactions: [],
      interests: [],
      goals: []
    })
  }, [state.userId])

  return {
    state,
    unlockAchievement,
    completeChallenge,
    progressQuest,
    gainExperience,
    getAvailableChallenges,
    getCommunityImpact
  }
} 