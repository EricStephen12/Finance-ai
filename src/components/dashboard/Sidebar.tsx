'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  onSignOut: () => void
  userEmail?: string
}

export default function Sidebar({ onSignOut, userEmail }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { name: 'Overview', icon: HomeIcon, href: '/dashboard' },
    { name: 'Analytics', icon: ChartBarIcon, href: '/dashboard/analytics' },
    { name: 'Transactions', icon: BanknotesIcon, href: '/dashboard/transactions' },
    { name: 'Data Vault', icon: ShieldCheckIcon, href: '/dashboard/vault' },
    { name: 'Wealth Management', icon: CurrencyDollarIcon, href: '/dashboard/wealth' },
    { name: 'Smart Budgeting', icon: ChartBarIcon, href: '/dashboard/budgeting' },
    { name: 'Financial Games', icon: TrophyIcon, href: '/dashboard/games' },
    { name: 'AI Insights', icon: UserCircleIcon, href: '/dashboard/insights' },
    { name: 'Investment Advisor', icon: ChartBarIcon, href: '/dashboard/investments' },
    { name: 'Tax Planning', icon: BanknotesIcon, href: '/dashboard/tax' },
    { name: 'Community', icon: UserCircleIcon, href: '/dashboard/community' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/dashboard/settings' }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Welcome Message */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-bold text-primary-600 truncate">Financial AI</h1>
        {userEmail && (
          <div className="mt-2 space-y-1">
            <p className="text-xs sm:text-sm text-gray-600">Welcome back,</p>
            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[200px]">{userEmail}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <button
          onClick={() => {
            setIsMobileMenuOpen(false)
            onSignOut()
          }}
          className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="font-medium truncate">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-primary-500 text-white lg:hidden hover:bg-primary-600 transition-all duration-200 shadow-lg active:scale-95"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <Bars3Icon className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobileMenuOpen ? 0 : -300,
          boxShadow: isMobileMenuOpen ? '0 0 50px rgba(0,0,0,0.2)' : 'none'
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full w-full bg-white shadow-sm">
        <SidebarContent />
      </div>
    </>
  )
} 