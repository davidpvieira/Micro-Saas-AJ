'use client'

import { use } from 'react'
import { useDocumentos } from '@/lib/queries'
import { formatarData } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DocumentosPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: documentos, isLoading } = useDocumentos(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Group by categoria
  const grouped: Record<string, any[]> = {}
  for (const doc of documentos ?? []) {
    const cat = doc.categoria ?? 'outros'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(doc)
  }

  const categorias = Object.keys(grouped).sort()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">Documentação</h2>

      {!documentos?.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhum documento cadastrado.
        </p>
      ) : (
        categorias.map((categoria) => (
          <div key={categoria} className="space-y-2">
            <h3 className="text-sm font-semibold text-[#4a7c9f] uppercase tracking-wide">
              {categoria.replace(/_/g, ' ')}
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Artigo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grouped[categoria].map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.descricao}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="capitalize"
                        >
                          {(doc.categoria ?? '').replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.artigo ?? '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={doc.status}
                          variant="documento"
                        />
                      </TableCell>
                      <TableCell>
                        {doc.prazo ? formatarData(doc.prazo) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
