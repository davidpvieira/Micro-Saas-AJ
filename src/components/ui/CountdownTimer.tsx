'use client'

import { Clock } from 'lucide-react'
import { calcularDiasStay } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: Date | string | null
  label?: string
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const dias = calcularDiasStay(targetDate)

  if (dias === null) {
    return (
      <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-4" />
        {label && <span className="font-medium">{label}:</span>}
        <span>&mdash;</span>
      </div>
    )
  }

  const isOverdue = dias < 0
  const isCritical = !isOverdue && dias < 15
  const isWarning = !isOverdue && dias >= 15 && dias < 30
  const isSafe = !isOverdue && dias >= 30

  const absDias = Math.abs(dias)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium',
        isOverdue && 'text-red-600 dark:text-red-400',
        isCritical && 'bg-red-100 text-red-700 animate-pulse dark:bg-red-900/30 dark:text-red-400',
        isWarning && 'text-amber-600 dark:text-amber-400',
        isSafe && 'text-green-600 dark:text-green-400'
      )}
    >
      <Clock className="size-4" />
      {label && <span>{label}:</span>}
      {isOverdue ? (
        <span>Vencido h\u00e1 {absDias} dias</span>
      ) : (
        <span>{dias} dias</span>
      )}
    </div>
  )
}
