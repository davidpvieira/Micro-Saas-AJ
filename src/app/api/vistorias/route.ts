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

    const vistorias = await prisma.vistoria.findMany({
      where,
      include: { recuperanda: true },
      orderBy: { dataVistoria: 'desc' },
    })

    return NextResponse.json(vistorias)
  } catch (error) {
    console.error('List vistorias error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, dataVistoria, observacoes, fotoLinks, proximaVisita, status } = body

    if (!recuperandaId || !dataVistoria) {
      return NextResponse.json({ error: 'recuperandaId and dataVistoria are required' }, { status: 400 })
    }

    const vistoria = await prisma.vistoria.create({
      data: {
        recuperandaId,
        dataVistoria: new Date(dataVistoria),
        observacoes,
        fotoLinks,
        proximaVisita: proximaVisita ? new Date(proximaVisita) : undefined,
        status,
      },
    })

    return NextResponse.json(vistoria, { status: 201 })
  } catch (error) {
    console.error('Create vistoria error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
