import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Identify Ticks | Tick Tracker',
}

export default async function SpeciesPage() {
  // Fetch directly from Prisma since this is a Server Component
  const species = await prisma.sighting.findMany({
    distinct: ['species'],
    select: { species: true, latinName: true },
    orderBy: { species: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Identify Ticks</h1>
      <p className="text-gray-600 mb-8">Learn about the different species of ticks found in the UK.</p>
      
      <ul className="grid md:grid-cols-2 gap-6">
        {species.map((s) => (
          <li key={s.species} className="border rounded p-6 bg-white shadow-sm">
            <h2 className="font-bold text-lg text-blue-700">{s.species}</h2>
            <p className="italic text-gray-500 mb-4">{s.latinName}</p>
            <p className="text-sm text-gray-700">
              Found across UK gardens and woodland. Always check yourself after walks in long grass.
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}