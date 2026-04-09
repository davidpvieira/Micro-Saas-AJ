'use client'

import { use } from 'react'
import { useObrigacoes } from '@/lib/queries'
import { formatarData } from '@/lib/utils'
import { parseISO, isPast } from 'date-fns'
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

export default function ObrigacoesPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: obrigacoes, isLoading } = useObrigacoes(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const sorted = [...(obrigacoes ?? [])].sort((a: any, b: any) => {
    if (!a.prazoFinal) return 1
    if (!b.prazoFinal) return -1
    return (
      new Date(a.prazoFinal).getTime() - new Date(b.prazoFinal).getTime()
    )
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">Obrigações</h2>

      {!sorted.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma obrigação cadastrada.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Artigo Legal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>IA Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((obrigacao: any) => {
                const prazoDate = obrigacao.prazoFinal
                  ? parseISO(obrigacao.prazoFinal)
                  : null
                const isOverdue = prazoDate ? isPast(prazoDate) : false

                return (
                  <TableRow key={obrigacao.id}>
                    <TableCell className="font-medium">
                      {obrigacao.descricao}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {obrigacao.artigoLegal ?? '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={obrigacao.status}
                        variant="obrigacao"
                      />
                    </TableCell>
                    <TableCell>
                      {prazoDate ? (
                        <span
                          className={
                            isOverdue
                              ? 'font-medium text-red-600'
                              : ''
                          }
                        >
                          {formatarData(prazoDate)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      {obrigacao.status === 'ia_pendente' &&
                      obrigacao.iaReliability != null ? (
                        <Badge className="border-transparent bg-amber-100 text-amber-800">
                          {obrigacao.iaReliability}%
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
