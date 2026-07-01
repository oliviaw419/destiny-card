import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cards of Your Destiny",
  description: "Your personal card reading"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1a2e] text-[#f5f0e8]">
        <header className="border-b border-[#0f3460] px-6 py-4">
          <h1 className="font-serif text-xl tracking-widest text-[#e2b96f] uppercase">
            Cards of Your Destiny
          </h1>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
