import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Formatters ───────────────────────────────────────────────────────

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarData(data: Date | string): string {
  const date = typeof data === 'string' ? parseISO(data) : data
  return format(date, 'dd/MM/yyyy')
}

// ── Date Calculations ────────────────────────────────────────────────

export function calcularDiasStay(dataFimStay: Date | string | null): number | null {
  if (!dataFimStay) return null
  const date = typeof dataFimStay === 'string' ? parseISO(dataFimStay) : dataFimStay
  return differenceInDays(date, new Date())
}

export function calcularDiasAtraso(data: Date | string): number {
  const date = typeof data === 'string' ? parseISO(data) : data
  const dias = differenceInDays(new Date(), date)
  return dias > 0 ? dias : 0
}

// ── Semaphore Logic ──────────────────────────────────────────────────

export function calcularSemaforo(
  processo: any
): 'verde' | 'amarelo' | 'vermelho' {
  // ── VERMELHO conditions ──
  if (
    processo.honorario?.status === 'atrasado' &&
    processo.honorario?.dataProximoPagamento &&
    calcularDiasAtraso(processo.honorario.dataProximoPagamento) > 5
  ) {
    return 'vermelho'
  }

  const diasStay = calcularDiasStay(processo.dataFimStay ?? null)
  if (diasStay !== null && diasStay < 15) {
    return 'vermelho'
  }

  const obrigacoes: any[] = processo.obrigacoes ?? []
  if (obrigacoes.some((o: any) => o.status === 'vencido')) {
    return 'vermelho'
  }

  if (processo.rmaFiled === false) {
    return 'vermelho'
  }

  // ── AMARELO conditions ──
  const documentos: any[] = processo.documentos ?? []
  if (
    documentos.some(
      (d: any) => d.categoria === 'art51' && d.status === 'pendente'
    )
  ) {
    return 'amarelo'
  }

  if (diasStay !== null && diasStay < 30) {
    return 'amarelo'
  }

  if (
    obrigacoes.some((o: any) => {
      if (!o.prazoFinal) return false
      const diasRestantes = differenceInDays(
        typeof o.prazoFinal === 'string' ? parseISO(o.prazoFinal) : o.prazoFinal,
        new Date()
      )
      return diasRestantes >= 0 && diasRestantes < 7
    })
  ) {
    return 'amarelo'
  }

  if (obrigacoes.some((o: any) => o.status === 'ia_pendente')) {
    return 'amarelo'
  }

  if (
    processo.setor === 'agronegocio' &&
    processo.fazendas?.some((f: any) => !f.laudoFitossanitario)
  ) {
    return 'amarelo'
  }

  // ── VERDE ──
  return 'verde'
}

// ── Alerts Generator ─────────────────────────────────────────────────

export function calcularAlertas(
  processo: any
): Array<{ tipo: 'vermelho' | 'amarelo' | 'azul'; mensagem: string }> {
  const alertas: Array<{ tipo: 'vermelho' | 'amarelo' | 'azul'; mensagem: string }> = []

  // ── Vermelho alerts ──
  if (
    processo.honorario?.status === 'atrasado' &&
    processo.honorario?.dataProximoPagamento
  ) {
    const diasAtraso = calcularDiasAtraso(processo.honorario.dataProximoPagamento)
    if (diasAtraso > 5) {
      alertas.push({
        tipo: 'vermelho',
        mensagem: `Honor\u00e1rio atrasado h\u00e1 ${diasAtraso} dias`,
      })
    }
  }

  const diasStay = calcularDiasStay(processo.dataFimStay ?? null)
  if (diasStay !== null && diasStay < 15) {
    alertas.push({
      tipo: 'vermelho',
      mensagem: `Stay period expira em ${diasStay} dias`,
    })
  }

  const obrigacoes: any[] = processo.obrigacoes ?? []
  const obrigacoesVencidas = obrigacoes.filter((o: any) => o.status === 'vencido')
  if (obrigacoesVencidas.length > 0) {
    alertas.push({
      tipo: 'vermelho',
      mensagem: `${obrigacoesVencidas.length} obriga\u00e7\u00e3o(oes) vencida(s)`,
    })
  }

  if (processo.rmaFiled === false) {
    alertas.push({
      tipo: 'vermelho',
      mensagem: 'RMA n\u00e3o protocolado',
    })
  }

  // ── Amarelo alerts ──
  const documentos: any[] = processo.documentos ?? []
  const docsPendentesArt51 = documentos.filter(
    (d: any) => d.categoria === 'art51' && d.status === 'pendente'
  )
  if (docsPendentesArt51.length > 0) {
    alertas.push({
      tipo: 'amarelo',
      mensagem: `${docsPendentesArt51.length} documento(s) Art.51 pendente(s)`,
    })
  }

  if (diasStay !== null && diasStay >= 15 && diasStay < 30) {
    alertas.push({
      tipo: 'amarelo',
      mensagem: `Stay period expira em ${diasStay} dias`,
    })
  }

  obrigacoes.forEach((o: any) => {
    if (!o.prazoFinal) return
    const diasRestantes = differenceInDays(
      typeof o.prazoFinal === 'string' ? parseISO(o.prazoFinal) : o.prazoFinal,
      new Date()
    )
    if (diasRestantes >= 0 && diasRestantes < 7) {
      alertas.push({
        tipo: 'amarelo',
        mensagem: `Obriga\u00e7\u00e3o "${o.descricao}" vence em ${diasRestantes} dias`,
      })
    }
  })

  // ── Azul alerts ──
  const iaPendentes = obrigacoes.filter((o: any) => o.status === 'ia_pendente')
  if (iaPendentes.length > 0) {
    alertas.push({
      tipo: 'azul',
      mensagem: `${iaPendentes.length} tarefa(s) de IA pendente(s)`,
    })
  }

  if (
    processo.setor === 'agronegocio' &&
    processo.fazendas?.some((f: any) => !f.laudoFitossanitario)
  ) {
    alertas.push({
      tipo: 'amarelo',
      mensagem: 'Fazenda sem laudo fitossanit\u00e1rio',
    })
  }

  return alertas
}
