'use client'

import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type ObrigacaoStatus = 'pendente' | 'em_andamento' | 'concluido' | 'vencido' | 'ia_pendente'
type HonorarioStatus = 'em_dia' | 'atrasado' | 'pago'
type DocumentoStatus = 'pendente' | 'recebido' | 'em_analise' | 'aprovado'
type MediacaoStatus = 'sem_proposta' | 'proposta_enviada' | 'em_negociacao' | 'acordo_fechado'

type StatusMap = {
  obrigacao: ObrigacaoStatus
  honorario: HonorarioStatus
  documento: DocumentoStatus
  mediacao: MediacaoStatus
}

interface StatusBadgeProps<V extends keyof StatusMap> {
  status: StatusMap[V]
  variant: V
}

const LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluido: 'Conclu\u00eddo',
  vencido: 'Vencido',
  ia_pendente: 'IA Pendente',
  em_dia: 'Em Dia',
  atrasado: 'Atrasado',
  pago: 'Pago',
  recebido: 'Recebido',
  em_analise: 'Em An\u00e1lise',
  aprovado: 'Aprovado',
  sem_proposta: 'Sem Proposta',
  proposta_enviada: 'Proposta Enviada',
  em_negociacao: 'Em Negocia\u00e7\u00e3o',
  acordo_fechado: 'Acordo Fechado',
}

const COLOR_MAP: Record<string, Record<string, string>> = {
  obrigacao: {
    pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    em_andamento: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    concluido: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    vencido: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    ia_pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  honorario: {
    em_dia: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    atrasado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pago: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  documento: {
    pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    recebido: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    em_analise: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    aprovado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  mediacao: {
    sem_proposta: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    proposta_enviada: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    em_negociacao: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    acordo_fechado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
}

export function StatusBadge<V extends keyof StatusMap>({
  status,
  variant,
}: StatusBadgeProps<V>) {
  const colorClasses = COLOR_MAP[variant]?.[status] ?? ''
  const label = LABELS[status] ?? status

  return (
    <Badge
      className={cn('border-transparent', colorClasses)}
    >
      {variant === 'obrigacao' && status === 'ia_pendente' && (
        <Search className="size-3" />
      )}
      {label}
    </Badge>
  )
}
