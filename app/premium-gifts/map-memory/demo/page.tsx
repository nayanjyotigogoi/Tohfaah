"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { BADGES } from "@/lib/memory-types"

const MemoryMap = dynamic(
  () => import("../components/memory-map").then((mod) => mod.MemoryMap),
  { ssr: false }
)

// Dummy data for demo
const dummyMapData = {
  id: "demo-map-1",
  title: "Our Journey Together",
  description: "A collection of beautiful memories from our travels",
  status: "active",
  payment_status: "paid",
  has_password: false,
  current_user_id: null,
  current_user_role: null,
  share_token: "demo",
  memories: [
    {
      id: "mem-1",
      user_id: "user-1",
      title: "First Date in Mumbai",
      badge: "Love",
      message: "Our first date at Marine Drive. The sunset was magical!",
      latitude: 18.9388,
      longitude: 72.8354,
      memory_date: "2024-01-15",
      photo_url: null,
      created_at: new Date("2024-01-15").toISOString(),
    },
    {
      id: "mem-2",
      user_id: "user-1",
      title: "Delhi Adventure",
      badge: "Magic",
      message: "Exploring the historic Red Fort together. So many stories!",
      latitude: 28.6562,
      longitude: 77.2410,
      memory_date: "2024-02-20",
      photo_url: null,
      created_at: new Date("2024-02-20").toISOString(),
    },
    {
      id: "mem-3",
      user_id: "user-2",
      title: "Bangalore Tech Park",
      badge: "Star",
      message: "Working together at the tech park. Coffee breaks were the best!",
      latitude: 12.9352,
      longitude: 77.6245,
      memory_date: "2024-03-10",
      photo_url: null,
      created_at: new Date("2024-03-10").toISOString(),
    },
    {
      id: "mem-4",
      user_id: "user-1",
      title: "Goa Beach Sunset",
      badge: "Sunset",
      message: "Watching the sunset on Baga Beach. Pure bliss!",
      latitude: 15.5517,
      longitude: 73.7554,
      memory_date: "2024-04-05",
      photo_url: null,
      created_at: new Date("2024-04-05").toISOString(),
    },
    {
      id: "mem-5",
      user_id: "user-2",
      title: "Kolkata Street Food",
      badge: "Cozy",
      message: "Trying street food in Park Street. The best puchkas ever!",
      latitude: 22.5448,
      longitude: 88.3426,
      memory_date: "2024-05-12",
      photo_url: null,
      created_at: new Date("2024-05-12").toISOString(),
    },
    {
      id: "mem-6",
      user_id: "user-1",
      title: "Jaipur Palace",
      badge: "Bloom",
      message: "Visiting the beautiful Hawa Mahal. Felt like royalty!",
      latitude: 26.9124,
      longitude: 75.7873,
      memory_date: "2024-06-18",
      photo_url: null,
      created_at: new Date("2024-06-18").toISOString(),
    },
  ],
}

export default function DemoPage() {
  const [mapData, setMapData] = useState<any>(null)

  useEffect(() => {
    // Format memories with badge objects
    const formattedMemories = dummyMapData.memories.map((mem: any) => {
      const badgeObj = BADGES.find((b) => b.label === mem.badge) || BADGES[0]
      return {
        ...mem,
        badge: badgeObj,
      }
    })

    setMapData({
      ...dummyMapData,
      memories: formattedMemories,
    })
  }, [])

  if (!mapData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading demo map...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* Demo Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-primary/90 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <span className="text-sm font-semibold">🗺️ Demo Map - Explore Our Journey</span>
      </div>
      
      <MemoryMap mapData={mapData} mode="active" />
    </main>
  )
}
