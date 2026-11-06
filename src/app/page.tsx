'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Sight } from '@/components/SightingMap'
import Timeline from '@/components/Timeline'

const SightingMap = dynamic(() => import('@/components/SightingMap'), { ssr: false })

export default function HomePage() {
  const [filters, setFilters] = useState({ from: '', to: '', species: '', city: '' })
  const [sightings, setSightings] = useState<Sight[]>([])
  const [selected, setSelected] = useState<Sight | null>(null)
  const [speciesList, setSpeciesList] = useState<{ species: string }[]>([])
  const [view, setView] = useState<'map' | 'list'>('map')

  useEffect(() => {
    fetch('/api/species').then((r) => r.json()).then(setSpeciesList)
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][]
    )
    fetch(`/api/sightings?${q}`).then((r) => r.json()).then(setSightings)
  }, [filters])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">UK Tick Sightings Map</h1>
      
      <section aria-label="Filters" className="flex flex-wrap gap-3 mb-4 p-4 bg-gray-100 rounded text-black">
        <input type="date" aria-label="From date" className="p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" aria-label="To date" className="p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <select aria-label="Species" className="p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, species: e.target.value })}>
          <option value="">All species</option>
          {speciesList.map((s) => <option key={s.species}>{s.species}</option>)}
        </select>
        <input placeholder="City" aria-label="City" className="p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        
        <button 
          onClick={() => setView(view === 'map' ? 'list' : 'map')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
        >
          {view === 'map' ? 'Show list view' : 'Show map view'}
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2">
          {view === 'map' ? (
            <SightingMap sightings={sightings} onSelect={setSelected} />
          ) : (
            <ul className="space-y-2 h-[70vh] overflow-y-auto p-4 border rounded bg-white text-black">
              {sightings.length === 0 && <li>No sightings match these filters.</li>}
              {sightings.map((s) => (
                <li key={s.id} className="border-b pb-2">
                  <button onClick={() => setSelected(s)} className="text-blue-600 hover:underline text-left">
                    <strong>{s.species}</strong> — {s.location} — {new Date(s.date).toLocaleDateString('en-GB')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <aside aria-label="Sighting details" className="border rounded p-4 bg-white shadow relative h-fit text-black">
            <button 
              onClick={() => setSelected(null)} 
              aria-label="Close details"
              className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold pr-6">{selected.species}</h2>
            <p className="italic text-gray-600 mb-2">{selected.latinName}</p>
            <p><strong>City:</strong> {selected.location}</p>
            <p><strong>Date:</strong> {new Date(selected.date).toLocaleString('en-GB')}</p>
            <p><strong>Source:</strong> {selected.source === 'external' ? 'API' : 'User Report'}</p>

            <div className="flex gap-4 mt-6">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                target="_blank" rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-sm"
              >
                Get directions
              </a>
              <button 
                className="text-blue-600 hover:underline text-sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Share
              </button>
            </div>

            {/* THIS IS THE NEW TIMELINE COMPONENT */}
            <Timeline city={selected.location} />
            
          </aside>
        )}
      </div>
    </div>
  )
}