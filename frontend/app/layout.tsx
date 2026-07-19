import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthGuard } from "./components/AuthGuard"

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f7f9fc] text-[#0F2744] font-sans">
        <ThemeProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  )
}
