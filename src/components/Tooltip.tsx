'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Tippy with SSR disabled
const Tippy = dynamic(
  () => import('@tippyjs/react'),
  { ssr: false }
)

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  className?: string
}

export default function Tooltip({ children, content, className = '' }: TooltipProps) {
  return (
    <Tippy content={content}>
      <div className={`inline-block cursor-help ${className}`}>{children}</div>
    </Tippy>
  )
} 