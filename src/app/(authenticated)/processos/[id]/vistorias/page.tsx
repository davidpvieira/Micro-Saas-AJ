'use client'

import { use } from 'react'
import { Plus, Camera } from 'lucide-react'
import { useVistorias } from '@/lib/queries'
import { formatarData } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function VistoriasPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: vistorias, isLoading } = useVistorias(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1e3a5f]">Vistorias</h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a7c9f] transition-colors"
        >
          <Plus className="size-4" />
          Nova Vistoria
        </button>
      </div>

      {!vistorias?.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma vistoria cadastrada.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vistorias.map((vistoria: any) => {
            let photoCount = 0
            if (vistoria.fotoLinks) {
              try {
                const links =
                  typeof vistoria.fotoLinks === 'string'
                    ? JSON.parse(vistoria.fotoLinks)
                    : vistoria.fotoLinks
                photoCount = Array.isArray(links) ? links.length : 0
              } catch {
                photoCount = 0
              }
            }

            return (
              <Card key={vistoria.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {vistoria.dataVistoria
                        ? formatarData(vistoria.dataVistoria)
                        : 'Sem data'}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="capitalize"
                    >
                      {vistoria.status ?? 'pendente'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {vistoria.observacoes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vistoria.observacoes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {vistoria.proximaVisita && (
                      <div>
                        <span className="text-muted-foreground">
                          Próxima visita:{' '}
                        </span>
                        <span className="font-medium">
                          {formatarData(vistoria.proximaVisita)}
                        </span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-1 text-muted-foreground">
                      <Camera className="size-3.5" />
                      <span>{photoCount} foto(s)</span>
                    </div>
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
