import { FC, useState, useEffect } from 'react'

interface JourneyMapProps {
  userId: string
  progress?: {
    achievements?: any[]
    activeQuests?: any[]
    activeChallenges?: any[]
    level?: number
    experience?: number
  }
  isNewUser?: boolean
  isLoading?: boolean
}

const JourneyMap: FC<JourneyMapProps> = ({ 
  userId, 
  progress,
  isNewUser,
  isLoading 
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [emotionalContext, setEmotionalContext] = useState<any>(null)
  const [experience, setExperience] = useState<any>(null)

  useEffect(() => {
    if (progress?.experience) {
      setExperience(progress.experience)
    }
  }, [progress?.experience])

  // Loading state with journey preview
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Financial Journey</h2>
        <div className="animate-pulse space-y-6">
          {/* Level and Experience Preview */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full"></div>
          </div>
          
          {/* Journey Map Preview */}
          <div className="relative w-full h-[400px] border border-gray-200 rounded-lg bg-gray-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Loading your journey map...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // New User Welcome
  if (isNewUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Financial Journey! 🎉</h2>
        <div className="space-y-6">
          <p className="text-gray-600">
            Your path to financial success starts here. Let's begin by setting up your journey map.
          </p>
          
          {/* Journey Preview */}
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800">1. Set Your Goals</h3>
              <p className="text-sm text-blue-600">Define your financial objectives and milestones</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-800">2. Track Progress</h3>
              <p className="text-sm text-green-600">Monitor your achievements and growth</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-800">3. Earn Rewards</h3>
              <p className="text-sm text-purple-600">Get recognized for your financial achievements</p>
            </div>
          </div>

          {/* Sample Journey Map */}
          <div className="relative w-full h-[200px] border border-gray-200 rounded-lg bg-gray-50">
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <p className="text-gray-600">
                Complete your financial profile to start building your personalized journey map
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No progress data yet
  if (!progress) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Financial Journey</h2>
        <div className="space-y-6">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Your journey map is ready to begin</p>
            <p className="text-sm text-gray-500">
              Start by setting your financial goals and completing activities to see your progress here
            </p>
          </div>
          
          {/* Default Level Display */}
          <div className="mb-6">
            <p className="text-lg">Level 1</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full w-0"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate milestones with proper defaults
  const milestones = [
    ...(progress.achievements || []).map(a => ({
      type: 'achievement',
      data: a,
      position: calculatePosition(a)
    })),
    ...(progress.activeQuests || []).map(q => ({
      type: 'quest',
      data: q,
      position: calculatePosition(q)
    })),
    ...(progress.activeChallenges || []).map(c => ({
      type: 'challenge',
      data: c,
      position: calculatePosition(c)
    }))
  ].sort((a, b) => a.position.y - b.position.y)

  const calculatePosition = (item: any) => {
    return {
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    }
  }

  const handleNodeClick = (nodeId: string) => {
    setActiveNode(nodeId)
  }

  // Main component render with data
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Your Financial Journey</h2>
      
      {/* Level and Experience */}
      <div className="mb-6">
        <p className="text-lg">Level {progress.level || 1}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${(experience || 0) % 100}%` }}
          ></div>
        </div>
      </div>

      {/* Journey Map Visualization */}
      <div className="relative w-full h-[400px] border border-gray-200 rounded-lg">
        {milestones.length > 0 ? (
          <>
            {/* SVG for paths */}
            <svg className="absolute inset-0 w-full h-full">
              {milestones.map((milestone, index) => {
                if (index === 0) return null
                const prevMilestone = milestones[index - 1]
                return (
                  <path
                    key={`path-${index}`}
                    d={`M ${prevMilestone.position.x}% ${prevMilestone.position.y}% L ${milestone.position.x}% ${milestone.position.y}%`}
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                  />
                )
              })}
            </svg>

            {/* Milestone Nodes */}
            {milestones.map((milestone, index) => (
              <button
                key={`node-${index}`}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                  ${milestone.type === 'achievement' ? 'bg-yellow-500' : 
                    milestone.type === 'quest' ? 'bg-blue-500' : 'bg-green-500'}
                  ${activeNode === `${milestone.type}-${index}` ? 'ring-4 ring-primary-200' : ''}
                  hover:ring-4 hover:ring-primary-200 transition-all duration-200
                `}
                style={{
                  left: `${milestone.position.x}%`,
                  top: `${milestone.position.y}%`
                }}
                onClick={() => handleNodeClick(`${milestone.type}-${index}`)}
              >
                <span className="sr-only">{milestone.data.title}</span>
              </button>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <div className="space-y-2">
              <p className="text-gray-600">Your journey map is empty</p>
              <p className="text-sm text-gray-500">
                Complete activities and achieve milestones to build your journey map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Active Node Details */}
      {activeNode && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          {milestones.map((milestone, index) => {
            if (`${milestone.type}-${index}` !== activeNode) return null
            return (
              <div key={`details-${index}`}>
                <h3 className="font-semibold">{milestone.data.title}</h3>
                <p className="text-gray-600">{milestone.data.description}</p>
                {milestone.data.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${milestone.data.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default JourneyMap 