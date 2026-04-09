'use client'

import { cn } from '@/lib/utils'

interface SafraProgressProps {
  cicloSafra: string
  progressoSafra: number
}

export function SafraProgress({
  cicloSafra,
  progressoSafra,
}: SafraProgressProps) {
  const clamped = Math.max(0, Math.min(100, progressoSafra))

  const barColor =
    clamped > 60
      ? 'bg-green-500'
      : clamped >= 30
        ? 'bg-yellow-500'
        : 'bg-red-500'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          Safra {cicloSafra}
        </span>
        <span className={cn('font-semibold', barColor.replace('bg-', 'text-'))}>
          {clamped}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
