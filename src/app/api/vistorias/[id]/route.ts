import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const vistoria = await prisma.vistoria.findUnique({
      where: { id },
      include: { recuperanda: true },
    })

    if (!vistoria) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(vistoria)
  } catch (error) {
    console.error('Get vistoria error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { dataVistoria, observacoes, fotoLinks, proximaVisita, status } = body

    const vistoria = await prisma.vistoria.update({
      where: { id },
      data: {
        ...(dataVistoria !== undefined && { dataVistoria: new Date(dataVistoria) }),
        ...(observacoes !== undefined && { observacoes }),
        ...(fotoLinks !== undefined && { fotoLinks }),
        ...(proximaVisita !== undefined && { proximaVisita: proximaVisita ? new Date(proximaVisita) : null }),
        ...(status !== undefined && { status }),
      },
    })

    return NextResponse.json(vistoria)
  } catch (error) {
    console.error('Update vistoria error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.vistoria.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete vistoria error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
