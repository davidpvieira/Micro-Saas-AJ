import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { resposta, statusResposta } = body

    const mensagem = await prisma.mensagemMediacao.update({
      where: { id },
      data: {
        resposta,
        statusResposta: statusResposta || 'respondida',
        dataResposta: new Date(),
      },
    })

    return NextResponse.json(mensagem)
  } catch (error) {
    console.error('Mediacao PATCH error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
