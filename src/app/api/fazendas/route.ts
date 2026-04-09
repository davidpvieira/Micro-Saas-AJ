import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const moduloRuralId = req.nextUrl.searchParams.get('moduloRuralId')

    const where: Record<string, unknown> = {}
    if (moduloRuralId) where.moduloRuralId = moduloRuralId

    const fazendas = await prisma.fazenda.findMany({
      where,
      include: { moduloRural: true },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(fazendas)
  } catch (error) {
    console.error('List fazendas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { moduloRuralId, nome, municipio, areaHectares, geoLinkMaps, latLng, statusFitossanitario, cicloSafra, progressoSafra, creditosCPR, linkLaudoEngenheiro, linkLaudoSatelite } = body

    if (!moduloRuralId || !nome) {
      return NextResponse.json({ error: 'moduloRuralId and nome are required' }, { status: 400 })
    }

    const fazenda = await prisma.fazenda.create({
      data: {
        moduloRuralId,
        nome,
        municipio,
        areaHectares,
        geoLinkMaps,
        latLng,
        statusFitossanitario,
        cicloSafra,
        progressoSafra,
        creditosCPR,
        linkLaudoEngenheiro,
        linkLaudoSatelite,
      },
    })

    return NextResponse.json(fazenda, { status: 201 })
  } catch (error) {
    console.error('Create fazenda error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
