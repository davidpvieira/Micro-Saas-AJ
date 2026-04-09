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

    const obrigacoes = await prisma.obrigacaoLegal.findMany({
      where,
      include: { recuperanda: true },
      orderBy: { prazoFinal: 'asc' },
    })

    return NextResponse.json(obrigacoes)
  } catch (error) {
    console.error('List obrigacoes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, descricao, artigoLegal, status, dataProtocolo, prazoFinal, prazoAlertaDias, linkDocumento } = body

    if (!recuperandaId || !descricao) {
      return NextResponse.json({ error: 'recuperandaId and descricao are required' }, { status: 400 })
    }

    const obrigacao = await prisma.obrigacaoLegal.create({
      data: {
        recuperandaId,
        descricao,
        artigoLegal,
        status,
        dataProtocolo: dataProtocolo ? new Date(dataProtocolo) : undefined,
        prazoFinal: prazoFinal ? new Date(prazoFinal) : undefined,
        prazoAlertaDias,
        linkDocumento,
      },
    })

    return NextResponse.json(obrigacao, { status: 201 })
  } catch (error) {
    console.error('Create obrigacao error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
