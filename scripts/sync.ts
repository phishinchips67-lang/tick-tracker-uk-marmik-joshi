import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { z } from 'zod'
import { coordsFor } from '../src/lib/cities'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })
const BASE = process.env.ELANCO_API_URL ?? 'https://dev-task.elancoapps.com/data'

// Tolerate missing latinName etc. but require the essentials
const RawSighting = z.object({
  id: z.string().min(1),
  date: z.string(),
  location: z.string().min(1),
  species: z.string().min(1),
  latinName: z.string().optional().default('Unknown'),
})

async function get(url: string, tries = 4): Promise<Response> {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url)
    if (res.status === 429) {
      const wait = 1000 * 2 ** i // 1s, 2s, 4s, 8s
      console.warn(`Rate limited. Waiting ${wait}ms...`)
      await new Promise((r) => setTimeout(r, wait))
      continue
    }
    if (!res.ok) throw new Error(`${url} → ${res.status}`)
    return res
  }
  throw new Error('Still rate-limited after retries')
}

async function main() {
  const res = await get(`${BASE}/tick-sightings`)
  const json = await res.json()

  let ok = 0
  let skipped = 0
  const seen = new Set<string>()

  for (const raw of Array.isArray(json) ? json : []) {
    const parsed = RawSighting.safeParse(raw)
    if (!parsed.success) {
      skipped++
      continue
    }
    const s = parsed.data
    if (seen.has(s.id)) continue // in-batch duplicate
    seen.add(s.id)

    const date = new Date(s.date)
    if (isNaN(date.getTime())) {
      skipped++
      continue
    }

    const { lat, lng } = coordsFor(s.location)

    await prisma.sighting.upsert({
      where: { id: s.id },
      update: { date, location: s.location, species: s.species, latinName: s.latinName },
      create: {
        id: s.id,
        source: 'external',
        date,
        location: s.location,
        species: s.species,
        latinName: s.latinName,
        lat,
        lng,
      },
    })
    ok++
  }

  console.log(`Synced ${ok}, skipped ${skipped} invalid rows`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())