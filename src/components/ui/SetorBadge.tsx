'use client'

import { Badge } from '@/components/ui/badge'
import { Wheat, HardHat, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

type Setor = 'agronegocio' | 'construcao' | 'transporte'

interface SetorBadgeProps {
  setor: Setor
}

const SETOR_CONFIG: Record<
  Setor,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    classes: string
  }
> = {
  agronegocio: {
    icon: Wheat,
    label: 'Agroneg\u00f3cio',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  construcao: {
    icon: HardHat,
    label: 'Constru\u00e7\u00e3o',
    classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  transporte: {
    icon: Truck,
    label: 'Transporte',
    classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
}

export function SetorBadge({ setor }: SetorBadgeProps) {
  const config = SETOR_CONFIG[setor]
  if (!config) return null

  const Icon = config.icon

  return (
    <Badge className={cn('border-transparent', config.classes)}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  )
}
