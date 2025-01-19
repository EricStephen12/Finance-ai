'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Tooltip from '@/components/Tooltip'
import 'tippy.js/dist/tippy.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const dashboardCards = [
    {
      title: 'Wealth Overview',
      description: 'Start here to view your complete financial picture',
      Icon: BanknotesIcon,
      href: '/dashboard/wealth',
      color: 'bg-emerald-500',
      category: 'core'
    },
    {
      title: 'Smart Budgeting',
      description: 'Plan and optimize your monthly spending',
      Icon: ChartBarIcon,
      href: '/dashboard/budgeting',
      color: 'bg-blue-500',
      category: 'core'
    },
    {
      title: 'AI Insights',
      description: 'Get personalized financial recommendations',
      Icon: AcademicCapIcon,
      href: '/dashboard/insights',
      color: 'bg-violet-500',
      category: 'core'
    },
    {
      title: 'Investment Advisor',
      description: 'Grow your wealth with smart investment strategies',
      Icon: BuildingLibraryIcon,
      href: '/dashboard/investments',
      color: 'bg-amber-500',
      category: 'growth'
    },
    {
      title: 'Tax Planning',
      description: 'Optimize your tax strategy and savings',
      Icon: CurrencyDollarIcon,
      href: '/dashboard/tax',
      color: 'bg-rose-500',
      category: 'growth'
    },
    {
      title: 'Data Vault',
      description: 'Securely store your financial documents',
      Icon: BuildingLibraryIcon,
      href: '/dashboard/vault',
      color: 'bg-gray-500',
      category: 'tools'
    },
    {
      title: 'Community',
      description: 'Learn and grow with fellow investors',
      Icon: UserCircleIcon,
      href: '/dashboard/community',
      color: 'bg-cyan-500',
      category: 'tools'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Financial Command Center</h1>
            <p className="mt-2 text-gray-600">Your journey to financial success starts here.</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <UserCircleIcon className="h-5 w-5 text-primary-500" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Your Profile</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* Core Features Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Essential Financial Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardCards
              .filter(card => card.category === 'core')
              .map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg ${card.color} text-white mb-4`}>
                      <card.Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Growth Tools Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grow Your Wealth</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardCards
              .filter(card => card.category === 'growth')
              .map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg ${card.color} text-white mb-4`}>
                      <card.Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Additional Tools Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardCards
              .filter(card => card.category === 'tools')
              .map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg ${card.color} text-white mb-4`}>
                      <card.Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 