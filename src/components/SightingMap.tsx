'use client'
import { usePathname } from 'next/navigation'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export type Sight = {
  id: string
  date: string
  location: string
  species: string
  latinName: string
  lat: number
  lng: number
  source: string
}

function colorFor(dateStr: string) {
  const days = (Date.now() - new Date(dateStr).getTime()) / 86400000
  if (days <= 14) return '#dc2626' // recent — red
  if (days <= 90) return '#f59e0b' // medium — amber
  return '#6b7280'                 // older — grey
}

function jitter(id: string) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 1000
  return { dLat: ((h % 20) - 10) / 1500, dLng: (((h / 20) | 0) % 20 - 10) / 1500 }
}

export default function SightingMap({
  sightings,
  onSelect,
}: {
  sightings: Sight[]
  onSelect: (s: Sight) => void
}) {
  // This hook gets the current URL path (e.g. "/" or "/report")
  const pathname = usePathname()

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <MapContainer 
        // By using the pathname as a Key, we force a completely fresh map
        // every time you navigate to a new page and come back.
        key={pathname} 
        center={[54.5, -3]} 
        zoom={5.5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sightings.map((s) => {
          const { dLat, dLng } = jitter(s.id)
          return (
            <CircleMarker
              key={s.id}
              center={[s.lat + dLat, s.lng + dLng]}
              radius={7}
              pathOptions={{ color: colorFor(s.date), fillOpacity: 0.7 }}
              eventHandlers={{ click: () => onSelect(s) }}
            >
              <Popup>
                <strong>{s.species}</strong>
                <br />
                {s.location} — {new Date(s.date).toLocaleDateString('en-GB')}
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}