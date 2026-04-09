'use client'

import { use } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useRecuperanda, useFazendas } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { FazendaCard } from '@/components/rural/FazendaCard'

export default function RuralPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: processo, isLoading: loadingProcesso } = useRecuperanda(id)

  const moduloRuralId = processo?.moduloRural?.id ?? ''
  const { data: fazendas, isLoading: loadingFazendas } = useFazendas(
    moduloRuralId
  )

  if (loadingProcesso) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (processo?.setor !== 'agronegocio') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#1e3a5f]">Rural</h2>
        <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
          <AlertTriangle className="size-5 shrink-0" />
          <span className="text-sm font-medium">
            Módulo disponível apenas para processos de agronegócio.
          </span>
        </div>
      </div>
    )
  }

  if (loadingFazendas) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">Rural</h2>

      {!fazendas?.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma fazenda cadastrada.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fazendas.map((fazenda: any) => (
            <FazendaCard key={fazenda.id} fazenda={fazenda} />
          ))}
        </div>
      )}
    </div>
  )
}
