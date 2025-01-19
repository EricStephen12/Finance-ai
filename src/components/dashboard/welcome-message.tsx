import { useAuth } from '@/hooks/useAuth'
import { userProfileService } from '@/lib/services/userProfile'
import { useEffect, useState } from 'react'

export const WelcomeMessage = () => {
  const { user } = useAuth()
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const profile = await userProfileService.getUserProfile(user.id)
        setName(profile?.name || user.email || 'Guest')
      }
    }
    fetchUserProfile()
  }, [user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {getGreeting()}, {name}!
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Welcome to your financial dashboard. Here's an overview of your finances.
      </p>
    </div>
  )
} 