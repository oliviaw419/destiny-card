import { buildWorksheet } from "@/lib/engine/spreadEngine"
import { UserInput, Planet, SpreadEntry } from "@/types"
import { displayCard, cardColor } from "@/lib/engine/cardUtils"

const PLANETS: Planet[] = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"]
const PLANET_LABELS: Record<Planet, string> = {
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune"
}

function Card({ code, highlight }: { code: string | null; highlight?: boolean }) {
  if (!code) return <span className="text-[#4a5568]">—</span>
  const color = cardColor(code)
  return (
    <span
      className={`font-mono font-bold ${
        color === "red" ? "text-[#c0392b]" : "text-[#f5f0e8]"
      } ${highlight ? "underline decoration-[#e2b96f]" : ""}`}
    >
      {displayCard(code)}
    </span>
  )
}

function SpreadRow({
  planet,
  spread,
  isCurrentPeriod
}: {
  planet: Planet
  spread: SpreadEntry
  isCurrentPeriod: boolean
}) {
  const direct = spread[planet]?.direct ?? null
  const vertical = spread[planet]?.vertical ?? null

  return (
    <tr className={isCurrentPeriod ? "bg-[#0f3460]/40" : ""}>
      <td className="py-2 px-3 text-xs uppercase tracking-wider text-[#c8bfaa] border-r border-[#0f3460]">
        {PLANET_LABELS[planet]}
        {isCurrentPeriod && (
          <span className="ml-1 text-[#e2b96f]">◆</span>
        )}
      </td>
      <td className="py-2 px-3 text-center">
        <Card code={direct} />
      </td>
      <td className="py-2 px-3 text-center text-[#c8bfaa]">
        <Card code={vertical} />
      </td>
    </tr>
  )
}

