import { db } from '@/lib/firebase/config'
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'

export interface Achievement {
  id: string
  title: string
  description: string
  category: 'savings' | 'investment' | 'budgeting' | 'general'
  icon: string
  points: number
  unlockedAt?: string
}

export interface Quest {
  id: string
  title: string
  description: string
  category: 'daily' | 'weekly' | 'monthly'
  requirements: {
    type: string
    value: number
    current: number
  }[]
  rewards: {
    points: number
    achievements?: string[]
  }
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'failed'
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'saving' | 'investing' | 'budgeting'
  target: number
  current: number
  deadline: string
  rewards: {
    points: number
    achievements?: string[]
  }
  status: 'active' | 'completed' | 'failed'
}

export interface UserProgress {
  userId: string
  level: number
  points: number
  achievements: Achievement[]
  quests: Quest[]
  challenges: Challenge[]
  streak: number
  lastActive: string
}

class GamificationEngine {
  private async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const progressRef = doc(db, 'gamification', userId)
      const progressSnap = await getDoc(progressRef)
      
      if (progressSnap.exists()) {
        return progressSnap.data() as UserProgress
      }
      return null
    } catch (error) {
      console.error('Error getting user progress:', error)
      return null
    }
  }

  async initializeUserProgress(userId: string): Promise<UserProgress> {
    try {
      const existingProgress = await this.getUserProgress(userId)
      
      if (existingProgress) {
        return existingProgress
      }

      const initialProgress: UserProgress = {
        userId,
        level: 1,
        points: 0,
        achievements: [],
        quests: [],
        challenges: [],
        streak: 0,
        lastActive: new Date().toISOString()
      }

      await setDoc(doc(db, 'gamification', userId), initialProgress)
      return initialProgress
    } catch (error) {
      console.error('Error initializing user progress:', error)
      throw new Error('Failed to initialize user progress')
    }
  }

  async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    try {
      const progressRef = doc(db, 'gamification', userId)
      await updateDoc(progressRef, {
        points: increment(points),
        lastActive: new Date().toISOString()
      })

      // Check for level up
      const progress = await this.getUserProgress(userId)
      if (progress) {
        const newLevel = Math.floor(progress.points / 1000) + 1
        if (newLevel > progress.level) {
          await updateDoc(progressRef, {
            level: newLevel
          })
          
          // Award level up achievement
          await this.unlockAchievement(userId, {
            id: `level_${newLevel}`,
            title: `Level ${newLevel}`,
            description: `Reached level ${newLevel}`,
            category: 'general',
            icon: '🏆',
            points: 100
          })
        }
      }
    } catch (error) {
      console.error('Error awarding points:', error)
      throw new Error('Failed to award points')
    }
  }

  async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      const progressRef = doc(db, 'gamification', userId)
      const progress = await this.getUserProgress(userId)

      if (progress && !progress.achievements.find(a => a.id === achievement.id)) {
        await updateDoc(progressRef, {
          achievements: arrayUnion({
            ...achievement,
            unlockedAt: new Date().toISOString()
          })
        })

        // Award achievement points
        await this.awardPoints(userId, achievement.points, `Achievement: ${achievement.title}`)
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error)
      throw new Error('Failed to unlock achievement')
    }
  }

  async startQuest(userId: string, quest: Omit<Quest, 'status'>): Promise<void> {
    try {
      const progressRef = doc(db, 'gamification', userId)
      await updateDoc(progressRef, {
        quests: arrayUnion({
          ...quest,
          status: 'active'
        })
      })
    } catch (error) {
      console.error('Error starting quest:', error)
      throw new Error('Failed to start quest')
    }
  }

  async updateQuestProgress(userId: string, questId: string, progress: number): Promise<void> {
    try {
      const userProgress = await this.getUserProgress(userId)
      if (!userProgress) return

      const quest = userProgress.quests.find(q => q.id === questId)
      if (!quest || quest.status !== 'active') return

      const progressRef = doc(db, 'gamification', userId)
      const updatedQuests = userProgress.quests.map(q => {
        if (q.id === questId) {
          const updatedRequirements = q.requirements.map(r => ({
            ...r,
            current: progress
          }))

          // Check if quest is completed
          const isCompleted = updatedRequirements.every(r => r.current >= r.value)
          if (isCompleted) {
            // Award quest rewards
            this.awardPoints(userId, q.rewards.points, `Quest completed: ${q.title}`)
            if (q.rewards.achievements) {
              q.rewards.achievements.forEach(achievementId => {
                // Unlock related achievements
                // Implementation needed based on achievement definitions
              })
            }
          }

          return {
            ...q,
            requirements: updatedRequirements,
            status: isCompleted ? 'completed' : 'active'
          }
        }
        return q
      })

      await updateDoc(progressRef, {
        quests: updatedQuests
      })
    } catch (error) {
      console.error('Error updating quest progress:', error)
      throw new Error('Failed to update quest progress')
    }
  }

  async startChallenge(userId: string, challenge: Omit<Challenge, 'status' | 'current'>): Promise<void> {
    try {
      const progressRef = doc(db, 'gamification', userId)
      await updateDoc(progressRef, {
        challenges: arrayUnion({
          ...challenge,
          current: 0,
          status: 'active'
        })
      })
    } catch (error) {
      console.error('Error starting challenge:', error)
      throw new Error('Failed to start challenge')
    }
  }

  async updateChallengeProgress(userId: string, challengeId: string, progress: number): Promise<void> {
    try {
      const userProgress = await this.getUserProgress(userId)
      if (!userProgress) return

      const challenge = userProgress.challenges.find(c => c.id === challengeId)
      if (!challenge || challenge.status !== 'active') return

      const progressRef = doc(db, 'gamification', userId)
      const updatedChallenges = userProgress.challenges.map(c => {
        if (c.id === challengeId) {
          const isCompleted = progress >= c.target
          
          if (isCompleted) {
            // Award challenge rewards
            this.awardPoints(userId, c.rewards.points, `Challenge completed: ${c.title}`)
            if (c.rewards.achievements) {
              c.rewards.achievements.forEach(achievementId => {
                // Unlock related achievements
                // Implementation needed based on achievement definitions
              })
            }
          }

          return {
            ...c,
            current: progress,
            status: isCompleted ? 'completed' : 'active'
          }
        }
        return c
      })

      await updateDoc(progressRef, {
        challenges: updatedChallenges
      })
    } catch (error) {
      console.error('Error updating challenge progress:', error)
      throw new Error('Failed to update challenge progress')
    }
  }

  async updateStreak(userId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress(userId)
      if (!progress) return

      const lastActive = new Date(progress.lastActive)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

      const progressRef = doc(db, 'gamification', userId)
      if (diffDays === 1) {
        // Maintain streak
        await updateDoc(progressRef, {
          streak: increment(1),
          lastActive: today.toISOString()
        })

        // Award streak achievements
        if ((progress.streak + 1) % 7 === 0) {
          await this.unlockAchievement(userId, {
            id: `streak_${progress.streak + 1}`,
            title: `${progress.streak + 1} Day Streak`,
            description: `Maintained a ${progress.streak + 1} day activity streak`,
            category: 'general',
            icon: '🔥',
            points: 50
          })
        }
      } else if (diffDays > 1) {
        // Reset streak
        await updateDoc(progressRef, {
          streak: 1,
          lastActive: today.toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating streak:', error)
      throw new Error('Failed to update streak')
    }
  }
}

export const gamificationEngine = new GamificationEngine() 