import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { credorId, texto } = body

    if (!credorId || !texto || texto.length < 10) {
      return NextResponse.json(
        { error: 'credorId e texto (min 10 chars) são obrigatórios' },
        { status: 400 }
      )
    }

    // Verify credor exists
    const credor = await prisma.credor.findUnique({ where: { id: credorId } })
    if (!credor) {
      return NextResponse.json({ error: 'Credor não encontrado' }, { status: 404 })
    }

    // Create mediation message
    const mensagem = await prisma.mensagemMediacao.create({
      data: { credorId, texto },
    })

    // Update credor mediation status if first proposal
    if (credor.statusMediacao === 'sem_proposta') {
      await prisma.credor.update({
        where: { id: credorId },
        data: { statusMediacao: 'proposta_enviada' },
      })
    }

    return NextResponse.json(mensagem, { status: 201 })
  } catch (error) {
    console.error('Mediacao POST error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
