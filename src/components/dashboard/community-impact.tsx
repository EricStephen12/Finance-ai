import { FC } from 'react'

interface CommunityImpactProps {
  member?: {
    id: string
    name?: string
    impact?: {
      contributions?: any[]
      influence?: number
    }
    isNewUser?: boolean
  }
  projects?: any[]
  onProjectClick?: (project: any) => void
  onMemberClick?: (member: any) => void
}

const CommunityImpact: FC<CommunityImpactProps> = ({
  member,
  projects = [],
  onProjectClick,
  onMemberClick
}) => {
  // Safely calculate statistics with null checks
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => 
      p.participants?.some((part: any) => part.id === member?.id)
    ).length,
    totalContributions: member?.impact?.contributions?.length || 0,
    influenceScore: member?.impact?.influence || 0
  }

  // Show welcome message for new users
  if (member?.isNewUser) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Our Community! 🎉</h2>
        <div className="space-y-6">
          <p className="text-gray-600">
            As a new member, you're about to start an exciting journey. Here's what you can do:
          </p>
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800">1. Join Projects</h3>
              <p className="text-sm text-blue-600">Participate in community projects to make an impact</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-800">2. Make Contributions</h3>
              <p className="text-sm text-green-600">Share your insights and help others grow</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-800">3. Build Influence</h3>
              <p className="text-sm text-purple-600">Earn recognition for your valuable contributions</p>
            </div>
          </div>
          <button
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => onProjectClick?.(projects[0])}
          >
            Start Your Journey
          </button>
        </div>
      </div>
    )
  }

  // Loading state with activity suggestions
  if (!member) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Community & Impact</h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <p className="text-gray-500">Loading your community data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Community & Impact</h2>

      {/* Impact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="text-2xl font-semibold">{stats.totalProjects || '0'}</p>
          {stats.totalProjects === 0 && (
            <p className="text-xs text-gray-500 mt-1">Join your first project!</p>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Active Projects</p>
          <p className="text-2xl font-semibold">{stats.activeProjects || '0'}</p>
          {stats.activeProjects === 0 && (
            <p className="text-xs text-gray-500 mt-1">Get started today!</p>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Contributions</p>
          <p className="text-2xl font-semibold">{stats.totalContributions || '0'}</p>
          {stats.totalContributions === 0 && (
            <p className="text-xs text-gray-500 mt-1">Make your first contribution!</p>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Influence Score</p>
          <p className="text-2xl font-semibold">{stats.influenceScore || '0'}</p>
          {stats.influenceScore === 0 && (
            <p className="text-xs text-gray-500 mt-1">Build your influence!</p>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          {projects.length === 0 && (
            <button 
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => onProjectClick?.({ type: 'new' })}
            >
              Browse Projects →
            </button>
          )}
        </div>
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <button
                key={index}
                className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => onProjectClick?.(project)}
              >
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm text-gray-600">{project.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {project.participants?.length || 0} participants
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No active projects yet</p>
              <p className="text-sm text-gray-500">
                Join a project to start making an impact in the community!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Member Contributions */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Your Contributions</h3>
          {(member.impact?.contributions?.length || 0) === 0 && (
            <button 
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => onProjectClick?.({ type: 'contribute' })}
            >
              Start Contributing →
            </button>
          )}
        </div>
        <div className="space-y-4">
          {member.impact?.contributions?.length ? (
            member.impact.contributions.map((contribution: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{contribution.title}</h4>
                <p className="text-sm text-gray-600">{contribution.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(contribution.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No contributions yet</p>
              <p className="text-sm text-gray-500">
                Share your insights and help others by making your first contribution!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityImpact 