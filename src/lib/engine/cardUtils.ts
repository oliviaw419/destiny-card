export function getSuit(card: string): string {
  if (!card || card === "JOKER") return ""
  return card.slice(-1) // last char: S/H/D/C
}

export function getRank(card: string): string {
  if (!card || card === "JOKER") return card
  return card.slice(0, -1) // everything before last char
}

export function displayCard(card: string | null): string {
  if (!card) return "—"
  const suitMap: Record<string, string> = {
    S: "♠", H: "♥", D: "♦", C: "♣"
  }
  const suit = getSuit(card)
  const rank = getRank(card)
  return `${rank}${suitMap[suit] ?? suit}`
}

export function cardColor(card: string | null): "red" | "black" {
  if (!card) return "black"
  const suit = getSuit(card)
  return suit === "H" || suit === "D" ? "red" : "black"
}

export function getSameSuitCard(rank: "J" | "Q" | "K", referenceSuit: string): string {
  return `${rank}${referenceSuit}`
}
