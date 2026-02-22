"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { apiFetch } from "@/lib/api"

const MemoryMap = dynamic(
  () => import("../../components/memory-map").then((mod) => mod.MemoryMap),
  { ssr: false }
)

export default function DraftPage() {
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [mapData, setMapData] = useState<any>(null)

  const fetchDraft = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await apiFetch(
        `/api/memory-maps/draft/${id}`,
        { method: "GET" }
      )

      if (!response.ok) {
        setError(true)
        return
      }

      const data = await response.json()

      if (!data.success) {
        setError(true)
        return
      }

      setMapData(data.memory_map)

    } catch (err) {
      console.error("Failed to load draft:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchDraft()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading draft...
      </div>
    )
  }

  if (error || !mapData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Draft not found or access denied.
      </div>
    )
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <MemoryMap mapData={mapData} mode="draft" />
    </main>
  )
}
