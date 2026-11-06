'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Timeline({ city }: { city: string }) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`/api/stats/trends?interval=week&city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then(setData)
  }, [city])

  return (
    <section aria-label={`Weekly sightings in ${city}`} className="mt-6 border-t pt-4">
      <h3 className="font-medium mb-2 text-sm text-gray-700">Weekly activity — {city}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="period" fontSize={10} />
          <YAxis allowDecimals={false} fontSize={10} />
          <Tooltip />
          <Line dataKey="count" stroke="#0d9488" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}