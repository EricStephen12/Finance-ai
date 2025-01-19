import { ReactNode } from 'react'
import TippyBase from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

interface TippyProps {
  children: ReactNode
  content: string | ReactNode
  className?: string
}

export default function Tippy({ children, content, className = '' }: TippyProps) {
  return (
    <TippyBase
      content={content}
      className={`bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg ${className}`}
    >
      <div className="inline-block cursor-help">{children}</div>
    </TippyBase>
  )
} 