'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, SparklesIcon, ShieldCheckIcon, CurrencyDollarIcon,
  LightBulbIcon, ChartPieIcon, CogIcon, BanknotesIcon, CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function LandingPage() {
  const features = [
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: 'Smart Analytics',
      description: 'Visualize your financial health with interactive charts and real-time tracking.'
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: 'Intelligent Insights',
      description: 'Get personalized financial advice based on your spending patterns and goals.'
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and encryption.'
    },
    {
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      title: 'Easy Tracking',
      description: 'Effortlessly track your income, expenses, and financial goals in one place.'
    }
  ]

  const advancedFeatures = [
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: 'Smart Budgeting',
      description: 'Create and manage budgets based on your spending patterns and financial goals.'
    },
    {
      icon: <ChartPieIcon className="h-8 w-8" />,
      title: 'Expense Analysis',
      description: 'Understand your spending with detailed categorization and trends analysis.'
    },
    {
      icon: <CogIcon className="h-8 w-8" />,
      title: 'Automated Tracking',
      description: 'Automatically categorize and track your transactions in real-time.'
    },
    {
      icon: <BanknotesIcon className="h-8 w-8" />,
      title: 'Financial Goals',
      description: 'Set and track your financial goals with progress monitoring.'
    }
  ]

  const testimonials = [
    {
      quote: "This app has completely changed how I manage my finances. The insights are incredibly helpful.",
      author: "Sarah Chen",
      role: "Small Business Owner",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      quote: "The budgeting features helped me save more than I ever could before. Highly recommended!",
      author: "Michael Rodriguez",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      quote: "Clean interface and powerful tracking features. Perfect for keeping my finances organized.",
      author: "Emma Thompson",
      role: "Marketing Manager",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      features: [
        'Basic Analytics',
        'Transaction Tracking',
        'Monthly Reports',
        'Standard Support',
        'Mobile App Access'
      ]
    },
    {
      name: 'Pro',
      price: '9.99',
      features: [
        'Advanced Analytics',
        'Unlimited Transactions',
        'Custom Categories',
        'Priority Support',
        'Data Export',
        'Goal Setting',
        'Budget Planning'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2234] via-[#1a2234] to-[#1a2234] relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-primary-500 leading-tight">
                  Financial AI
                </h1>
                <div className="mt-2 text-xl sm:text-2xl font-medium text-white">
                  Smart Financial Management Made Simple
                </div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 text-xl sm:text-2xl leading-relaxed text-white max-w-2xl mx-auto font-light"
              >
                Take control of your finances with intelligent tracking, insights, and planning tools. Start your journey to better financial health today.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-lg font-medium transition-colors"
                  >
                    Get Started Free
                    <ChartBarIcon className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#features"
                    className="inline-flex items-center px-8 py-4 rounded-lg border border-primary-400 text-white text-lg font-medium transition-colors hover:bg-primary-500/10"
                  >
                    See Features
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section - Lighter */}
        <div className="py-24 sm:py-32 bg-[#1a2234]/60">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-lg font-semibold text-white uppercase tracking-wider"
              >
                Personal Finance, Reimagined
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-4 text-4xl sm:text-5xl font-bold text-white"
              >
                Features
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xl leading-relaxed text-white"
              >
                Experience a new way of managing your finances with an AI assistant that truly understands your goals.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-[#1a2234]/80 rounded-xl p-6 backdrop-blur-sm hover:bg-[#1a2234] transition-all border border-[#00A3FF]/20">
                    <div className="text-[#00A3FF] mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-white/80 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          </div>
          
        {/* How It Works Section - Darker */}
        <div id="how-it-works" className="relative z-10 py-24 bg-[#1a2234]">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4 text-white"
              >
                How It Works
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white"
              >
                Simple steps to financial freedom
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="text-center group"
                >
                  <div className="bg-[#1a2234]/80 rounded-full p-4 inline-block mb-6 group-hover:bg-[#1a2234] transition-all">
                    <div className="text-[#00A3FF]">{feature.icon}</div>
              </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-blue-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
              </div>

        {/* Testimonials Section - Lighter */}
        <div className="relative z-10 py-24 bg-[#1a2234]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4 text-white"
              >
                What Our Users Say
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white"
              >
                Join thousands of satisfied users
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-[#1a2234]/80 rounded-xl p-8 backdrop-blur-sm border border-[#00A3FF]/20">
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4 ring-1 ring-blue-500/30"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.author}</h4>
                        <p className="text-blue-300 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-white">{testimonial.quote}</p>
              </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section - Darker */}
        <div id="pricing" className="relative z-10 py-24 bg-[#1a2234]">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4 text-white"
              >
                Simple, Transparent Pricing
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white"
              >
                Choose the plan that's right for you
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-[#1a2234]/80 rounded-xl p-8 backdrop-blur-sm border border-[#00A3FF]/20">
                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-blue-300 ml-2">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                          <span className="text-white">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/signup"
                      className={`block text-center py-3 px-6 rounded-lg transition-colors ${
                        index === 1
                          ? 'bg-[#00A3FF] hover:bg-[#0093e6] text-white'
                          : 'bg-[#1a2234]/50 hover:bg-[#1a2234] text-white border border-[#00A3FF]/20'
                      }`}
                    >
                      Get Started
                    </Link>
            </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section - Lighter */}
        <div className="relative z-10 py-24 bg-[#1a2234]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
                Join thousands of users who are already building wealth with AI-powered insights.
                Start your journey to financial freedom today.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-[#00A3FF] hover:bg-[#0093e6] text-white text-lg font-medium transition-colors"
                >
                  Start Your Free Trial
                  <ArrowTrendingUpIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer - Black */}
        <div className="bg-black">
          <Footer />
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 