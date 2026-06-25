import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SelectAI - Government Internship Selection",
  description: "AI-powered internship selection platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
