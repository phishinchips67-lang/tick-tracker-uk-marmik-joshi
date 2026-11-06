'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(2, 'Please enter a city'),
  species: z.string().min(2, 'Please choose a species'),
  latinName: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ReportForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function onSubmit(values: FormData) {
    const body = new FormData()
    Object.entries(values).forEach(([k, v]) => body.append(k, v ?? ''))
    
    const file = (document.getElementById('image') as HTMLInputElement)?.files?.[0]
    if (file) body.append('image', file)

    try {
      const res = await fetch('/api/sightings', { method: 'POST', body })
      if (res.ok) {
        setStatus('success')
        reset()
        // Clear the file input manually
        const fileInput = document.getElementById('image') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setStatus('error')
      }
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 bg-white p-6 rounded shadow text-black">
      
      <div>
        <label htmlFor="date" className="block font-medium mb-1">Date *</label>
        <input id="date" type="date" {...register('date')}
          className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.date} aria-describedby="date-err" />
        {errors.date && <p id="date-err" role="alert" className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block font-medium mb-1">City *</label>
        <input id="location" {...register('location')} placeholder="e.g. London"
          className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.location} aria-describedby="loc-err" />
        {errors.location && <p id="loc-err" role="alert" className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="species" className="block font-medium mb-1">Species *</label>
        <select id="species" {...register('species')} 
          className={`w-full p-2 border rounded ${errors.species ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.species}>
          <option value="">Select a species…</option>
          <option value="Southern rodent tick">Southern rodent tick</option>
          <option value="Fox/badger tick">Fox/badger tick</option>
          <option value="Marsh tick">Marsh tick</option>
          <option value="Tree-hole tick">Tree-hole tick</option>
          <option value="Passerine tick">Passerine tick</option>
          <option value="Other">Other</option>
        </select>
        {errors.species && <p role="alert" className="text-red-500 text-sm mt-1">{errors.species.message}</p>}
      </div>

      <div>
        <label htmlFor="latinName" className="block font-medium mb-1">Latin Name (optional)</label>
        <input id="latinName" {...register('latinName')} placeholder="e.g. Ixodes ricinus"
          className="w-full p-2 border rounded" />
      </div>

      <div>
        <label htmlFor="image" className="block font-medium mb-1">Photo (optional, max 5MB)</label>
        <input id="image" type="file" accept="image/*" 
          className="w-full p-2 border rounded bg-gray-50" />
        <p className="text-xs text-gray-500 mt-1">By uploading you confirm this is your own photo.</p>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {isSubmitting ? 'Submitting…' : 'Report sighting'}
      </button>

      <div aria-live="polite" className="mt-4">
        {status === 'success' && <p className="text-green-700 font-bold bg-green-50 p-3 rounded">✅ Thanks! Your sighting was saved.</p>}
        {status === 'error' && <p className="text-red-700 font-bold bg-red-50 p-3 rounded">❌ Something went wrong. Please try again.</p>}
      </div>
    </form>
  )
}