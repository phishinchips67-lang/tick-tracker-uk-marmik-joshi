# 🕷️ Tick Tracker - Full-Stack MVP

**Author:** Marmik Joshi

A full-stack web application built for the Elanco Placement Program Technical Task. This platform brings tick sighting data to life, allowing users to visualize outbreaks, explore trends, and contribute new data to combat tick-borne diseases.

## 🛠️ Tech Stack & Architecture Choices

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Mapping:** Leaflet + React-Leaflet (OpenStreetMap)
- **Charts:** Recharts
- **Validation:** Zod + React Hook Form
- **Styling:** Tailwind CSS

**Why this stack?**
Next.js was chosen to keep the frontend and backend in a single, cohesive repository. Prisma and SQLite provide a zero-config, type-safe database that is incredibly easy to run locally. Leaflet was chosen over Google Maps or Mapbox as it requires no API keys or billing accounts, making it perfect for an MVP.

## 📂 Project Structure

```text
tick-tracker/
├── docs/
│   └── wireframes.md            # UI/UX design thought process
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # Local SQLite database
├── public/
│   └── uploads/                 # User-submitted tick images
├── scripts/
│   └── sync.ts                  # External API ingestion script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sightings/route.ts  # GET (filter) & POST (new report)
│   │   │   ├── species/route.ts    # GET unique species for dropdowns
│   │   │   └── stats/
│   │   │       ├── regions/route.ts # GET sightings per city
│   │   │       └── trends/route.ts  # GET weekly/monthly trend data
│   │   ├── learn/
│   │   │   ├── prevention/page.tsx # Tick bite prevention tips
│   │   │   └── species/page.tsx    # Guide to identify UK ticks
│   │   ├── report/page.tsx         # Page wrapper for the report form
│   │   ├── layout.tsx              # Root layout with Nav & Skip Link
│   │   └── page.tsx                # Home page (Map & Filters)
│   ├── components/
│   │   ├── ReportForm.tsx          # Form with Zod validation & image upload
│   │   ├── SightingMap.tsx         # Leaflet map with dynamic markers
│   │   └── Timeline.tsx            # Recharts weekly trend chart
│   └── lib/
│       ├── cities.ts               # Static UK city coordinates mapper
│       └── prisma.ts               # Prisma client singleton (with adapter)
├── .env                         
├── next.config.ts
└── package.json 


### Data Flow
The external Elanco API is read-only and rate-limited. Therefore, the app uses a **Sync Script** (`scripts/sync.ts`) to fetch the raw data, validate it, map the city names to geographic coordinates, and cache it in the local SQLite database. The browser only ever talks to our own Next.js API, which serves data from the cache and merges it with new user-submitted reports.

## How to Run Locally

1. Clone the repo and install dependencies:
   ```bash
   npm install

2. Create a .env file in the root and add:
DATABASE_URL="file:./dev.db"
ELANCO_API_URL="https://dev-task.elancoapps.com/data"

3. Push the Prisma schema to create the database:
npx prisma migrate dev --name init

4. Fetch the data from the external API into your local database:
npm run sync

5. Start the development server:
npm run dev