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

    const agcs = await prisma.aGC.findMany({
      where,
      include: { recuperanda: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(agcs)
  } catch (error) {
    console.error('List AGC error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, dataPrimeiraChamada, dataSegundaChamada, statusEdital, parceiroSandrini, statusAta, quorumPresente, etapaAtual } = body

    if (!recuperandaId) {
      return NextResponse.json({ error: 'recuperandaId is required' }, { status: 400 })
    }

    const agc = await prisma.aGC.create({
      data: {
        recuperandaId,
        dataPrimeiraChamada: dataPrimeiraChamada ? new Date(dataPrimeiraChamada) : undefined,
        dataSegundaChamada: dataSegundaChamada ? new Date(dataSegundaChamada) : undefined,
        statusEdital,
        parceiroSandrini,
        statusAta,
        quorumPresente,
        etapaAtual,
      },
    })

    return NextResponse.json(agc, { status: 201 })
  } catch (error) {
    console.error('Create AGC error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
