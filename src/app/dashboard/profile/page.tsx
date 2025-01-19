'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useUserProfile from '@/hooks/useUserProfile'
import { useToast } from '@/hooks/useToast'
import ProfileUpdate from '@/components/ProfileUpdate'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, isLoading, updateProfile } = useUserProfile()
  const { showToast } = useToast()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const handleUpdate = async (updatedProfile: any) => {
    try {
      await updateProfile(updatedProfile)
      showToast({
        title: 'Success',
        message: 'Profile updated successfully',
        type: 'success'
      })
      router.push('/dashboard')
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to update profile',
        type: 'error'
      })
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ProfileUpdate
          currentProfile={profile}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 