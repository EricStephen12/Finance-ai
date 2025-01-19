import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import type { Achievement } from '@/types/gamification'
import { emotionalIntelligence } from '@/lib/ai/emotionalIntelligence'
import { experienceEngine } from '@/lib/services/experienceEngine'

interface AchievementsShowcaseProps {
  achievements: Achievement[]
  onAchievementClick: (achievement: Achievement) => void
}

export default function AchievementsShowcase({
  achievements,
  onAchievementClick
}: AchievementsShowcaseProps) {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all')
  const [emotionalContext, setEmotionalContext] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const initializeContext = async () => {
      const context = await emotionalIntelligence.analyzeEmotionalContext({
        achievements,
        interactions: []
      })
      setEmotionalContext(context)
    }

    initializeContext()
  }, [achievements])

  const categories: Achievement['category'][] = [
    'financial',
    'community',
    'learning',
    'impact',
    'personal'
  ]

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  )

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    byCategory: categories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: achievements.filter(a => a.category === category && a.unlocked).length
      }),
      {} as Record<Achievement['category'], number>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="col-span-2 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <h4 className="text-sm font-medium opacity-75">Total Progress</h4>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-2xl font-bold">
              {stats.unlocked}/{stats.total}
            </div>
            <div className="text-sm opacity-75">Achievements</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted/30">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {categories.map(category => (
          <motion.button
            key={category}
            className={`p-4 rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-primary/15 border border-primary/30'
                : 'bg-muted/5 hover:bg-muted/10'
            }`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="text-sm font-medium capitalize opacity-75">{category}</h4>
            <div className="mt-2 text-xl font-bold">
              {stats.byCategory[category]}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/10 hover:bg-muted/20'
          }`}
          onClick={() => setSelectedCategory('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>
        {categories.map(category => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/10 hover:bg-muted/20'
            }`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map(achievement => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-lg cursor-pointer transition-shadow hover:shadow-lg ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-success/10 to-success/5 border border-success/20'
                  : 'bg-muted/5 border border-muted/20'
              }`}
              onClick={() => {
                onAchievementClick(achievement)
                if (achievement.unlocked) {
                  setShowConfetti(true)
                  setTimeout(() => setShowConfetti(false), 3000)
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm opacity-75 mt-1">{achievement.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-success/20'
                    : 'bg-muted/20'
                }`}>
                  {getAchievementIcon(achievement)}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {achievement.requirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="opacity-75">{req.metric}</span>
                    <span className="font-medium">
                      {req.current}/{req.target}
                    </span>
                  </div>
                ))}
              </div>

              {achievement.unlocked && (
                <div className="mt-4 pt-4 border-t border-success/20">
                  <h4 className="text-sm font-medium mb-2">Rewards</h4>
                  <div className="flex flex-wrap gap-2">
                    {achievement.rewards.map((reward, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-success/10"
                      >
                        {reward.description}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="h-1.5 rounded-full bg-muted/30">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs opacity-75">
                  <span>{achievement.progress}% Complete</span>
                  <span>{achievement.difficulty}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Add confetti animation here */}
        </div>
      )}
    </div>
  )
}

function getAchievementIcon(achievement: Achievement) {
  // Implement achievement icon selection based on category and status
  return null
} 