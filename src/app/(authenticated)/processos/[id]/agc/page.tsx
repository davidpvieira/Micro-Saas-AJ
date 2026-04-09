'use client'

import { use } from 'react'
import { useAgc } from '@/lib/queries'
import { formatarData } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AGCTimeline } from '@/components/processo/AGCTimeline'
import { CheckCircle } from 'lucide-react'

export default function AgcPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: agc, isLoading } = useAgc(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!agc) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#1e3a5f]">AGC</h2>
        <p className="text-sm text-muted-foreground">
          Nenhuma AGC configurada para este processo.
        </p>
      </div>
    )
  }

  const quorumPercent = agc.quorumPercentual ?? 0

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">AGC</h2>

      {/* Timeline */}
      <AGCTimeline agc={agc} />

      {/* Details card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhes da AGC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            {agc.dataEdital && (
              <div>
                <span className="text-muted-foreground">Data Edital</span>
                <p className="font-medium">{formatarData(agc.dataEdital)}</p>
              </div>
            )}
            {agc.dataPrimeiraChamada && (
              <div>
                <span className="text-muted-foreground">1a Chamada</span>
                <p className="font-medium">
                  {formatarData(agc.dataPrimeiraChamada)}
                </p>
              </div>
            )}
            {agc.dataSegundaChamada && (
              <div>
                <span className="text-muted-foreground">2a Chamada</span>
                <p className="font-medium">
                  {formatarData(agc.dataSegundaChamada)}
                </p>
              </div>
            )}
          </div>

          {/* Status edital */}
          {agc.statusEdital && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Status Edital:</span>
              <Badge variant="secondary" className="capitalize">
                {agc.statusEdital}
              </Badge>
            </div>
          )}

          {/* Parceiro Sandrini */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Parceiro Sandrini:</span>
            {agc.parceiroSandrini ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <CheckCircle className="size-4" />
                Sim
              </span>
            ) : (
              <span className="text-muted-foreground">Não</span>
            )}
          </div>

          {/* Quorum bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quórum</span>
              <span className="font-medium">{quorumPercent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-[#1e3a5f] transition-all"
                style={{ width: `${Math.min(quorumPercent, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
