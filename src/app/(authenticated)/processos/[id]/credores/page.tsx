'use client'

import { use } from 'react'
import { useCredores } from '@/lib/queries'
import { formatarMoeda } from '@/lib/utils'
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

export default function CredoresPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: credores, isLoading } = useCredores(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const totalCredores = credores?.length ?? 0
  const valorTotal = (credores ?? []).reduce(
    (acc: number, c: any) => acc + (c.valorDeclarado ?? 0),
    0
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1e3a5f]">Credores / QGC</h2>

      {/* Summary Row */}
      <div className="flex flex-wrap items-center gap-6 rounded-md border bg-muted/30 px-4 py-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Total de credores: </span>
          <span className="font-semibold">{totalCredores}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Valor total declarado: </span>
          <span className="font-semibold">{formatarMoeda(valorTotal)}</span>
        </div>
      </div>

      {!credores?.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhum credor cadastrado.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Valor Declarado</TableHead>
                <TableHead>Valor Habilitado</TableHead>
                <TableHead>Mediação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credores.map((credor: any) => (
                <TableRow key={credor.id}>
                  <TableCell className="font-medium">
                    {credor.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {credor.cpfCnpj ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="capitalize"
                    >
                      {credor.classe ?? '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {credor.valorDeclarado != null
                      ? formatarMoeda(credor.valorDeclarado)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {credor.valorHabilitado != null
                      ? formatarMoeda(credor.valorHabilitado)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {credor.statusMediacao ? (
                      <StatusBadge
                        status={credor.statusMediacao}
                        variant="mediacao"
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
