import type React from "react"
import type { Metadata } from "next"
import { Geist, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileProvider } from "@/contexts/ProfileContext"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "Join the Waitlist | Revolutionary Platform",
  description:
    "Be first to experience the future. Join thousands waiting for early access to our revolutionary platform.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ProfileProvider>
            <div className="fixed bottom-6 right-6 z-50">
              <ThemeToggle />
            </div>
            {children}
            <Analytics />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
