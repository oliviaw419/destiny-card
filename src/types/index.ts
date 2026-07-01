export type Suit = "S" | "H" | "D" | "C"
export type Planet = "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune"
export type SunSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces"

export type Gender = "male" | "female" | "other"
export type DominantExpression = "masculine" | "feminine" | "mixed" | "unspecified"
export type OccupationCategory =
  | "creative" | "performing" | "sales" | "manager"
  | "employee" | "selfemployed" | "caregiver" | "other"
export type ReadingFocus = "general" | "love" | "career"

export interface UserInput {
  name?: string
  birthDate: string // YYYY-MM-DD
  gender: Gender
  targetAge?: number
  occupationCategory?: OccupationCategory
  isSelfEmployed?: boolean
  managesOthers?: boolean
  dominantExpression?: DominantExpression
  focus?: ReadingFocus
}

export interface BirthdayEntry {
  monthDay: string
  birthCards: string[]
  planetaryRulingCards: string[]
  sunSign: SunSign | null
  isCusp: boolean
  cuspSigns: SunSign[]
  notes: string
}

export interface PeriodDatesEntry {
  birthday: string
  card: string
  mercury: string | null
  venus: string | null
  mars: string | null
  jupiter: string | null
  saturn: string | null
  uranus: string | null
  neptune: string | null
}

export interface CardValue {
  direct: string
  vertical: string | null
}

export interface SpreadEntry {
  card: string
  age: number
  mercury: CardValue
  venus: CardValue
  mars: CardValue
  jupiter: CardValue
  saturn: CardValue
  uranus: CardValue
  neptune: CardValue
  longRange: string
  pluto: string
  result: string
  environment: string | null
  displacement: string | null
}

export interface PersonalityEvaluation {
  candidates: string[]
  primary: string | null
  secondary: string | null
  usedInWorksheet: string[]
}

export interface ComputedIdentity {
  birthCard: string
  planetaryRulingCards: string[]
  effectivePRC: string // primary PRC used for reading
  sunSign: SunSign | null
  isCusp: boolean
  cuspSigns: SunSign[]
  isLeo: boolean
  isScorpio: boolean
  personality: PersonalityEvaluation
}

export interface PlanetaryPeriodDates {
  mercury: string
  venus: string
  mars: string
  jupiter: string
  saturn: string
  uranus: string
  neptune: string
}

export interface ReadingYear {
  startDate: string
  endDate: string
  ageForReading: number
  currentPeriod: Planet | null
}

export interface WorksheetSection {
  sourceType: "birthcard" | "planetaryrulingcard" | "personality"
  sourceCard: string
  spread: SpreadEntry | null
  included: boolean
}

export interface ReadingWorksheet {
  subject: {
    name?: string
    birthDate: string
    ageForReading: number
  }
  identity: ComputedIdentity
  readingYear: ReadingYear
  periodDates: PlanetaryPeriodDates
  sections: WorksheetSection[]
}
