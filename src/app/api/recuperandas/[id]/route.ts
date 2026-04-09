import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const recuperanda = await prisma.recuperanda.findUnique({
      where: { id },
      include: {
        responsavel: true,
        obrigacoes: true,
        credores: true,
        incidentes: true,
        honorarios: true,
        documentos: true,
        vistorias: true,
        agc: true,
        moduloRural: { include: { fazendas: true } },
        monitoramento: true,
        advogados: true,
      },
    })

    if (!recuperanda) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(recuperanda)
  } catch (error) {
    console.error('Get recuperanda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { nome, cnpj, setor, comarca, vara, juiz, numeroCNJ, dataDistribuicao, statusStay, dataInicioStay, dataFimStay, kanbanColuna, responsavelId } = body

    const recuperanda = await prisma.recuperanda.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(cnpj !== undefined && { cnpj }),
        ...(setor !== undefined && { setor }),
        ...(comarca !== undefined && { comarca }),
        ...(vara !== undefined && { vara }),
        ...(juiz !== undefined && { juiz }),
        ...(numeroCNJ !== undefined && { numeroCNJ }),
        ...(dataDistribuicao !== undefined && { dataDistribuicao: dataDistribuicao ? new Date(dataDistribuicao) : null }),
        ...(statusStay !== undefined && { statusStay }),
        ...(dataInicioStay !== undefined && { dataInicioStay: dataInicioStay ? new Date(dataInicioStay) : null }),
        ...(dataFimStay !== undefined && { dataFimStay: dataFimStay ? new Date(dataFimStay) : null }),
        ...(kanbanColuna !== undefined && { kanbanColuna }),
        ...(responsavelId !== undefined && { responsavelId }),
      },
    })

    return NextResponse.json(recuperanda)
  } catch (error) {
    console.error('Update recuperanda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.recuperanda.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete recuperanda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
