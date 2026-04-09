'use client'

import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AGCTimelineProps {
  agc: {
    etapaAtual?: string
    [key: string]: any
  }
}

const STEPS = [
  { key: 'procuracoes', label: 'Procurações' },
  { key: 'quorum', label: 'Quórum' },
  { key: 'edital', label: 'Edital' },
  { key: 'primeira_chamada', label: '1ª Chamada' },
  { key: 'segunda_chamada', label: '2ª Chamada' },
  { key: 'ata', label: 'Ata' },
]

export function AGCTimeline({ agc }: AGCTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === agc.etapaAtual)

  return (
    <div className="flex items-center overflow-x-auto py-4">
      {STEPS.map((step, index) => {
        const isBefore = index < currentIndex
        const isCurrent = index === currentIndex
        const isAfter = index > currentIndex

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all',
                  isBefore && 'bg-green-500 text-white',
                  isCurrent &&
                    'bg-[#1e3a5f] text-white ring-4 ring-[#1e3a5f]/30 animate-pulse',
                  isAfter && 'bg-gray-200 text-gray-400'
                )}
              >
                {isBefore ? (
                  <CheckCircle className="size-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'whitespace-nowrap text-xs font-medium',
                  isBefore && 'text-green-600',
                  isCurrent && 'text-[#1e3a5f] font-semibold',
                  isAfter && 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-1 w-8 rounded-full sm:w-12 md:w-16',
                  index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
