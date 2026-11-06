import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const interval = req.nextUrl.searchParams.get('interval') === 'month' ? 'month' : 'week'
  const city = req.nextUrl.searchParams.get('city')

  try {
    const rows = await prisma.sighting.findMany({
      where: city ? { location: city } : {},
      select: { date: true },
      orderBy: { date: 'asc' },
    })

    const buckets = new Map<string, number>()
    for (const { date } of rows) {
      const d = new Date(date)
      let key: string
      if (interval === 'month') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      } else {
        // ISO week starting Monday
        const day = (d.getDay() + 6) % 7
        d.setDate(d.getDate() - day)
        key = d.toISOString().slice(0, 10)
      }
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }

    const data = [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count }))

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}