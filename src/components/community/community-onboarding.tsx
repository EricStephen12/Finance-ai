import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { communityEngine } from '@/lib/community/engine'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/useToast'
import { CheckCircle2, UserCircle, Target, Lightbulb } from 'lucide-react'

const EXPERTISE_OPTIONS = [
  'Investing',
  'Budgeting',
  'Saving',
  'Debt Management',
  'Real Estate',
  'Stock Market',
  'Cryptocurrency',
  'Retirement Planning',
  'Tax Planning',
  'Insurance'
]

const INTEREST_OPTIONS = [
  'Financial Freedom',
  'Wealth Building',
  'Passive Income',
  'Early Retirement',
  'Side Hustles',
  'Financial Education',
  'Market Analysis',
  'Risk Management',
  'Portfolio Diversification',
  'Personal Finance'
]

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Complete Your Profile',
    description: 'Help others get to know you better',
    icon: <UserCircle className="h-6 w-6" />
  },
  {
    title: 'Set Your Goals',
    description: 'What do you want to achieve?',
    icon: <Target className="h-6 w-6" />
  },
  {
    title: 'Choose Your Interests',
    description: 'What financial topics interest you?',
    icon: <Lightbulb className="h-6 w-6" />
  }
]

export function CommunityOnboarding({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    bio: '',
    expertise: [] as string[],
    interests: [] as string[]
  })

  const handleExpertiseToggle = (item: string) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.includes(item)
        ? prev.expertise.filter(i => i !== item)
        : [...prev.expertise, item]
    }))
  }

  const handleInterestToggle = (item: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter(i => i !== item)
        : [...prev.interests, item]
    }))
  }

  const handleComplete = async () => {
    if (!profile.displayName || !profile.bio || profile.expertise.length === 0 || profile.interests.length === 0) {
      toast({
        title: 'Incomplete Profile',
        description: 'Please fill in all required information',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await communityEngine.createMember(user!.uid, {
        ...profile,
        avatar: user?.photoURL
      })

      toast({
        title: 'Welcome to the Community!',
        description: 'Your profile has been set up successfully'
      })
      onComplete()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Input
                  placeholder="Display Name"
                  value={profile.displayName}
                  onChange={e => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Select your areas of expertise (max 5)</p>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map(item => (
                <Badge
                  key={item}
                  variant={profile.expertise.includes(item) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => profile.expertise.length < 5 || profile.expertise.includes(item)
                    ? handleExpertiseToggle(item)
                    : null}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Select your interests (max 5)</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(item => (
                <Badge
                  key={item}
                  variant={profile.interests.includes(item) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => profile.interests.length < 5 || profile.interests.includes(item)
                    ? handleInterestToggle(item)
                    : null}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Financial Community!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex justify-between">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center space-y-2 ${
                    i === step ? 'text-primary-500' : 'text-gray-400'
                  }`}
                >
                  <div className="relative">
                    {s.icon}
                    {i < step && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-6">{renderStep()}</div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 0}
              >
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(prev => prev + 1)}>Next</Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 