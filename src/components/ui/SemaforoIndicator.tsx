'use client'

import { cn } from '@/lib/utils'

type SemaforoStatus = 'verde' | 'amarelo' | 'vermelho'
type SemaforoSize = 'sm' | 'md' | 'lg'

interface SemaforoIndicatorProps {
  status: SemaforoStatus
  size?: SemaforoSize
  showLabel?: boolean
}

const COLOR_MAP: Record<SemaforoStatus, string> = {
  verde: 'bg-green-500',
  amarelo: 'bg-yellow-500',
  vermelho: 'bg-red-500',
}

const SIZE_MAP: Record<SemaforoSize, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

const LABEL_MAP: Record<SemaforoStatus, string> = {
  verde: 'Verde',
  amarelo: 'Amarelo',
  vermelho: 'Vermelho',
}

const TEXT_COLOR_MAP: Record<SemaforoStatus, string> = {
  verde: 'text-green-600 dark:text-green-400',
  amarelo: 'text-yellow-600 dark:text-yellow-400',
  vermelho: 'text-red-600 dark:text-red-400',
}

export function SemaforoIndicator({
  status,
  size = 'md',
  showLabel = false,
}: SemaforoIndicatorProps) {
  const shouldPulse =
    status === 'vermelho' ||
    (status === 'verde' && (size === 'md' || size === 'lg'))

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'inline-block rounded-full',
          COLOR_MAP[status],
          SIZE_MAP[size],
          shouldPulse && 'animate-pulse'
        )}
      />
      {showLabel && (
        <span className={cn('text-xs font-medium', TEXT_COLOR_MAP[status])}>
          {LABEL_MAP[status]}
        </span>
      )}
    </div>
  )
}
