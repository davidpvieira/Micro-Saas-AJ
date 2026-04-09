import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const obrigacao = await prisma.obrigacaoLegal.findUnique({
      where: { id },
      include: { recuperanda: true },
    })

    if (!obrigacao) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(obrigacao)
  } catch (error) {
    console.error('Get obrigacao error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { descricao, artigoLegal, status, dataProtocolo, prazoFinal, prazoAlertaDias, linkDocumento } = body

    const obrigacao = await prisma.obrigacaoLegal.update({
      where: { id },
      data: {
        ...(descricao !== undefined && { descricao }),
        ...(artigoLegal !== undefined && { artigoLegal }),
        ...(status !== undefined && { status }),
        ...(dataProtocolo !== undefined && { dataProtocolo: dataProtocolo ? new Date(dataProtocolo) : null }),
        ...(prazoFinal !== undefined && { prazoFinal: prazoFinal ? new Date(prazoFinal) : null }),
        ...(prazoAlertaDias !== undefined && { prazoAlertaDias }),
        ...(linkDocumento !== undefined && { linkDocumento }),
      },
    })

    return NextResponse.json(obrigacao)
  } catch (error) {
    console.error('Update obrigacao error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.obrigacaoLegal.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete obrigacao error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
