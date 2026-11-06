import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const grouped = await prisma.sighting.groupBy({
      by: ['location'],
      _count: { _all: true },
      orderBy: { _count: { location: 'desc' } },
    })
    return NextResponse.json(
      grouped.map((g) => ({ region: g.location, count: g._count._all }))
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}