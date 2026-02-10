"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"

interface UnlockGateProps {
  token: string
  question: string
  hint?: string | null
  onSuccess: (unlockToken: string) => void
}

export default function UnlockGate({
  token,
  question,
  hint,
  onSuccess,
}: UnlockGateProps) {
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUnlock = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/unlock/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ answer }),
        }
      )

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Incorrect answer.")
      }

      // ✅ Save unlock token (temporary storage)
      localStorage.setItem(
        `gift_unlock_${token}`,
        data.unlock_token
      )

      onSuccess(data.unlock_token)

    } catch (err: any) {
      setError(err.message || "Failed to unlock.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(350,70%,92%)] px-4">
      <div className="bg-card rounded-3xl p-10 shadow-xl max-w-md w-full text-center space-y-6">
        <Heart className="w-12 h-12 text-primary mx-auto" fill="currentColor" />

        <h2 className="font-display text-2xl">
          {question}
        </h2>

        {hint && (
          <p className="text-sm text-muted-foreground">
            Hint: {hint}
          </p>
        )}

        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="text-center"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Checking..." : "Unlock Gift"}
        </Button>
      </div>
    </div>
  )
}
