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

    const documentos = await prisma.documentoPendente.findMany({
      where,
      include: { recuperanda: true },
      orderBy: { prazo: 'asc' },
    })

    return NextResponse.json(documentos)
  } catch (error) {
    console.error('List documentos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { recuperandaId, categoria, descricao, artigoReferencia, status, prazo } = body

    if (!recuperandaId || !categoria || !descricao) {
      return NextResponse.json({ error: 'recuperandaId, categoria, and descricao are required' }, { status: 400 })
    }

    const documento = await prisma.documentoPendente.create({
      data: {
        recuperandaId,
        categoria,
        descricao,
        artigoReferencia,
        status,
        prazo: prazo ? new Date(prazo) : undefined,
      },
    })

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error('Create documento error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
