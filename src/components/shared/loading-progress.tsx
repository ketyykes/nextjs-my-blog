'use client'

import { cn } from '@/lib/utils'

interface LoadingProgressProps {
  value: number
  className?: string
}

export function LoadingProgress({ value, className }: LoadingProgressProps) {
  const percentage = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90 transform">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            className="text-primary transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {Math.round(percentage)}%
        </span>
      </div>
      <p className="text-muted-foreground">載入圖片中...</p>
    </div>
  )
}
