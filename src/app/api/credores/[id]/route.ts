import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const credor = await prisma.credor.findUnique({
      where: { id },
      include: {
        recuperanda: true,
        incidentes: true,
        mensagens: true,
      },
    })

    if (!credor) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(credor)
  } catch (error) {
    console.error('Get credor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { nome, cpfCnpj, classe, valorDeclarado, valorHabilitado, valorAtualizado, dataAtualizacao, indiceCorrecao, statusMediacao } = body

    const credor = await prisma.credor.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(cpfCnpj !== undefined && { cpfCnpj }),
        ...(classe !== undefined && { classe }),
        ...(valorDeclarado !== undefined && { valorDeclarado }),
        ...(valorHabilitado !== undefined && { valorHabilitado }),
        ...(valorAtualizado !== undefined && { valorAtualizado }),
        ...(dataAtualizacao !== undefined && { dataAtualizacao: dataAtualizacao ? new Date(dataAtualizacao) : null }),
        ...(indiceCorrecao !== undefined && { indiceCorrecao }),
        ...(statusMediacao !== undefined && { statusMediacao }),
      },
    })

    return NextResponse.json(credor)
  } catch (error) {
    console.error('Update credor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.credor.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete credor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
