# 🕷️ Tick Tracker - Full-Stack MVP

**Author:** Marmik Joshi

**Video Walkthrough:** https://drive.google.com/file/d/1-Cn9hIbDKmFXp2b_DauZFKBCAhSe1HXw/view?usp=sharing

A full-stack web application developed for the **Elanco Placement Program Technical Task**.

Tick Tracker transforms tick sighting data into actionable visual insights. Users can explore geographical distributions, identify activity trends, filter reported sightings, and contribute new observations. The platform aims to make tick surveillance data more accessible while supporting awareness of tick-borne diseases.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack application framework |
| TypeScript | Static typing and maintainability |
| SQLite | Lightweight relational database |
| Prisma ORM | Database access and schema management |
| Leaflet & React-Leaflet | Interactive geographical visualisation |
| OpenStreetMap | Map tile provider |
| Recharts | Data visualisation and trend analysis |
| Zod | Schema validation |
| React Hook Form | Form state and submission handling |
| Tailwind CSS | Responsive UI styling |

### Architectural Decisions

The technology stack was selected to prioritise simplicity, maintainability, and ease of local development.

- **Next.js:** Provides frontend and backend functionality within a single repository, reducing architectural complexity.
- **Prisma + SQLite:** Offers type-safe database access with minimal configuration, making the application straightforward to set up locally.
- **Leaflet + OpenStreetMap:** Provides interactive mapping without requiring paid API access or additional API keys.
- **Recharts:** Simplifies the implementation of responsive, component-based charts for analysing sighting trends.
- **Zod + React Hook Form:** Combines structured validation with efficient form management, improving data integrity and user experience.

The overall architecture keeps the application lightweight while leaving room for future scalability.

---

## 📂 Project Structure

```text
tick-tracker/
├── docs/
│   └── wireframes.md              # UI/UX design documentation
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── dev.db                     # Local SQLite database
├── public/
│   └── uploads/                   # User-submitted tick images
├── scripts/
│   └── sync.ts                    # External API ingestion script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sightings/
│   │   │   │   └── route.ts        # GET sightings and POST reports
│   │   │   ├── species/
│   │   │   │   └── route.ts       # Retrieve available species
│   │   │   └── stats/
│   │   │       ├── regions/
│   │   │       │   └── route.ts   # Sightings grouped by city
│   │   │       └── trends/
│   │   │           └── route.ts   # Weekly/monthly trend data
│   │   ├── learn/
│   │   │   ├── prevention/
│   │   │   │   └── page.tsx      # Tick bite prevention guidance
│   │   │   └── species/
│   │   │       └── page.tsx      # UK tick identification guide
│   │   ├── report/
│   │   │   └── page.tsx          # Sighting submission page
│   │   ├── layout.tsx             # Root layout, navigation and skip link
│   │   └── page.tsx               # Main dashboard
│   ├── components/
│   │   ├── ReportForm.tsx         # Validated reporting form
│   │   ├── SightingMap.tsx        # Interactive Leaflet map
│   │   └── Timeline.tsx           # Recharts trend visualisation
│   └── lib/
│       ├── cities.ts              # UK city coordinate mappings
│       └── prisma.ts              # Prisma client singleton
├── .env                           # Environment configuration
├── next.config.ts                 # Next.js configuration
└── package.json                   # Dependencies and scripts
```

---

## 🧠 Data Handling & Processing

### External API Synchronisation

The external Elanco API is read-only, does not provide geographical coordinates, and is subject to rate limiting.

To handle these limitations, I implemented a dedicated ingestion pipeline in `scripts/sync.ts`. This separates external data retrieval from the application's core functionality and ensures that imported records are validated before entering the database.

Key implementation details:

**1. Rate Limit Handling**

The synchronisation script implements exponential backoff to handle HTTP `429 Too Many Requests` responses.

When rate-limited, the script retries after progressively longer intervals:

`1s → 2s → 4s → 8s`

This reduces unnecessary requests and makes the ingestion process more resilient to temporary API restrictions.

**2. Data Validation & Incomplete Records**

Zod is used to validate incoming API responses before processing them.

Records missing essential fields, such as an external ID or date, are skipped and logged rather than being inserted into the database. This prevents malformed data from causing database errors.

**3. Deduplication & Idempotency**

Prisma `upsert` operations use the unique external ID to identify existing records.

This makes the synchronisation process idempotent: repeatedly running the script updates existing records instead of creating duplicates.

**4. Geographical Mapping**

Since the external API provides city names rather than latitude and longitude coordinates, I implemented a static `UK_CITIES` mapping in `src/lib/cities.ts`.

Known cities are mapped to predefined coordinates. For unknown cities, a deterministic hash-based fallback generates stable coordinates near the UK centre, ensuring that unexpected API values do not break map rendering.

---

## 🚧 Key Technical Challenges & Solutions

During development, I encountered and resolved two significant compatibility and integration challenges.

