import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const honorario = await prisma.honorario.findUnique({ where: { id } })

    if (!honorario) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const newParcelaAtual = honorario.parcelaAtual + 1
    const isPaid = newParcelaAtual > honorario.totalParcelas
    const isCaughtUp = newParcelaAtual >= honorario.parcelaAtual

    // Calculate next payment date (30 days from current due date or now)
    const baseDate = honorario.dataProximoPagamento ?? new Date()
    const nextPaymentDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    const updated = await prisma.honorario.update({
      where: { id },
      data: {
        parcelaAtual: newParcelaAtual,
        status: isPaid ? 'pago' : isCaughtUp ? 'em_dia' : honorario.status,
        diasAtraso: isCaughtUp ? 0 : honorario.diasAtraso,
        dataProximoPagamento: isPaid ? null : nextPaymentDate,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Registrar pagamento error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
