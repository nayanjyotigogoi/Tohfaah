"use client"

import { useState } from "react"
import { Lock, KeyRound } from "lucide-react"

interface PasswordGateProps {
  hint?: string | null
  onUnlock: (password: string) => Promise<boolean>
}

export function PasswordGate({ hint, onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!password.trim()) return

    setLoading(true)
    setError(null)

    try {
      const success = await onUnlock(password)

      if (!success) {
        setError("Incorrect password. Try again.")
        setLoading(false)
        return
      }
    } catch (e) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/20">
            <Lock size={28} className="text-primary" />
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          This Map is Locked
        </h2>

        {hint && (
          <p className="text-sm text-muted-foreground mb-4">
            Hint: {hint}
          </p>
        )}

        <div className="space-y-3">
          <div className="relative">
            <KeyRound
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-muted/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg hover:brightness-105 transition-all disabled:opacity-60"
          >
            {loading ? "Unlocking..." : "Unlock Map"}
          </button>
        </div>
      </div>
    </div>
  )
}
