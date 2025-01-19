'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

export default function WelcomeMessage({ userEmail }: { userEmail?: string | null }) {
  const [greeting, setGreeting] = useState('')
  const [mounted, setMounted] = useState(false)
  const [timeIcon, setTimeIcon] = useState(<SunIcon className="h-5 w-5" />)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    
    if (hour < 12) {
      setGreeting('Good morning')
      setTimeIcon(<SunIcon className="h-5 w-5" />)
    } else if (hour < 18) {
      setGreeting('Good afternoon')
      setTimeIcon(<SunIcon className="h-5 w-5" />)
    } else {
      setGreeting('Good evening')
      setTimeIcon(<MoonIcon className="h-5 w-5" />)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 opacity-90" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Greeting Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <SparklesIcon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-white/80 text-sm font-medium">
                  <span className="flex items-center space-x-1">
                    {timeIcon}
                    <span>{greeting}</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mt-1">
                  De Amir
                </h1>
              </div>
            </motion.div>

            {/* Email Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">
                    {userEmail}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Glowing orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
} 