### 1. Prisma 7: SQLite Driver Adapter Migration

**The Challenge**

Prisma 7 introduced changes to database connectivity, requiring a driver adapter for the SQLite setup used in this project.

Initially, the application encountered a `PrismaClientInitializationError` because the previous default connection approach was no longer compatible with the updated configuration.

**The Solution**

After investigating the Prisma 7 migration requirements, I integrated `@prisma/adapter-better-sqlite3`.

I updated both the Prisma client singleton (`src/lib/prisma.ts`) and the synchronisation script to initialise Prisma using the SQLite driver adapter.

**Outcome**

- Restored reliable SQLite connectivity.
- Ensured consistent database access across the application and ingestion script.
- Updated the implementation to align with Prisma 7's driver adapter architecture.

### 2. Next.js Navigation: React-Leaflet Map Lifecycle

**The Challenge**

Navigating away from the map page and subsequently returning caused Leaflet rendering errors:

- `Cannot read properties of undefined (reading 'appendChild')`
- `Map container is being reused by another instance`

This occurred because Leaflet maintains its own internal references to DOM elements, while Next.js navigation and React component lifecycle behaviour can cause the map container to be reused unexpectedly.

**The Solution**

I used Next.js's `usePathname` hook to track the current route.

The pathname is passed as a `key` prop to the `MapContainer`, forcing React to remount the map component when the route changes.

This ensures that Leaflet receives a fresh container instead of attempting to initialise an existing map instance.

**Outcome**

- Resolved map container reuse errors.
- Improved reliability when navigating between pages.
- Ensured clean map initialisation across navigation events.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites

Ensure the following are installed:

- Node.js (compatible with your Next.js version)
- npm
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd tick-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
ELANCO_API_URL="https://dev-task.elancoapps.com/data"
```

### 4. Initialise the Database

Apply the Prisma schema and create the local SQLite database:

```bash
npx prisma migrate dev --name init
```

### 5. Synchronise External Data

Run the ingestion script to retrieve and import the available records:

```bash
npm run sync
```

### 6. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

**http://localhost:3000**

---

## 📋 Feature Checklist — Elanco Technical Brief

The following features have been implemented as part of the MVP.

### Core Functionality

- [x] **Interactive Map:** Leaflet-based map displaying geographical tick sightings.
- [x] **Visual Indicators:** Colour-coded markers representing sighting recency (red for recent, amber for medium, grey for older).
- [x] **Filter Controls:** Filter sightings by date range, species, and city.
- [x] **Sighting Details:** Sidebar containing detailed sighting information, directions, and sharing functionality.
- [x] **Timeline Visualisation:** Dynamic weekly activity chart for the selected city.
- [x] **Educational Resources:** Tick species identification guide and bite prevention information.
- [x] **Sighting Submission:** Reporting form with Zod validation, image uploads, and submission feedback.

### Reliability & Data Management

- [x] **Backend Validation:** Validates incoming data before database operations.
- [x] **API Error Handling:** Handles invalid requests and external API failures.
- [x] **Rate Limit Management:** Implements exponential backoff for HTTP 429 responses.
- [x] **Data Deduplication:** Uses Prisma upsert operations to prevent duplicate external records.
- [x] **User Feedback:** Provides form validation errors, success messages, and frontend alerts.

### Accessibility

- [x] **Keyboard Accessibility:** Keyboard-accessible List View as an alternative to map-based navigation.
- [x] **ARIA Support:** Accessible labels for map markers, charts, and form controls.
- [x] **Skip Navigation:** Skip-to-content link to improve keyboard navigation.
- [x] **Alternative Content Access:** Provides a list-based way to explore sightings without relying exclusively on the interactive map.

---

## 🏗️ Future Improvements

Although the current implementation meets the core MVP requirements, several enhancements could improve its scalability, security, and functionality.

| Area | Proposed Improvement | Benefit |
|---|---|---|
| Authentication | Introduce user authentication and authorisation | Reduce spam and improve report accountability |
| Image Storage | Migrate uploads to S3 or Cloudinary | Support reliable file storage in serverless environments |
| Geocoding | Integrate a geocoding service | Enable more precise, location-specific mapping |
| Database | Migrate SQLite to PostgreSQL | Improve concurrent write handling and scalability |
| Testing | Add automated unit and integration tests | Improve reliability and regression coverage |
| Deployment | Introduce CI/CD workflows | Streamline testing and production releases |

---

## 🎯 Project Objective

Tick Tracker demonstrates how external datasets can be transformed into an accessible, interactive platform for geographical exploration and trend analysis.

The project brings together full-stack development, database design, API integration, data validation, mapping, and accessibility considerations in a single application.

The focus throughout development was to deliver a functional MVP while making deliberate architectural decisions that support maintainability and future expansion.

---

**Developed by Marmik Joshi**  
*Elanco Placement Program Technical Task*
