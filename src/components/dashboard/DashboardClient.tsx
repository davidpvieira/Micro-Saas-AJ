'use client'

import { useMemo } from 'react'
import { Plus, ClipboardCheck, FileText, AlertCircle } from 'lucide-react'
import { useDashboard } from '@/lib/queries'
import { calcularSemaforo } from '@/lib/utils'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { PortfolioTable } from '@/components/dashboard/PortfolioTable'
import { StatusPieChart } from '@/components/dashboard/StatusPieChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[96px] rounded-xl" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[480px] rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Erro ao carregar o dashboard
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  )
}

export function DashboardClient() {
  const { data, isLoading, error } = useDashboard()

  const pieChartData = useMemo(() => {
    if (!data?.processos) return []

    let verde = 0
    let amarelo = 0
    let vermelho = 0

    for (const processo of data.processos) {
      const status = calcularSemaforo(processo)
      if (status === 'verde') verde++
      else if (status === 'amarelo') amarelo++
      else vermelho++
    }

    return [
      { name: 'Verde', value: verde, color: '#22c55e' },
      { name: 'Amarelo', value: amarelo, color: '#eab308' },
      { name: 'Vermelho', value: vermelho, color: '#ef4444' },
    ]
  }, [data?.processos])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <DashboardError
          message={
            error instanceof Error
              ? error.message
              : 'Ocorreu um erro inesperado.'
          }
        />
      </div>
    )
  }

  const summaryData = {
    totalProcessos: data?.totalProcessos ?? 0,
    honorariosAtrasados: data?.honorariosAtrasados ?? 0,
    prazos7dias: data?.prazos7dias ?? 0,
    stayVencendo: data?.stayVencendo ?? 0,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Summary Cards */}
      <SummaryCards data={summaryData} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Table */}
        <div className="lg:col-span-2">
          <PortfolioTable processos={data?.processos ?? []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <StatusPieChart data={pieChartData} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acoes Rapidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Processo
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <ClipboardCheck className="h-4 w-4" />
                Registrar Vistoria
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <FileText className="h-4 w-4" />
                Gerar Relatorio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
