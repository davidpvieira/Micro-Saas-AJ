import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const setor = searchParams.get('setor')
    const status = searchParams.get('status')
    const responsavelId = searchParams.get('responsavelId')

    const where: Record<string, unknown> = {}
    if (setor) where.setor = setor
    if (status) where.statusStay = status
    if (responsavelId) where.responsavelId = responsavelId

    const recuperandas = await prisma.recuperanda.findMany({
      where,
      include: {
        responsavel: true,
        obrigacoes: true,
        credores: true,
        honorarios: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(recuperandas)
  } catch (error) {
    console.error('List recuperandas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { nome, cnpj, setor, comarca, vara, juiz, numeroCNJ, dataDistribuicao, dataInicioStay, dataFimStay, responsavelId } = body

    if (!nome || !setor) {
      return NextResponse.json({ error: 'nome and setor are required' }, { status: 400 })
    }

    const recuperanda = await prisma.recuperanda.create({
      data: {
        nome,
        cnpj,
        setor,
        comarca,
        vara,
        juiz,
        numeroCNJ,
        dataDistribuicao: dataDistribuicao ? new Date(dataDistribuicao) : undefined,
        dataInicioStay: dataInicioStay ? new Date(dataInicioStay) : undefined,
        dataFimStay: dataFimStay ? new Date(dataFimStay) : undefined,
        responsavelId,
      },
    })

    return NextResponse.json(recuperanda, { status: 201 })
  } catch (error) {
    console.error('Create recuperanda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
