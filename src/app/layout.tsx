import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import RequireOnboarding from '@/components/auth/RequireOnboarding'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Financial AI',
  description: 'Your personal AI-powered financial assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <RequireOnboarding>
              {children}
            </RequireOnboarding>
            <Toaster />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 