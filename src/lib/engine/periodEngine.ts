import periodData from "../data/planetary_period_dates.json"
import { Planet, PeriodDatesEntry, PlanetaryPeriodDates, ReadingYear } from "@/types"

const periods = periodData as PeriodDatesEntry[]

const PLANETS: Planet[] = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"]

export function getReadingYear(birthDate: string, ageForReading: number): ReadingYear {
  const birth = new Date(birthDate)
  const startDate = new Date(birth)
  startDate.setFullYear(birth.getFullYear() + ageForReading)

  const endDate = new Date(startDate)
  endDate.setFullYear(startDate.getFullYear() + 1)
  endDate.setDate(endDate.getDate() - 1)

  const today = new Date()
  const isCurrentAge =
    today >= startDate && today <= endDate

  let currentPeriod: Planet | null = null
  if (isCurrentAge) {
    // Will be determined after we get period dates
    currentPeriod = null
  }

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    ageForReading,
    currentPeriod
  }
}

export function getPeriodDates(
  birthDate: string,
  readingYearStart: string
): PlanetaryPeriodDates | null {
  const md = birthDate.slice(5) // MM-DD
  const entry = periods.find(p => p.birthday === md)
  if (!entry) return null

  const year = parseInt(readingYearStart.slice(0, 4))

  function resolveDate(md: string | null, baseYear: number): string {
    if (!md) return ""
    const [m, d] = md.split("/").map(Number)
    // If month is less than the birthday month, it's next year
    const birthMonth = parseInt(birthDate.slice(5, 7))
    const resolvedYear = m < birthMonth ? baseYear + 1 : baseYear
    return `${resolvedYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  }

  return {
    mercury: resolveDate(entry.mercury, year),
    venus: resolveDate(entry.venus, year),
    mars: resolveDate(entry.mars, year),
    jupiter: resolveDate(entry.jupiter, year),
    saturn: resolveDate(entry.saturn, year),
    uranus: resolveDate(entry.uranus, year),
    neptune: resolveDate(entry.neptune, year)
  }
}

export function getCurrentPeriod(
  periodDates: PlanetaryPeriodDates,
  readingYear: ReadingYear
): Planet | null {
  const today = new Date()
  const start = new Date(readingYear.startDate)
  const end = new Date(readingYear.endDate)

  if (today < start || today > end) return null

  // Find which period today falls in
  const dates = PLANETS.map(p => ({
    planet: p,
    date: new Date(periodDates[p])
  }))

  // Sort by date
  dates.sort((a, b) => a.date.getTime() - b.date.getTime())

  let current: Planet | null = null
  for (const { planet, date } of dates) {
    if (today >= date) {
      current = planet
    }
  }

  return current
}
