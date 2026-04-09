import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUBLIC route — no auth check (LGPD-safe: limited fields only)
export async function GET(req: NextRequest) {
  try {
    const cpfCnpj = req.nextUrl.searchParams.get('cpfCnpj')

    if (!cpfCnpj) {
      return NextResponse.json({ error: 'cpfCnpj query param is required' }, { status: 400 })
    }

    const credores = await prisma.credor.findMany({
      where: { cpfCnpj },
      select: {
        id: true,
        nome: true,
        classe: true,
        valorDeclarado: true,
        valorHabilitado: true,
        incidentes: {
          select: {
            tipo: true,
            status: true,
          },
        },
        recuperanda: {
          select: {
            nome: true,
          },
        },
      },
    })

    return NextResponse.json(credores)
  } catch (error) {
    console.error('Buscar credor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
