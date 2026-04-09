import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { kanbanColuna } = body

    if (!kanbanColuna) {
      return NextResponse.json({ error: 'kanbanColuna is required' }, { status: 400 })
    }

    const recuperanda = await prisma.recuperanda.update({
      where: { id },
      data: { kanbanColuna },
    })

    return NextResponse.json(recuperanda)
  } catch (error) {
    console.error('Update kanban error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
