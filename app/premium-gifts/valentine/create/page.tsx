"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ValentineBuilder } from "../components/ValentineBuilder"
import type { ValentineConfig } from "@/lib/valentine-types"

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleComplete = async (config: ValentineConfig) => {
    try {
      setLoading(true)

      // Store locally (used by preview page)
      sessionStorage.setItem("valentineConfig", JSON.stringify(config))

      // Optional: Send to API if needed
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/valentine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        }
      )

      // If API exists, check status (safe guard)
      if (res.ok) {
        const data = await res.json()

        // If backend returns ID, store it
        if (data?.id) {
          sessionStorage.setItem("valentineId", data.id)
        }
      }

      router.push("/premium-gifts/valentine/preview")
    } catch (error) {
      console.error("Error creating valentine:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ValentineBuilder
      onComplete={handleComplete}
      isSubmitting={loading}
    />
  )
}
