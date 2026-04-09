import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const recuperandaId = req.nextUrl.searchParams.get('recuperandaId')

    const where: Record<string, unknown> = {}
    if (recuperandaId) where.recuperandaId = recuperandaId

    const honorarios = await prisma.honorario.findMany({
      where,
      include: { recuperanda: true },
      orderBy: { dataProximoPagamento: 'asc' },
    })

    return NextResponse.json(honorarios)
  } catch (error) {
    console.error('List honorarios error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, valorTotal, valorParcela, totalParcelas, dataProximoPagamento } = body

    if (!recuperandaId || valorTotal == null || valorParcela == null || !totalParcelas) {
      return NextResponse.json({ error: 'recuperandaId, valorTotal, valorParcela, and totalParcelas are required' }, { status: 400 })
    }

    const honorario = await prisma.honorario.create({
      data: {
        recuperandaId,
        valorTotal,
        valorParcela,
        totalParcelas,
        dataProximoPagamento: dataProximoPagamento ? new Date(dataProximoPagamento) : undefined,
      },
    })

    return NextResponse.json(honorario, { status: 201 })
  } catch (error) {
    console.error('Create honorario error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
