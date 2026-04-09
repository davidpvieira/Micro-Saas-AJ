'use client'

import { use } from 'react'
import { AlertTriangle, CreditCard, FileText } from 'lucide-react'
import { useHonorarios } from '@/lib/queries'
import { formatarMoeda, formatarData } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function HonorariosPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: honorarios, isLoading } = useHonorarios(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const hasAtrasado = (honorarios ?? []).some(
    (h: any) => h.status === 'atrasado'
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">Honorários</h2>

      {/* Alert banner if any atrasado */}
      {hasAtrasado && (
        <div className="flex items-center gap-3 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <AlertTriangle className="size-5 shrink-0" />
          <span className="text-sm font-medium">
            Existem honorários em atraso. Ação imediata necessária.
          </span>
        </div>
      )}

      {!honorarios?.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhum honorário cadastrado.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {honorarios.map((honorario: any) => {
            const isAtrasado = honorario.status === 'atrasado'

            return (
              <Card
                key={honorario.id}
                className={
                  isAtrasado
                    ? 'border-red-300 dark:border-red-700'
                    : ''
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Honorário
                    </CardTitle>
                    <StatusBadge
                      status={honorario.status}
                      variant="honorario"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Valor Total
                      </span>
                      <p className="font-semibold">
                        {formatarMoeda(honorario.valorTotal ?? 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Parcela
                      </span>
                      <p className="font-semibold">
                        {honorario.parcelaAtual ?? '—'}/
                        {honorario.totalParcelas ?? '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Valor Parcela
                      </span>
                      <p className="font-semibold">
                        {formatarMoeda(honorario.valorParcela ?? 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Próximo Pagamento
                      </span>
                      <p className="font-semibold">
                        {honorario.dataProximoPagamento
                          ? formatarData(honorario.dataProximoPagamento)
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {honorario.diasAtraso > 0 && (
                    <p className="text-sm font-medium text-red-600">
                      {honorario.diasAtraso} dias em atraso
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#1e3a5f] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#4a7c9f] transition-colors"
                    >
                      <CreditCard className="size-3.5" />
                      Registrar Pagamento
                    </button>
                    {isAtrasado && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <FileText className="size-3.5" />
                        Gerar Petição
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
