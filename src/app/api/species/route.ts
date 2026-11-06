import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const species = await prisma.sighting.findMany({
      distinct: ['species'],
      select: { species: true, latinName: true },
      orderBy: { species: 'asc' },
    })
    return NextResponse.json(species)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}