'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useRecuperandas } from '@/lib/queries'
import { calcularSemaforo } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SetorBadge } from '@/components/ui/SetorBadge'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { SemaforoIndicator } from '@/components/ui/SemaforoIndicator'

export default function ProcessosPage() {
  const { data: processos, isLoading } = useRecuperandas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Processos</h1>
        <Link
          href="/processos/novo"
          className="inline-flex items-center gap-2 rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a7c9f] transition-colors"
        >
          <Plus className="size-4" />
          Novo Processo
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !processos?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Nenhum processo encontrado.</p>
            <Link
              href="/processos/novo"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a7c9f] transition-colors"
            >
              <Plus className="size-4" />
              Criar primeiro processo
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processos.map((processo: any) => {
            const semaforo = calcularSemaforo(processo)
            return (
              <Link key={processo.id} href={`/processos/${processo.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {processo.nome}
                      </CardTitle>
                      <SemaforoIndicator status={semaforo} size="md" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SetorBadge setor={processo.setor} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {processo.comarca}
                    </p>
                    <CountdownTimer
                      targetDate={processo.dataFimStay}
                      label="Stay"
                    />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
