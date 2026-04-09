import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const honorario = await prisma.honorario.findUnique({
      where: { id },
      include: { recuperanda: true },
    })

    if (!honorario) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(honorario)
  } catch (error) {
    console.error('Get honorario error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { valorTotal, valorParcela, parcelaAtual, totalParcelas, status, dataProximoPagamento, diasAtraso } = body

    const honorario = await prisma.honorario.update({
      where: { id },
      data: {
        ...(valorTotal !== undefined && { valorTotal }),
        ...(valorParcela !== undefined && { valorParcela }),
        ...(parcelaAtual !== undefined && { parcelaAtual }),
        ...(totalParcelas !== undefined && { totalParcelas }),
        ...(status !== undefined && { status }),
        ...(dataProximoPagamento !== undefined && { dataProximoPagamento: dataProximoPagamento ? new Date(dataProximoPagamento) : null }),
        ...(diasAtraso !== undefined && { diasAtraso }),
      },
    })

    return NextResponse.json(honorario)
  } catch (error) {
    console.error('Update honorario error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.honorario.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete honorario error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
