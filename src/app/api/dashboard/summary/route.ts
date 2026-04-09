import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const now = new Date()
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const in15days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)

    const [
      totalProcessos,
      honorariosAtrasados,
      prazos7dias,
      stayVencendo,
      processosPorSetor,
      recuperandas,
    ] = await Promise.all([
      prisma.recuperanda.count(),
      prisma.honorario.count({ where: { status: 'atrasado' } }),
      prisma.obrigacaoLegal.count({
        where: {
          prazoFinal: { lte: in7days, gte: now },
          status: { not: 'concluido' },
        },
      }),
      prisma.recuperanda.count({
        where: {
          dataFimStay: { lte: in30days, gte: now },
        },
      }),
      prisma.recuperanda.groupBy({
        by: ['setor'],
        _count: { id: true },
      }),
      prisma.recuperanda.findMany({
        include: {
          responsavel: true,
          obrigacoes: true,
          credores: true,
          honorarios: true,
          documentos: true,
          vistorias: true,
          agc: true,
          moduloRural: { include: { fazendas: true } },
        },
      }),
    ])

    // Calculate status distribution (verde/amarelo/vermelho)
    let verde = 0
    let amarelo = 0
    let vermelho = 0

    for (const r of recuperandas) {
      const hasHonorarioAtrasado = r.honorarios.some((h) => h.status === 'atrasado')
      const stayDaysLeft = r.dataFimStay
        ? (r.dataFimStay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity
      const hasPendingDocs = r.documentos.some((d) => d.status === 'pendente')

      if (hasHonorarioAtrasado || stayDaysLeft < 15) {
        vermelho++
      } else if (hasPendingDocs || stayDaysLeft < 30) {
        amarelo++
      } else {
        verde++
      }
    }

    return NextResponse.json({
      totalProcessos,
      honorariosAtrasados,
      prazos7dias,
      stayVencendo,
      processosPorSetor: processosPorSetor.map((g) => ({
        setor: g.setor,
        count: g._count.id,
      })),
      processosPorStatus: { verde, amarelo, vermelho },
      recuperandas,
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
