import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import type { Challenge, Quest } from '@/types/gamification'
import { emotionalIntelligence } from '@/lib/ai/emotionalIntelligence'
import { experienceEngine } from '@/lib/services/experienceEngine'

interface ActiveMissionsProps {
  challenges: Challenge[]
  quests: Quest[]
  onChallengeClick: (challenge: Challenge) => void
  onQuestClick: (quest: Quest) => void
}

export default function ActiveMissions({
  challenges,
  quests,
  onChallengeClick,
  onQuestClick
}: ActiveMissionsProps) {
  const { theme } = useTheme()
  const [selectedType, setSelectedType] = useState<'challenges' | 'quests'>('challenges')
  const [emotionalContext, setEmotionalContext] = useState<any>(null)
  const [experience, setExperience] = useState<any>(null)

  useEffect(() => {
    const initializeContext = async () => {
      const context = await emotionalIntelligence.analyzeEmotionalContext({
        challenges,
        quests,
        interactions: []
      })
      setEmotionalContext(context)

      const exp = await experienceEngine.generateExperienceContext({
        challenges,
        quests,
        interactions: []
      })
      setExperience(exp)
    }

    initializeContext()
  }, [challenges, quests])

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex space-x-4">
        <motion.button
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'challenges'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/10 hover:bg-muted/20'
          }`}
          onClick={() => setSelectedType('challenges')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Challenges ({challenges.length})
        </motion.button>
        <motion.button
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'quests'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/10 hover:bg-muted/20'
          }`}
          onClick={() => setSelectedType('quests')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Quests ({quests.length})
        </motion.button>
      </div>

      {/* Missions List */}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {selectedType === 'challenges' ? (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4"
            >
              {challenges.map(challenge => (
                <motion.div
                  key={challenge.id}
                  className="p-6 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onChallengeClick(challenge)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{challenge.name}</h3>
                      <p className="text-sm opacity-75 mt-1">{challenge.description}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {getDaysRemaining(challenge.duration)} days left
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Tasks Progress */}
                    <div className="space-y-2">
                      {challenge.tasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              task.completed
                                ? 'bg-success border-success'
                                : 'border-warning/50'
                            }`}
                          >
                            {task.completed && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-success-foreground"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                />
                              </motion.svg>
                            )}
                          </div>
                          <span className="flex-1 text-sm">{task.description}</span>
                          <span className="text-sm font-medium">{task.points} pts</span>
                        </div>
                      ))}
                    </div>

                    {/* Challenge Progress */}
                    <div>
                      <div className="h-2 rounded-full bg-muted/30">
                        <motion.div
                          className="h-full rounded-full bg-warning"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(challenge.tasks.filter(t => t.completed).length /
                              challenge.tasks.length) *
                              100}%`
                          }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs opacity-75">
                        <span>
                          {challenge.tasks.filter(t => t.completed).length}/
                          {challenge.tasks.length} Tasks
                        </span>
                        <span>{challenge.category}</span>
                      </div>
                    </div>

                    {/* Participants */}
                    {challenge.participants.length > 0 && (
                      <div className="pt-4 border-t border-warning/20">
                        <h4 className="text-sm font-medium mb-2">Participants</h4>
                        <div className="flex -space-x-2">
                          {challenge.participants.slice(0, 5).map(participant => (
                            <div
                              key={participant.id}
                              className="w-8 h-8 rounded-full bg-muted/20 border-2 border-background"
                            />
                          ))}
                          {challenge.participants.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-muted/20 border-2 border-background flex items-center justify-center text-xs">
                              +{challenge.participants.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4"
            >
              {quests.map(quest => (
                <motion.div
                  key={quest.id}
                  className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onQuestClick(quest)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <h3 className="font-semibold">{quest.name}</h3>
                    <p className="text-sm opacity-75 mt-1">{quest.description}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Story Progress */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Chapter {quest.storyline.chapter}</h4>
                      <p className="text-sm italic opacity-75">{quest.storyline.narrative}</p>
                    </div>

                    {/* Objectives */}
                    <div className="space-y-2">
                      {quest.objectives.map(objective => (
                        <div
                          key={objective.id}
                          className="flex items-start space-x-3"
                        >
                          <div
                            className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                              objective.completed
                                ? 'bg-success border-success'
                                : 'border-primary/50'
                            }`}
                          >
                            {objective.completed && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-success-foreground"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                />
                              </motion.svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm">{objective.description}</span>
                            {objective.impact.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {objective.impact.map((impact, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10"
                                  >
                                    {impact}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quest Progress */}
                    <div>
                      <div className="h-2 rounded-full bg-muted/30">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${quest.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs opacity-75">
                        <span>{quest.progress}% Complete</span>
                        <span>{quest.category}</span>
                      </div>
                    </div>

                    {/* Rewards Preview */}
                    {quest.rewards.length > 0 && (
                      <div className="pt-4 border-t border-primary/20">
                        <h4 className="text-sm font-medium mb-2">Rewards</h4>
                        <div className="flex flex-wrap gap-2">
                          {quest.rewards.map((reward, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10"
                            >
                              {reward.description}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function getDaysRemaining(duration: Challenge['duration']) {
  const end = new Date(duration.end)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
} 