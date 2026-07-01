/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        card: "#16213e",
        border: "#0f3460",
        gold: "#e2b96f",
        "gold-dim": "#a07840",
        cream: "#f5f0e8",
        "cream-dim": "#c8bfaa",
        red: "#c0392b",
        muted: "#4a5568"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
}
