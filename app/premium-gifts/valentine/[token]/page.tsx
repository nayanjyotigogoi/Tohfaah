"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ValentineDisplay } from "../components/ValentineDisplay"
import { apiFetch } from "@/lib/api"
import { Heart, Lock } from "lucide-react"
import type { ValentineConfig } from "@/lib/valentine-types"

interface Gift {
  id: string
  config: ValentineConfig
}

export default function PublicValentinePage() {
  const { token } = useParams<{ token: string }>()

  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [locked, setLocked] = useState(false)
  const [lockQuestion, setLockQuestion] = useState("")
  const [lockHint, setLockHint] = useState<string | null>(null)
  const [answer, setAnswer] = useState("")
  const [unlockError, setUnlockError] = useState<string | null>(null)

  /* =========================
     FETCH GIFT (ALWAYS CHECK LOCK)
  ========================== */
  useEffect(() => {
    if (!token) return

    const fetchGift = async () => {
      try {
        const storedUnlockToken =
          typeof window !== "undefined"
            ? localStorage.getItem(`unlock_${token}`)
            : null

        const url = storedUnlockToken
          ? `/api/premium-gifts/view/${token}?unlock_token=${storedUnlockToken}`
          : `/api/premium-gifts/view/${token}`

        const response = await apiFetch(url, { method: "GET" })

        if (!response.ok) throw new Error()

        const data = await response.json()

        if (data.locked) {
          setLocked(true)
          setLockQuestion(data.lock_question)
          setLockHint(data.lock_hint)

          // if backend rejects old token, clear it
          if (storedUnlockToken) {
            localStorage.removeItem(`unlock_${token}`)
          }
        } else {
          setGift(data.gift)
          setLocked(false)
        }

      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchGift()
  }, [token])

  /* =========================
     VERIFY ANSWER
  ========================== */
const handleUnlock = async () => {
  try {
    setUnlockError(null)

    const response = await apiFetch(
      `/api/premium-gifts/${token}/verify-secret`, // ✅ CORRECT
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Incorrect answer.")
    }

    localStorage.setItem(`unlock_${token}`, data.unlock_token)

    const giftResponse = await apiFetch(
      `/api/premium-gifts/view/${token}?unlock_token=${data.unlock_token}`,
      { method: "GET" }
    )

    const giftData = await giftResponse.json()

    setGift(giftData.gift)
    setLocked(false)

  } catch (err: any) {
    setUnlockError(err.message || "Incorrect answer.")
  }
}


  /* =========================
     STATES
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Heart className="w-16 h-16 text-primary animate-pulse-heart" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        This Valentine does not exist 💔
      </div>
    )
  }

  /* =========================
     LOCK SCREEN
  ========================== */
  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(350,70%,92%)]">
        <div className="bg-card p-8 rounded-3xl shadow-xl w-full max-w-md text-center space-y-6">

          <Lock className="w-12 h-12 mx-auto text-primary" />

          <h2 className="text-2xl font-display">
            This Valentine is Locked 💖
          </h2>

          <p className="text-muted-foreground">
            {lockQuestion}
          </p>

          {lockHint && (
            <p className="text-xs text-muted-foreground italic">
              Hint: {lockHint}
            </p>
          )}

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full border rounded-lg px-4 py-2"
          />

          {unlockError && (
            <p className="text-red-500 text-sm">
              {unlockError}
            </p>
          )}

          <button
            onClick={handleUnlock}
            className="w-full bg-primary text-primary-foreground rounded-full py-2"
          >
            Unlock 💌
          </button>
        </div>
      </div>
    )
  }

  /* =========================
     FULL EXPERIENCE
  ========================== */
  return (
    <ValentineDisplay
      config={gift!.config}
      onReset={() => {}}
    />
  )
}
