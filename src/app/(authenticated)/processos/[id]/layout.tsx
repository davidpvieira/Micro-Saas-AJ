'use client'

import { use } from 'react'
import { useRecuperanda } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { ProcessHeader } from '@/components/processo/ProcessHeader'
import { ProcessTabs } from '@/components/processo/ProcessTabs'

export default function ProcessoLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const params = use(props.params)
  const id = params.id
  const { data: processo, isLoading } = useRecuperanda(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!processo) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Processo n&atilde;o encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProcessHeader processo={processo} />
      <ProcessTabs processoId={id} setor={processo.setor} />
      {props.children}
    </div>
  )
}
