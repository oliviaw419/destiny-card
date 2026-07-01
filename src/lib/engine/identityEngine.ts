import birthdayData from "../data/birthcard_lookup.json"
import { BirthdayEntry, ComputedIdentity, PersonalityEvaluation, SunSign, UserInput } from "@/types"
import { getSuit } from "./cardUtils"

const lookup = birthdayData as BirthdayEntry[]

export function getBirthdayEntry(birthDate: string): BirthdayEntry | null {
  const md = birthDate.slice(5) // MM-DD
  return lookup.find(e => e.monthDay === md) ?? null
}

function getSunSignFromDate(birthDate: string): SunSign | null {
  // Used for cusp dates - determine sun sign from birth year
  // Simple approximation using typical cusp dates
  // For precise cusp resolution we use the entry's cuspSigns[0] or [1]
  // This is a fallback; cusp users should self-select
  return null
}

export function computePersonality(
  input: UserInput,
  birthCard: string,
  prcCards: string[],
  ageForReading: number,
  sunSign: SunSign | null
): PersonalityEvaluation {
  const suit = getSuit(birthCard)
  const candidates: string[] = []

  const J = `J${suit}`
  const Q = `Q${suit}`
  const K = `K${suit}`

  const isLeo = sunSign === "Leo"

  // Step 1: primary role determination
  if (input.gender === "female") {
    // Feminine default
    if (input.dominantExpression === "masculine") {
      candidates.push(J)
    } else {
      candidates.push(Q)
    }
  } else if (input.gender === "male") {
    // Masculine default
    if (input.dominantExpression === "feminine") {
      candidates.push(Q)
    } else {
      candidates.push(J)
    }
  } else {
    // other / unspecified - use dominant expression
    if (input.dominantExpression === "feminine") candidates.push(Q)
    else candidates.push(J)
  }

  // Step 2: age/role additions
  // Male >= 36 -> K
  if (input.gender === "male" && ageForReading >= 36) {
    candidates.push(K)
  }
  // Female < 20 -> J
  if (input.gender === "female" && ageForReading < 20) {
    candidates.push(J)
  }

  // Step 3: occupation additions
  const occ = input.occupationCategory
  if (occ === "creative" || occ === "performing" || occ === "sales") {
    candidates.push(J)
  }
  if (input.isSelfEmployed || input.managesOthers) {
    // K only if clearly in authority role - we add as candidate but filter later
    candidates.push(K)
  }

  // Step 4: gender expression additions
  if (input.dominantExpression === "masculine" && input.gender === "female") candidates.push(J)
  if (input.dominantExpression === "feminine" && input.gender === "male") candidates.push(Q)

  // Step 5: dedupe
  const unique = [...new Set(candidates)]

  // Step 6: remove if same as BC or any PRC
  const excluded = new Set([birthCard, ...prcCards])
  const filtered = unique.filter(c => !excluded.has(c))

  // Step 7: K special rule - only include K in used cards if:
  // - Leo with no other personality card
  // - or explicitly career/authority focus
  // Otherwise K stays as identified but not used
  const primary = filtered[0] ?? null
  const secondary = filtered[1] ?? null

  // Determine which go into worksheet
  let usedInWorksheet: string[] = []
  if (primary) usedInWorksheet.push(primary)
  // Secondary K: only include if Leo + no other, or career focus
  if (secondary) {
    const secondaryIsK = secondary === K
    if (secondaryIsK) {
      const noOtherPersonality = !primary || primary === K
      const isCareerFocus = input.focus === "career"
      const isLeoNoOther = isLeo && noOtherPersonality
      if (isLeoNoOther || isCareerFocus) {
        usedInWorksheet.push(secondary)
      }
      // else: K identified but not used in worksheet by default
    } else {
      usedInWorksheet.push(secondary)
    }
  }

  return {
    candidates: unique,
    primary,
    secondary,
    usedInWorksheet
  }
}

export function computeIdentity(input: UserInput, ageForReading: number): ComputedIdentity | null {
  const entry = getBirthdayEntry(input.birthDate)
  if (!entry) return null

  const birthCard = entry.birthCards[0]
  const sunSign = entry.sunSign
  const isLeo = sunSign === "Leo"
  const isScorpio = sunSign === "Scorpio"

  // For Scorpio: both PRCs used
  // For cusp: planetaryRulingCards has [libra_prc, scorpio_prc1, scorpio_prc2]
  //   or [sign1_prc, sign2_prc] for non-scorpio cusps
  // effectivePRC = first card (or user-selected based on sign)
  let prcCards = entry.planetaryRulingCards
  let effectivePRC = prcCards[0] ?? birthCard

  if (isLeo) {
    // Leo: BC = PRC
    effectivePRC = birthCard
    prcCards = [birthCard]
  }

  const personality = computePersonality(input, birthCard, prcCards, ageForReading, sunSign)

  return {
    birthCard,
    planetaryRulingCards: prcCards,
    effectivePRC,
    sunSign,
    isCusp: entry.isCusp,
    cuspSigns: entry.cuspSigns as SunSign[],
    isLeo,
    isScorpio,
    personality
  }
}
