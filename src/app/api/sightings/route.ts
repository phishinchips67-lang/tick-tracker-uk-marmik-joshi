import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { coordsFor } from '@/lib/cities'

// GET ROUTE
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const where: Prisma.SightingWhereInput = {}

  const from = sp.get('from')
  const to = sp.get('to')
  
  if (from || to) {
    where.date = {}
    if (from) where.date.gte = new Date(from)
    if (to) where.date.lte = new Date(to)
  }
  
  if (sp.get('city')) where.location = sp.get('city')!
  if (sp.get('species')) where.species = sp.get('species')!

  try {
    const sightings = await prisma.sighting.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 2000,
    })
    return NextResponse.json(sightings)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST ROUTE 
const ReportSchema = z.object({
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  location: z.string().min(2, 'Location is required'),
  species: z.string().min(2, 'Species is required'),
  latinName: z.string().optional().default('Unknown'),
})

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const parsed = ReportSchema.safeParse({
      date: form.get('date'),
      location: form.get('location'),
      species: form.get('species'),
      latinName: form.get('latinName') ?? undefined,
    })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    let imageUrl: string | undefined
    const file = form.get('image')
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith('image/'))
        return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
      if (file.size > 5 * 1024 * 1024)
        return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const name = `${crypto.randomUUID()}.${ext}`
      const dir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(dir, { recursive: true })
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))
      imageUrl = `/uploads/${name}`
    }

    const d = parsed.data
    const { lat, lng } = coordsFor(d.location)

    const sighting = await prisma.sighting.create({
      data: {
        id: crypto.randomUUID(),
        source: 'user',
        date: new Date(d.date),
        location: d.location,
        species: d.species,
        latinName: d.latinName,
        lat,
        lng,
        imageUrl,
      },
    })

    return NextResponse.json(sighting, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}