import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { communityEngine, CommunityExperience, CommunityProject, Discussion } from '@/lib/community/engine'
import { CommunityOnboarding } from './community-onboarding'
import { ProjectModal } from './project-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/useToast'
import { analyzeEmotionalContext, getEmotionalInsights, getEmotionalSupportMessage } from '@/lib/ai/emotionalIntelligence'

export function CommunityDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const [experience, setExperience] = useState<CommunityExperience | null>(null)
  const [activeTab, setActiveTab] = useState('projects')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [emotionalContext, setEmotionalContext] = useState<EmotionalContext | null>(null)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadCommunityExperience()
      
      // Set a timeout to show additional UI if loading takes too long
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true)
      }, 10000) // 10 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [user])

  const loadCommunityExperience = async () => {
    setLoading(true)
    setLoadingTimeout(false)
    setLoadingError(null)
    try {
      // First check if the user exists in the community
      const member = await communityEngine.getMember(user!.uid)
      
      if (!member) {
        setShowOnboarding(true)
        setLoading(false)
        return
      }

      // Load emotional context first
      const emotionalData = await analyzeEmotionalContext({
        transactions: [], // TODO: Add actual transactions
        goals: member.interests,
        income: 0, // TODO: Add actual income
        expenses: [], // TODO: Add actual expenses
        financialState: {
          goals: member.interests,
          investments: [] // TODO: Add actual investments
        }
      })
      setEmotionalContext(emotionalData)

      const exp = await communityEngine.createCommunityExperience({
        member: {
          id: user?.uid,
          displayName: user?.displayName || 'Community Member',
          avatar: user?.photoURL
        },
        transactions: [],
        interests: member.interests,
        goals: ['financial_freedom', 'debt_free']
      })
      setExperience(exp)
    } catch (error) {
      console.error('Error loading community experience:', error)
      setLoadingError('Failed to load community experience. Please try again.')
      toast({
        title: 'Error',
        description: 'Failed to load community experience',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    loadCommunityExperience()
  }

  const handleJoinProject = async (projectId: string) => {
    try {
      await communityEngine.joinProject(user!.uid, projectId)
      toast({
        title: 'Success',
        description: 'Successfully joined project'
      })
      loadCommunityExperience()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join project',
        variant: 'destructive'
      })
    }
  }

  const ProjectCard = ({ project }: { project: CommunityProject }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{project.title}</span>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, i) => (
              <Avatar key={i} className="border-2 border-white">
                <AvatarFallback>M{i + 1}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          {!project.members.includes(user!.uid) && (
            <Button onClick={() => handleJoinProject(project.id)}>Join Project</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const DiscussionCard = ({ discussion }: { discussion: Discussion }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{discussion.title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          <Badge variant={
            discussion.sentiment === 'positive' ? 'default' :
            discussion.sentiment === 'negative' ? 'destructive' : 'secondary'
          }>
            {discussion.sentiment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{discussion.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{discussion.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              {discussion.likes} Likes
            </Button>
            <Button variant="ghost" size="sm">
              {discussion.replies.length} Replies
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>

        <Card className="border-primary-100">
          <CardContent className="py-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Setting up your community experience...</p>
                <p className="text-xs text-gray-400 mt-1">This may take a few moments</p>
                
                {loadingTimeout && (
                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-amber-600">
                      This is taking longer than expected.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadCommunityExperience}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-8 w-8 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (loadingError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="bg-red-50 text-red-500 rounded-full p-3 inline-block mb-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Community Data</h2>
          <p className="text-gray-600 max-w-sm">
            {loadingError}
          </p>
          <Button 
            onClick={loadCommunityExperience}
            className="mt-4"
            size="lg"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <CommunityOnboarding onComplete={handleOnboardingComplete} />
  }

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="bg-red-50 text-red-500 rounded-full p-3 inline-block mb-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Community Data</h2>
          <p className="text-gray-600 max-w-sm">
            We encountered an issue while loading your community experience. Please try again.
          </p>
          <Button 
            onClick={loadCommunityExperience}
            className="mt-4"
            size="lg"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{experience.member.displayName}</h2>
          <p className="text-gray-600">
            {experience.member.contributionPoints} Points • {experience.member.badges.length} Badges
          </p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={experience.member.avatar} />
          <AvatarFallback>{experience.member.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectModal />
        {/* Add DiscussionModal here when a project is selected */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ScrollArea className="h-[600px]">
            {experience.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="discussions">
          <ScrollArea className="h-[600px]">
            {experience.discussions.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Projects</h4>
              <div className="flex flex-wrap gap-2">
                {experience.recommendations.projects.map(projectId => (
                  <Badge key={projectId} variant="secondary">
                    {projectId}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {experience.recommendations.topics.map(topic => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 