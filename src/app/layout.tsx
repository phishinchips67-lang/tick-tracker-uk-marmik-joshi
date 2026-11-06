import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Tick Tracker',
  description: 'Track tick sightings across the UK',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="bg-gray-50 text-black">
        
        {/* Accessibility: Skip Link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded focus:z-50"
        >
          Skip to content
        </a>

        <header className="bg-white border-b shadow-sm">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex gap-6 items-center">
            <Link href="/" className="font-bold text-xl text-blue-600">Tick Tracker</Link>
            <div className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600">Map</Link>
              <Link href="/learn/species" className="hover:text-blue-600">Identify Ticks</Link>
              <Link href="/learn/prevention" className="hover:text-blue-600">Prevention</Link>
              <Link href="/report" className="hover:text-blue-600">Report a Sighting</Link>
            </div>
          </nav>
        </header>

        <main id="main" className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t mt-12 py-6 text-sm text-gray-500 text-center bg-white">
          Tick Tracker MVP — data provided by Elanco / dev-task.elancoapps.com
        </footer>
      </body>
    </html>
  )
}