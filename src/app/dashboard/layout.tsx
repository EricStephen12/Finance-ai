'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { signOut } from 'firebase/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import VoiceAssistant from '@/components/dashboard/voice-assistant'
import WelcomeMessage from '@/components/dashboard/WelcomeMessage'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const userEmail = auth.currentUser?.email

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative flex flex-col lg:flex-row max-w-full">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-[280px] fixed h-screen bg-white z-10">
          <Sidebar onSignOut={handleSignOut} userEmail={userEmail} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden w-full sticky top-0 z-20 bg-white border-b">
          <Sidebar onSignOut={handleSignOut} userEmail={userEmail} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-[280px] w-full relative z-0">
          <div className="max-w-[2000px] mx-auto">
            {/* Welcome Message */}
            <WelcomeMessage userEmail={userEmail} />
            
            {/* Main Content */}
            <div className="px-2 sm:px-4 pb-6">
              {children}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto bg-white border-t border-gray-200 py-2">
            <p className="text-[11px] sm:text-sm text-gray-500 text-center px-4">
              © 2024 Financial AI. Powered by quantum computing and neural networks.
            </p>
          </footer>
        </main>
      </div>
      <VoiceAssistant />
    </div>
  );
} 