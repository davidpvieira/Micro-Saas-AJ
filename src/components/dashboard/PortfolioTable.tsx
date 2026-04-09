'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SemaforoIndicator } from '@/components/ui/SemaforoIndicator'
import { SetorBadge } from '@/components/ui/SetorBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { calcularSemaforo, cn } from '@/lib/utils'
import { SETORES } from '@/lib/constants'

type SortField = 'nome' | 'comarca' | null
type SortDirection = 'asc' | 'desc'

interface PortfolioTableProps {
  processos: any[]
}

export function PortfolioTable({ processos }: PortfolioTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [setorFilter, setSetorFilter] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function renderSortIcon(field: SortField) {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-muted-foreground/50" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 inline h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 inline h-3.5 w-3.5" />
    )
  }

  const filtered = useMemo(() => {
    let result = [...processos]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (p) =>
          p.nome?.toLowerCase().includes(term) ||
          p.comarca?.toLowerCase().includes(term)
      )
    }

    if (setorFilter) {
      result = result.filter((p) => p.setor === setorFilter)
    }

    if (sortField) {
      result.sort((a, b) => {
        const aVal = (a[sortField] ?? '').toLowerCase()
        const bVal = (b[sortField] ?? '').toLowerCase()
        const cmp = aVal.localeCompare(bVal, 'pt-BR')
        return sortDirection === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [processos, searchTerm, setorFilter, sortField, sortDirection])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">Portfolio de Processos</CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 w-full sm:w-[200px]"
              />
            </div>
            <select
              value={setorFilter}
              onChange={(e) => setSetorFilter(e.target.value)}
              className="h-8 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todos os Setores</option>
              {SETORES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[60px]">Status</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('nome')}
                >
                  Processo {renderSortIcon('nome')}
                </TableHead>
                <TableHead>Setor</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('comarca')}
                >
                  Comarca {renderSortIcon('comarca')}
                </TableHead>
                <TableHead>Stay</TableHead>
                <TableHead className="text-center">Credores</TableHead>
                <TableHead className="text-center">Obrig. Pendentes</TableHead>
                <TableHead>Honorarios</TableHead>
                <TableHead>Responsavel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum processo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((processo) => {
                  const semaforo = calcularSemaforo(processo)
                  const credoresCount = processo.credores?.length ?? 0
                  const obrigacoesPendentes =
                    processo.obrigacoes?.filter(
                      (o: any) => o.status !== 'concluido'
                    ).length ?? 0
                  const honorarioStatus =
                    processo.honorario?.status ?? 'em_dia'
                  const responsavel =
                    processo.responsavel?.name ??
                    processo.responsavelNome ??
                    '--'

                  return (
                    <TableRow
                      key={processo.id}
                      className={cn(
                        'cursor-pointer transition-colors',
                        semaforo === 'vermelho' && 'bg-red-50 dark:bg-red-950/20'
                      )}
                      onClick={() => router.push(`/processos/${processo.id}`)}
                    >
                      <TableCell>
                        <SemaforoIndicator status={semaforo} size="md" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {processo.nome}
                      </TableCell>
                      <TableCell>
                        {processo.setor && (
                          <SetorBadge setor={processo.setor} />
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {processo.comarca ?? '--'}
                      </TableCell>
                      <TableCell>
                        <CountdownTimer
                          targetDate={processo.dataFimStay ?? null}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {credoresCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center min-w-[24px] rounded-full px-1.5 py-0.5 text-xs font-semibold',
                            obrigacoesPendentes > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          )}
                        >
                          {obrigacoesPendentes}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={honorarioStatus}
                          variant="honorario"
                        />
                      </TableCell>
                      <TableCell className="text-sm">
                        {responsavel}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
