"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserInput } from "@/types"

export default function HomePage() {
  const router = useRouter()
  const [form, setForm] = useState<Partial<UserInput>>({
    gender: "female",
    dominantExpression: "unspecified",
    focus: "general"
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(form as Record<string, string>)
    router.push(`/worksheet?${params.toString()}`)
  }

  function set(key: keyof UserInput, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-10 text-center">
        <p className="text-[#c8bfaa] text-sm tracking-widest uppercase mb-2">Your Reading</p>
        <h2 className="font-serif text-3xl text-[#e2b96f]">Begin Here</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Name (optional)
          </label>
          <input
            type="text"
            value={form.name ?? ""}
            onChange={e => set("name", e.target.value)}
            className="w-full bg-[#16213e] border border-[#0f3460] rounded px-4 py-2 text-[#f5f0e8] focus:outline-none focus:border-[#e2b96f]"
            placeholder="Your name"
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Birthday *
          </label>
          <input
            type="date"
            required
            value={form.birthDate ?? ""}
            onChange={e => set("birthDate", e.target.value)}
            className="w-full bg-[#16213e] border border-[#0f3460] rounded px-4 py-2 text-[#f5f0e8] focus:outline-none focus:border-[#e2b96f]"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Gender *
          </label>
          <div className="flex gap-3">
            {(["female", "male", "other"] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => set("gender", g)}
                className={`flex-1 py-2 rounded border text-sm capitalize transition-colors ${
                  form.gender === g
                    ? "border-[#e2b96f] text-[#e2b96f] bg-[#16213e]"
                    : "border-[#0f3460] text-[#c8bfaa] hover:border-[#a07840]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Dominant Expression */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Dominant Expression
          </label>
          <div className="flex gap-3 flex-wrap">
            {(["feminine", "masculine", "mixed", "unspecified"] as const).map(e => (
              <button
                key={e}
                type="button"
                onClick={() => set("dominantExpression", e)}
                className={`px-3 py-2 rounded border text-sm capitalize transition-colors ${
                  form.dominantExpression === e
                    ? "border-[#e2b96f] text-[#e2b96f] bg-[#16213e]"
                    : "border-[#0f3460] text-[#c8bfaa] hover:border-[#a07840]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Occupation Type
          </label>
          <select
            value={form.occupationCategory ?? "other"}
            onChange={e => set("occupationCategory", e.target.value)}
            className="w-full bg-[#16213e] border border-[#0f3460] rounded px-4 py-2 text-[#f5f0e8] focus:outline-none focus:border-[#e2b96f]"
          >
            <option value="other">Other / Unspecified</option>
            <option value="creative">Creative</option>
            <option value="performing">Performing Arts</option>
            <option value="sales">Sales</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="selfemployed">Self-Employed</option>
            <option value="caregiver">Caregiver / Home</option>
          </select>
        </div>

        {/* Self-employed / Manages others */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[#c8bfaa] cursor-pointer">
            <input
              type="checkbox"
              checked={form.isSelfEmployed ?? false}
              onChange={e => set("isSelfEmployed", e.target.checked)}
              className="accent-[#e2b96f]"
            />
            Self-employed
          </label>
          <label className="flex items-center gap-2 text-sm text-[#c8bfaa] cursor-pointer">
            <input
              type="checkbox"
              checked={form.managesOthers ?? false}
              onChange={e => set("managesOthers", e.target.checked)}
              className="accent-[#e2b96f]"
            />
            Manages others
          </label>
        </div>

        {/* Reading Focus */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#c8bfaa] mb-2">
            Reading Focus
          </label>
          <div className="flex gap-3">
            {(["general", "love", "career"] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => set("focus", f)}
                className={`flex-1 py-2 rounded border text-sm capitalize transition-colors ${
                  form.focus === f
                    ? "border-[#e2b96f] text-[#e2b96f] bg-[#16213e]"
                    : "border-[#0f3460] text-[#c8bfaa] hover:border-[#a07840]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#e2b96f] text-[#1a1a2e] font-semibold rounded tracking-widest uppercase hover:bg-[#a07840] transition-colors"
        >
          Generate Reading
        </button>
      </form>
    </div>
  )
}
