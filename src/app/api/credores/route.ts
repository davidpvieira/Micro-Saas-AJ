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

    const credores = await prisma.credor.findMany({
      where,
      include: {
        recuperanda: true,
        incidentes: true,
        mensagens: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(credores)
  } catch (error) {
    console.error('List credores error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, nome, cpfCnpj, classe, valorDeclarado, valorHabilitado, indiceCorrecao } = body

    if (!recuperandaId || !nome || !classe) {
      return NextResponse.json({ error: 'recuperandaId, nome, and classe are required' }, { status: 400 })
    }

    const credor = await prisma.credor.create({
      data: {
        recuperandaId,
        nome,
        cpfCnpj,
        classe,
        valorDeclarado: valorDeclarado ?? 0,
        valorHabilitado,
        indiceCorrecao,
      },
    })

    return NextResponse.json(credor, { status: 201 })
  } catch (error) {
    console.error('Create credor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
