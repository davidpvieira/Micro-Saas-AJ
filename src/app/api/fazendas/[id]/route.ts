import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const fazenda = await prisma.fazenda.findUnique({
      where: { id },
      include: { moduloRural: true },
    })

    if (!fazenda) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(fazenda)
  } catch (error) {
    console.error('Get fazenda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const { nome, municipio, areaHectares, geoLinkMaps, latLng, statusFitossanitario, cicloSafra, progressoSafra, creditosCPR, linkLaudoEngenheiro, linkLaudoSatelite, historiaClimatica } = body

    const fazenda = await prisma.fazenda.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(municipio !== undefined && { municipio }),
        ...(areaHectares !== undefined && { areaHectares }),
        ...(geoLinkMaps !== undefined && { geoLinkMaps }),
        ...(latLng !== undefined && { latLng }),
        ...(statusFitossanitario !== undefined && { statusFitossanitario }),
        ...(cicloSafra !== undefined && { cicloSafra }),
        ...(progressoSafra !== undefined && { progressoSafra }),
        ...(creditosCPR !== undefined && { creditosCPR }),
        ...(linkLaudoEngenheiro !== undefined && { linkLaudoEngenheiro }),
        ...(linkLaudoSatelite !== undefined && { linkLaudoSatelite }),
        ...(historiaClimatica !== undefined && { historiaClimatica }),
      },
    })

    return NextResponse.json(fazenda)
  } catch (error) {
    console.error('Update fazenda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await prisma.fazenda.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete fazenda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