export default async function WorksheetPage({
  searchParams
}: {
  searchParams: Record<string, string>
}) {
  const input: UserInput = {
    name: searchParams.name || undefined,
    birthDate: searchParams.birthDate || "",
    gender: (searchParams.gender as UserInput["gender"]) || "female",
    targetAge: searchParams.targetAge ? parseInt(searchParams.targetAge) : undefined,
    occupationCategory: searchParams.occupationCategory as UserInput["occupationCategory"],
    isSelfEmployed: searchParams.isSelfEmployed === "true",
    managesOthers: searchParams.managesOthers === "true",
    dominantExpression: (searchParams.dominantExpression as UserInput["dominantExpression"]) || "unspecified",
    focus: (searchParams.focus as UserInput["focus"]) || "general"
  }

  if (!input.birthDate) {
    return (
      <div className="text-center py-20 text-[#c8bfaa]">
        No birth date provided. <a href="/" className="text-[#e2b96f] underline">Go back</a>
      </div>
    )
  }

  const worksheet = buildWorksheet(input)

  if (!worksheet) {
    return (
      <div className="text-center py-20 text-[#c8bfaa]">
        Could not generate worksheet. Birth date may not be in our database yet.{" "}
        <a href="/" className="text-[#e2b96f] underline">Go back</a>
      </div>
    )
  }

  const { subject, identity, readingYear, periodDates, sections } = worksheet

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-[#0f3460] rounded-lg p-6 bg-[#16213e]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#c8bfaa] mb-1">Reading for</p>
            <h2 className="font-serif text-2xl text-[#e2b96f]">
              {subject.name || "Anonymous"}
            </h2>
            <p className="text-sm text-[#c8bfaa] mt-1">
              Born {subject.birthDate} · Age {subject.ageForReading}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-widest uppercase text-[#c8bfaa] mb-1">Reading Year</p>
            <p className="text-sm text-[#f5f0e8]">
              {readingYear.startDate} → {readingYear.endDate}
            </p>
            {readingYear.currentPeriod && (
              <p className="text-sm text-[#e2b96f] mt-1">
                Currently in {PLANET_LABELS[readingYear.currentPeriod]} period ◆
              </p>
            )}
          </div>
        </div>

        {/* Identity cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 border border-[#0f3460] rounded">
            <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">Birth Card</p>
            <p className="text-2xl font-bold">
              <Card code={identity.birthCard} />
            </p>
          </div>
          {identity.planetaryRulingCards.filter(c => c !== identity.birthCard).map((prc, i) => (
            <div key={i} className="text-center p-3 border border-[#0f3460] rounded">
              <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">
                {identity.isScorpio && i === 1 ? "PRC (Mars)" : "Ruling Card"}
              </p>
              <p className="text-2xl font-bold">
                <Card code={prc} />
              </p>
            </div>
          ))}
          {identity.personality.primary && (
            <div className="text-center p-3 border border-[#0f3460]/50 rounded opacity-75">
              <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">Personality</p>
              <p className="text-2xl font-bold">
                <Card code={identity.personality.primary} />
              </p>
            </div>
          )}
          {identity.sunSign && (
            <div className="text-center p-3 border border-[#0f3460]/50 rounded opacity-75">
              <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">Sun Sign</p>
              <p className="text-sm text-[#f5f0e8] mt-1">{identity.sunSign}</p>
            </div>
          )}
        </div>

        {/* Cusp notice */}
        {identity.isCusp && (
          <div className="mt-4 p-3 border border-[#e2b96f]/30 rounded bg-[#e2b96f]/5 text-sm text-[#c8bfaa]">
            ⚠ Cusp birth date ({identity.cuspSigns.join(" / ")}). Ruling card shown is based on{" "}
            {identity.cuspSigns[0]}. If you are {identity.cuspSigns[1]}, your ruling card differs.
          </div>
        )}
      </div>

      {/* Period Dates */}
      <div className="border border-[#0f3460] rounded-lg p-5 bg-[#16213e]">
        <h3 className="text-xs tracking-widest uppercase text-[#c8bfaa] mb-4">
          Planetary Period Dates
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLANETS.map(p => (
            <div
              key={p}
              className={`p-2 rounded border text-center ${
                readingYear.currentPeriod === p
                  ? "border-[#e2b96f] bg-[#e2b96f]/10"
                  : "border-[#0f3460]"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-[#c8bfaa]">
                {PLANET_LABELS[p]}
              </p>
              <p className={`text-sm mt-1 ${readingYear.currentPeriod === p ? "text-[#e2b96f]" : "text-[#f5f0e8]"}`}>
                {periodDates[p].slice(5)} {/* MM-DD */}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Spread Sections */}
      {sections.filter(s => s.included || s.sourceType === "birthcard" || s.sourceType === "planetaryrulingcard").map((section, si) => (
        <div key={si} className="border border-[#0f3460] rounded-lg overflow-hidden bg-[#16213e]">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#0f3460] bg-[#0f3460]/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                <Card code={section.sourceCard} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#c8bfaa]">
                  {section.sourceType === "birthcard"
                    ? "Birth Card"
                    : section.sourceType === "planetaryrulingcard"
                    ? "Planetary Ruling Card"
                    : "Personality Card"}
                </p>
              </div>
            </div>
          </div>

          {section.spread ? (
            <div className="p-4">
              {/* Planetary periods table */}
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-[#0f3460]">
                    <th className="py-2 px-3 text-left text-xs uppercase tracking-wider text-[#c8bfaa]">Period</th>
                    <th className="py-2 px-3 text-center text-xs uppercase tracking-wider text-[#c8bfaa]">Direct</th>
                    <th className="py-2 px-3 text-center text-xs uppercase tracking-wider text-[#c8bfaa]">Vertical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0f3460]/50">
                  {PLANETS.map(p => (
                    <SpreadRow
                      key={p}
                      planet={p}
                      spread={section.spread!}
                      isCurrentPeriod={readingYear.currentPeriod === p}
                    />
                  ))}
                </tbody>
              </table>

              {/* Long-range / Pluto / Result / Env / Disp */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#0f3460]">
                {[
                  { label: "Long Range", key: "longRange" },
                  { label: "Pluto", key: "pluto" },
                  { label: "Result", key: "result" },
                  { label: "Environment", key: "environment" },
                  { label: "Displacement", key: "displacement" }
                ].map(({ label, key }) => (
                  <div key={key} className="text-center p-2 border border-[#0f3460]/50 rounded">
                    <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">{label}</p>
                    <p className="text-lg font-bold">
                      <Card code={(section.spread as any)[key]} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-[#4a5568] text-sm">
              Spread data not yet available for this card at age {subject.ageForReading}.
            </div>
          )}
        </div>
      ))}

      {/* Personality cards (collapsed by default) */}
      {sections.filter(s => s.sourceType === "personality").length > 0 && (
        <div className="border border-[#0f3460]/50 rounded-lg p-4 bg-[#16213e]/50">
          <p className="text-xs uppercase tracking-wider text-[#c8bfaa] mb-1">
            Personality Card{sections.filter(s => s.sourceType === "personality").length > 1 ? "s" : ""} (identified)
          </p>
          <div className="flex gap-3 mt-2">
            {sections.filter(s => s.sourceType === "personality").map((s, i) => (
              <span key={i} className="text-xl font-bold">
                <Card code={s.sourceCard} />
              </span>
            ))}
          </div>
          <p className="text-xs text-[#4a5568] mt-2">
            Personality spreads not expanded by default. Add ?includePersonality=true to include.
          </p>
        </div>
      )}

      <div className="text-center pt-4">
        <a href="/" className="text-xs uppercase tracking-widest text-[#c8bfaa] hover:text-[#e2b96f]">
          ← New Reading
        </a>
      </div>
    </div>
  )
}
