export interface Achievement {
  id: string
  name: string
  description: string
  category: 'financial' | 'community' | 'learning' | 'impact' | 'personal'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  requirements: {
    type: string
    target: number
    current: number
    metric: string
  }[]
  rewards: {
    type: 'points' | 'badge' | 'title' | 'feature' | 'reward'
    value: any
    description: string
  }[]
  progress: number
  unlocked: boolean
  dateUnlocked?: string
}

export interface Challenge {
  id: string
  name: string
  description: string
  category: Achievement['category']
  duration: {
    start: string
    end: string
  }
  tasks: {
    id: string
    description: string
    completed: boolean
    deadline?: string
    points: number
  }[]
  rewards: Achievement['rewards']
  participants: {
    id: string
    progress: number
    status: 'active' | 'completed' | 'failed'
  }[]
  leaderboard?: {
    id: string
    score: number
    rank: number
  }[]
}

export interface Quest {
  id: string
  name: string
  description: string
  storyline: {
    chapter: string
    narrative: string
    choices?: {
      id: string
      description: string
      consequences: string[]
    }[]
  }
  objectives: {
    id: string
    description: string
    completed: boolean
    impact: string[]
  }[]
  rewards: Achievement['rewards']
  progress: number
  status: 'active' | 'completed' | 'failed'
}

export interface UserProgress {
  level: number
  experience: number
  achievements: Achievement[]
  activeChallenges: Challenge[]
  completedChallenges: Challenge[]
  activeQuests: Quest[]
  completedQuests: Quest[]
  stats: {
    category: string
    value: number
    history: {
      date: string
      value: number
    }[]
  }[]
}

export interface GamificationEvent {
  type: 'achievement_unlocked' | 'challenge_completed' | 'quest_progress' | 'level_up'
  timestamp: string
  data: {
    userId: string
    achievement?: Achievement
    challenge?: Challenge
    quest?: Quest
    level?: number
    experience?: number
  }
}

export interface GamificationConfig {
  levelThresholds: number[]
  experienceMultipliers: {
    category: string
    multiplier: number
  }[]
  challengeFrequency: {
    category: string
    daysInterval: number
  }[]
  questDifficulty: {
    level: number
    complexity: number
  }[]
}

export interface GamificationState {
  userId: string
  progress: UserProgress
  currentChallenge?: Challenge
  activeQuest?: Quest
  config: GamificationConfig
  events: GamificationEvent[]
}

export type GamificationAction =
  | { type: 'UNLOCK_ACHIEVEMENT'; achievement: Achievement }
  | { type: 'COMPLETE_CHALLENGE'; challenge: Challenge }
  | { type: 'PROGRESS_QUEST'; quest: Quest; progress: number }
  | { type: 'GAIN_EXPERIENCE'; amount: number }
  | { type: 'LEVEL_UP' }
  | { type: 'UPDATE_STATS'; stats: UserProgress['stats'] } 