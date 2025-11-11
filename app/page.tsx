"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-[680px] relative z-10">
        {/* Main content */}
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-1.5">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0D1117] dark:bg-white"></div>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full" style={{ backgroundColor: '#56585D' }}></div>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full" style={{ backgroundColor: '#9EA0A2' }}></div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Instarep.ly
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px] mx-auto text-pretty">
            The wait's almost over. Meet the AI keyboard rethinking how creators reply. Early access coming soon.
          </p>

          {/* Waitlist form or success state */}
          <div className="pt-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-5 bg-muted/50 border-border text-base flex-1"
                />
                <Button type="submit" size="lg" disabled={isLoading} className="h-12 px-8 font-medium">
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 text-lg animate-in fade-in duration-500">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />
                <span className="font-medium">You're on the list!</span>
              </div>
            )}
          </div>

          {/* Social proof */}
          {!isSubmitted && <p className="text-sm text-muted-foreground pt-2">Join 10,000+ early adopters</p>}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-8 left-0 right-0 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>© 2025</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
