import ReportForm from '@/components/ReportForm'

export const metadata = {
  title: 'Report a sighting | Tick Tracker',
}

export default function ReportPage() {
  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Report a tick sighting</h1>
      <ReportForm />
    </div>
  )
}