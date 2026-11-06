-- CreateTable
CREATE TABLE "Sighting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL DEFAULT 'external',
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "latinName" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Sighting_date_idx" ON "Sighting"("date");

-- CreateIndex
CREATE INDEX "Sighting_location_idx" ON "Sighting"("location");

-- CreateIndex
CREATE INDEX "Sighting_species_idx" ON "Sighting"("species");
