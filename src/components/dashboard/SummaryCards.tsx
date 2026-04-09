'use client'

import { FolderOpen, AlertTriangle, Clock, Timer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SummaryData {
  totalProcessos: number
  honorariosAtrasados: number
  prazos7dias: number
  stayVencendo: number
}

interface SummaryCardsProps {
  data: SummaryData
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Processos',
      value: data.totalProcessos,
      icon: FolderOpen,
      bgClass: 'bg-[#1e3a5f]',
      textClass: 'text-white',
      iconClass: 'text-white/70',
    },
    {
      label: 'Honorarios Atrasados',
      value: data.honorariosAtrasados,
      icon: AlertTriangle,
      bgClass: data.honorariosAtrasados > 0 ? 'bg-red-600' : 'bg-[#1e3a5f]',
      textClass: 'text-white',
      iconClass: 'text-white/70',
    },
    {
      label: 'Prazos em 7 dias',
      value: data.prazos7dias,
      icon: Clock,
      bgClass: data.prazos7dias > 0 ? 'bg-amber-500' : 'bg-[#1e3a5f]',
      textClass: 'text-white',
      iconClass: 'text-white/70',
    },
    {
      label: 'Stay Vencendo',
      value: data.stayVencendo,
      icon: Timer,
      bgClass: data.stayVencendo > 0 ? 'bg-orange-500' : 'bg-[#1e3a5f]',
      textClass: 'text-white',
      iconClass: 'text-white/70',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.label}
            className={cn('relative overflow-hidden border-none', card.bgClass)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className={cn('text-3xl font-bold', card.textClass)}>
                    {card.value}
                  </p>
                  <p className={cn('text-sm mt-1 opacity-90', card.textClass)}>
                    {card.label}
                  </p>
                </div>
                <Icon
                  className={cn('h-8 w-8 shrink-0', card.iconClass)}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
