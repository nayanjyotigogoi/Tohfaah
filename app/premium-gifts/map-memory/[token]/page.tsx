"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { PasswordGate } from "../components/password-gate"
import { apiFetch } from "@/lib/api"

const MemoryMap = dynamic(
  () => import("../components/memory-map").then((mod) => mod.MemoryMap),
  { ssr: false }
)

interface MemoryMapResponse {
  locked: boolean
  memory_map?: any
  password_hint?: string
}

export default function Page() {
  const { token } = useParams<{ token: string }>()

  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)
  const [mapData, setMapData] = useState<any>(null)
  const [passwordHint, setPasswordHint] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const [unlockToken, setUnlockToken] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem(`memory_unlock_${token}`)
      : null
  )

  /* =========================
     FETCH MAP
  ========================== */
  const fetchMap = async (unlock?: string | null) => {
    try {
      setLoading(true)
      setError(false)

      const url = unlock
        ? `/api/memory-maps/view/${token}?unlock_token=${unlock}`
        : `/api/memory-maps/view/${token}`

      const response = await apiFetch(url, { method: "GET" })

      if (response.status === 401) {
        setError(true)
        return
      }

      if (response.status === 403) {
        setError(true)
        return
      }

      const data: MemoryMapResponse = await response.json()

      if (data.locked) {
        setLocked(true)
        setPasswordHint(data.password_hint ?? null)

        if (unlock) {
          localStorage.removeItem(`memory_unlock_${token}`)
        }
      } else {
        setLocked(false)
        setMapData(data.memory_map)
      }
    } catch (err) {
      console.error("Failed to load map", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchMap(unlockToken)
  }, [token])

  /* =========================
     VERIFY PASSWORD
  ========================== */
  const handleUnlock = async (password: string) => {
    try {
      const response = await apiFetch(
        `/api/memory-maps/${token}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        return false
      }

      localStorage.setItem(
        `memory_unlock_${token}`,
        data.unlock_token
      )

      setUnlockToken(data.unlock_token)
      await fetchMap(data.unlock_token)

      return true
    } catch (err) {
      console.error("Unlock failed", err)
      return false
    }
  }

  /* =========================
     STATES
  ========================== */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading map...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        Access denied or map not found.
      </div>
    )
  }

  if (locked) {
    return (
      <PasswordGate
        hint={passwordHint}
        onUnlock={handleUnlock}
      />
    )
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <MemoryMap mapData={mapData} />
    </main>
  )
}
