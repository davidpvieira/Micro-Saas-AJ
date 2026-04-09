'use client'

import { calcularSemaforo } from '@/lib/utils'
import { SetorBadge } from '@/components/ui/SetorBadge'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { SemaforoIndicator } from '@/components/ui/SemaforoIndicator'

interface ProcessHeaderProps {
  processo: any
}

export function ProcessHeader({ processo }: ProcessHeaderProps) {
  const semaforo = calcularSemaforo(processo)

  return (
    <div className="space-y-3">
      {/* Row 1: Name, Setor, Comarca */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          {processo.nome}
        </h1>
        <SetorBadge setor={processo.setor} />
        <span className="text-sm text-muted-foreground">
          {processo.comarca}
        </span>
      </div>

      {/* Row 2: Countdown, Responsavel, Semaforo */}
      <div className="flex flex-wrap items-center gap-4">
        <CountdownTimer
          targetDate={processo.dataFimStay}
          label="Stay"
        />
        {processo.responsavel && (
          <span className="text-sm font-medium text-[#4a7c9f]">
            Resp.: {processo.responsavel.nome ?? processo.responsavel}
          </span>
        )}
        <SemaforoIndicator status={semaforo} size="lg" showLabel />
      </div>

      {/* Row 3: Juiz, Vara, CNJ */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {processo.juiz && (
          <span>Juiz: {processo.juiz}</span>
        )}
        {processo.vara && (
          <span>Vara: {processo.vara}</span>
        )}
        {processo.numeroCnj && (
          <span>CNJ: {processo.numeroCnj}</span>
        )}
      </div>
    </div>
  )
}
