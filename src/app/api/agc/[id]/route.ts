import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const agc = await prisma.aGC.findUnique({
      where: { id },
      include: { recuperanda: true },
    })

    if (!agc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(agc)
  } catch (error) {
    console.error('Get AGC error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { dataPrimeiraChamada, dataSegundaChamada, statusEdital, parceiroSandrini, statusAta, quorumPresente, etapaAtual } = body

    const agc = await prisma.aGC.update({
      where: { id },
      data: {
        ...(dataPrimeiraChamada !== undefined && { dataPrimeiraChamada: dataPrimeiraChamada ? new Date(dataPrimeiraChamada) : null }),
        ...(dataSegundaChamada !== undefined && { dataSegundaChamada: dataSegundaChamada ? new Date(dataSegundaChamada) : null }),
        ...(statusEdital !== undefined && { statusEdital }),
        ...(parceiroSandrini !== undefined && { parceiroSandrini }),
        ...(statusAta !== undefined && { statusAta }),
        ...(quorumPresente !== undefined && { quorumPresente }),
        ...(etapaAtual !== undefined && { etapaAtual }),
      },
    })

    return NextResponse.json(agc)
  } catch (error) {
    console.error('Update AGC error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
