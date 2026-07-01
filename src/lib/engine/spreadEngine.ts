import spreadsData from "../data/yearly_spreads.json"
import { SpreadEntry, WorksheetSection, ReadingWorksheet, UserInput } from "@/types"
import { computeIdentity } from "./identityEngine"
import { getReadingYear, getPeriodDates, getCurrentPeriod } from "./periodEngine"

const spreads = spreadsData as SpreadEntry[]

export function getSpread(card: string, age: number): SpreadEntry | null {
  return spreads.find(s => s.card === card && s.age === age) ?? null
}

export function buildWorksheet(input: UserInput): ReadingWorksheet | null {
  // 1. Determine age for reading
  const birth = new Date(input.birthDate)
  const today = new Date()
  const currentAge =
    today.getFullYear() -
    birth.getFullYear() -
    (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)

  const ageForReading = input.targetAge ?? currentAge

  // 2. Compute identity
  const identity = computeIdentity(input, ageForReading)
  if (!identity) return null

  // 3. Compute reading year
  const readingYear = getReadingYear(input.birthDate, ageForReading)

  // 4. Get period dates
  const periodDates = getPeriodDates(input.birthDate, readingYear.startDate)
  if (!periodDates) return null

  // 5. Get current period
  const currentPeriod = getCurrentPeriod(periodDates, readingYear)
  readingYear.currentPeriod = currentPeriod

  // 6. Build sections
  const sections: WorksheetSection[] = []

  // Birth Card section (always included)
  sections.push({
    sourceType: "birthcard",
    sourceCard: identity.birthCard,
    spread: getSpread(identity.birthCard, ageForReading),
    included: true
  })

  // PRC section(s)
  // For Scorpio: two PRCs; for Leo: same as BC (skip); for others: one PRC
  if (!identity.isLeo) {
    const prcSet = new Set(identity.planetaryRulingCards)
    prcSet.delete(identity.birthCard) // skip if same as BC
    for (const prc of prcSet) {
      sections.push({
        sourceType: "planetaryrulingcard",
        sourceCard: prc,
        spread: getSpread(prc, ageForReading),
        included: true
      })
    }
  }

  // Personality card sections
  for (const pc of identity.personality.usedInWorksheet) {
    sections.push({
      sourceType: "personality",
      sourceCard: pc,
      spread: getSpread(pc, ageForReading),
      included: false // default off, user can toggle
    })
  }

  return {
    subject: {
      name: input.name,
      birthDate: input.birthDate,
      ageForReading
    },
    identity,
    readingYear,
    periodDates,
    sections
  }
}
