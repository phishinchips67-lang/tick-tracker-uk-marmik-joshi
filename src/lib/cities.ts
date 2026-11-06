export const UK_CITIES: Record<string, { lat: number; lng: number }> = {
  London: { lat: 51.5074, lng: -0.1278 },
  Manchester: { lat: 53.4808, lng: -2.2426 },
  Birmingham: { lat: 52.4862, lng: -1.8904 },
  Leeds: { lat: 53.8008, lng: -1.5491 },
  Glasgow: { lat: 55.8642, lng: -4.2518 },
  Edinburgh: { lat: 55.9533, lng: -3.1883 },
  Bristol: { lat: 51.4545, lng: -2.5879 },
  Liverpool: { lat: 53.4084, lng: -2.9916 },
  Sheffield: { lat: 53.3811, lng: -1.4701 },
  Newcastle: { lat: 54.9783, lng: -1.6178 },
  Nottingham: { lat: 52.9548, lng: -1.1581 },
  Cardiff: { lat: 51.4816, lng: -3.1791 },
  Belfast: { lat: 54.5973, lng: -5.9301 },
  Southampton: { lat: 50.9097, lng: -1.4044 },
  Brighton: { lat: 50.8225, lng: -0.1372 },
  Oxford: { lat: 51.752, lng: -1.2577 },
  Cambridge: { lat: 52.2053, lng: 0.1218 },
  York: { lat: 53.959, lng: -1.0815 },
  Norwich: { lat: 52.6309, lng: 1.2974 },
  Plymouth: { lat: 50.3755, lng: -4.1427 },
}

// Fallback: small deterministic offset around the UK centre so unknown
// cities still render somewhere stable instead of crashing.
export function coordsFor(city: string): { lat: number; lng: number } {
  if (UK_CITIES[city]) return UK_CITIES[city]
  let h = 0
  for (const c of city) h = (h * 31 + c.charCodeAt(0)) % 1000
  return { lat: 54.0 + (h % 100) / 400, lng: -2.5 + (h % 200) / 100 }
}