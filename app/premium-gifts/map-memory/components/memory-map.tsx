"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api"
import { useGoogleMaps } from "@/lib/use-google-maps"
import {
  Plus,
  List,
  Clock,
  Image as ImageIcon,
  BarChart3,
  Play,
  Search,
  X as XIcon,
  MapPin as MapPinIcon,
  LocateFixed,
} from "lucide-react"
import type { Memory } from "../../../../lib/memory-types"
import { AddMemoryModal } from "./add-memory-modal"
import { MemoryDetailCard } from "./memory-detail-card"
import { EditMemoryModal } from "./edit-memory-modal"
import { MemorySidebar } from "./memory-sidebar"
import { MemoryTimeline } from "./memory-timeline"
import { PhotoGallery } from "./photo-gallery"

import { apiFetch } from "@/lib/api"
import { PasswordGate } from "./password-gate"
import { BADGES } from "@/lib/memory-types"
import { Footer } from "@/components/footer"
import { ExperienceNav } from "@/components/experience-nav"
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"]

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "100vh",
}

const defaultCenter = {
  lat: 20.5937, // India center latitude
  lng: 78.9629, // India center longitude
}

const defaultZoom = 5 // Zoom level to show India clearly

interface MemoryMapProps {
  mapData: any
  mode?: "draft" | "active"
}

function createBadgeIconUrl(emoji: string, bgColor: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <circle cx="22" cy="22" r="20"
        fill="${bgColor}"
        stroke="white"
        stroke-width="3" />
      <foreignObject x="0" y="0" width="44" height="44">
        <div xmlns="http://www.w3.org/1999/xhtml"
          style="
            display:flex;
            align-items:center;
            justify-content:center;
            width:44px;
            height:44px;
            font-size:22px;">
          ${emoji}
        </div>
      </foreignObject>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}


export function MemoryMap({ mapData, mode = "active" }: MemoryMapProps) {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)

  const [showPaymentPanel, setShowPaymentPanel] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const mapRef = useRef<google.maps.Map | null>(null)
  // const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [mapZoom, setMapZoom] = useState(defaultZoom)

  const { isLoaded, loadError } = useGoogleMaps()
  // Load Google Maps API
  // const { isLoaded, loadError } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  //   libraries,
  // })

  const [isUnlocked, setIsUnlocked] = useState(!mapData?.has_password)
  const [showShareModal, setShowShareModal] = useState(false)
  const [publishedToken, setPublishedToken] = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState(mapData?.status)
  const [localPaymentStatus, setLocalPaymentStatus] = useState(mapData?.payment_status)

  // Location search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)


  /* ===================================================
     🔐 PERMISSION FLAGS (FINAL LOGIC)
  ==================================================== */

  const currentUserId = mapData?.current_user_id
  const currentUserRole = mapData?.current_user_role

  const isOwner = currentUserRole === "owner"
  const isParticipant = currentUserRole === "participant"

  const isDraft = localStatus === "draft"
  const isPublished = localStatus === "active"

  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const isPaid =
    localPaymentStatus === "paid" ||
    localPaymentStatus === "coupon_redeemed"





  // ✅ Only allow add if map is active + unlocked, OR draft + paid + unlocked
  const canAddMemory =
    isUnlocked &&
    (isOwner || isParticipant) &&
    (isPublished || (isDraft && isPaid))

  const mustPayToAdd =
    isDraft && !isPaid



  // 🔐 Edit/Delete handled per memory later
  const canPublish = isOwner && isDraft && isPaid
  useEffect(() => {
    if (!mapData) return

    setLocalStatus(mapData.status)
    setLocalPaymentStatus(mapData.payment_status)
  }, [mapData])

  /* ===================================================
     PASSWORD CHECK
  ==================================================== */

  useEffect(() => {
    if (!mapData?.has_password) {
      setIsUnlocked(true)
      return
    }

    const saved = localStorage.getItem(
      `memory_map_unlock_${mapData.share_token}`
    )

    if (saved) {
      setIsUnlocked(true)
    } else {
      setIsUnlocked(false)
    }
  }, [mapData])

  const handleUnlock = async (password: string) => {
    try {
      const response = await apiFetch(
        `/api/memory-maps/${mapData.share_token}/verify-password`,
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

      if (data.unlock_token) {
        localStorage.setItem(
          `memory_map_unlock_${mapData.share_token}`,
          data.unlock_token
        )
      }

      setIsUnlocked(true)
      return true
    } catch (error) {
      console.error("Unlock failed:", error)
      return false
    }
  }

  /* ===================================================
     PAYMENT + COUPON
  ==================================================== */

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsProcessing(true)

    try {
      const res = await apiFetch(
        `/api/memory-maps/${mapData.id}/apply-coupon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coupon_code: couponCode.trim() }),
        }
      )

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error("Invalid or expired coupon.")
        return
      }

      // ✅ Update local state immediately
      setLocalPaymentStatus("coupon_redeemed")

      setShowPaymentPanel(false)

      // ✅ Show success toast
      toast.success("Coupon applied successfully!", {
        description: "Your map is being published...",
      })

      // ✅ Auto-publish and redirect to published map
      await handlePublish()

    } catch (error) {
      console.error("Coupon apply error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }


  const handlePublish = async () => {
    try {
      const res = await apiFetch(
        `/api/memory-maps/${mapData.id}/publish`,
        { method: "POST" }
      )

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error("Payment required")
        return
      }

      // ✅ Only update UI after success
      setLocalStatus("active")
      const shareToken = data.memory_map.share_token
      setPublishedToken(shareToken)

      // ✅ If owner is in draft mode, redirect to published map
      if (mode === "draft" && isOwner && shareToken) {
        router.push(`/premium-gifts/map-memory/${shareToken}`)
        return
      }

      // Otherwise show share modal
      setShowShareModal(true)

    } catch (err) {
      console.error(err)
    }
  }
  /* ===================================================
     MAP CALLBACKS
  ==================================================== */

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    if (mustPayToAdd) {
      setShowPaymentPanel(true)
      return
    }

    if (!canAddMemory) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setClickedCoords({ lat, lng })
    setShowAddModal(true)
  }, [canAddMemory, mustPayToAdd])




  /* ===================================================
     SYNC MARKERS
  ==================================================== */

  // useEffect(() => {
  //   const map = mapRef.current
  //   if (!map || !isLoaded) return

  //   // Clear existing markers
  //   markersRef.current.forEach((marker) => {
  //     marker.setMap(null)
  //   })
  //   markersRef.current.clear()

  //   memories.forEach((memory) => {
  //     if (memory.lat == null || memory.lng == null) return

  //     const iconUrl = createBadgeIconUrl(
  //       memory.badge?.emoji ?? "📍",
  //       memory.badge?.bgColor ?? "#6366f1"
  //     )

  //     const marker = new google.maps.Marker({
  //       position: { lat: Number(memory.lat), lng: Number(memory.lng) },
  //       map,
  //       icon: {
  //         url: iconUrl,
  //         scaledSize: new google.maps.Size(44, 44),
  //         anchor: new google.maps.Point(22, 22),
  //       },
  //       title: memory.title,
  //     })

  //     marker.addListener("click", () => {
  //       setSelectedMemory(memory)
  //     })

  //     markersRef.current.set(memory.id, marker)
  //   })
  // }, [memories, isLoaded])
  /* ===================================================
     ADD MEMORY
  ==================================================== */

  const handleAddMemory = async (memory: Memory & { file?: File | null }) => {
    if (!mapData?.id) return

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        alert("Please login again.")
        return
      }

      const formData = new FormData()

      formData.append("title", memory.title)
      formData.append("badge", memory.badge.label)
      formData.append("message", memory.message || "")
      formData.append("latitude", memory.lat.toString())
      formData.append("longitude", memory.lng.toString())

      if (memory.date) {
        formData.append("memory_date", memory.date)
      }

      if (memory.file) {
        formData.append("photo", memory.file)
      }

      // ✅ Use raw fetch like Valentine
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/memory-maps/${mapData.id}/memories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
          },
          body: formData, // 🔥 DO NOT SET CONTENT-TYPE
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success || !data.memory) {
        console.error("Server response:", data)
        const errorMessage = data.message || "Failed to save memory. Please try again."
        alert(errorMessage)
        throw new Error(errorMessage)
      }

      const m = data.memory

      const badgeObj =
        BADGES.find((b) => b.label === m.badge) || BADGES[0]

      const formatted: Memory = {
        id: m.id,
        user_id: m.user_id, // 🔥 ADD THIS
        user: m.user, // ✅ ADD THIS
        title: m.title,
        badge: badgeObj,
        message: m.message ?? "",
        imageUrl: m.photo_url
          ? m.photo_url.startsWith('http')
            ? m.photo_url  // Already absolute (proxy URL from backend)
            : `${process.env.NEXT_PUBLIC_API_URL}/${m.photo_url}`  // Legacy relative path
          : undefined,
        lat: Number(m.latitude),
        lng: Number(m.longitude),
        date: m.memory_date ?? undefined,
        createdAt: new Date(m.created_at).getTime(),
      }


      setMemories((prev) => [...prev, formatted])
      setShowAddModal(false)
      setClickedCoords(null)

    } catch (err) {
      console.error("Add memory failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to add memory. Please check your connection and try again."
      if (!errorMessage.includes("Failed to save memory")) {
        alert(errorMessage)
      }
    }
  }



  const handleEditMemory = async (updated: Memory) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    )
    setEditingMemory(null)
  }

  const handleDeleteMemory = async (id: string) => {
    try {
      const response = await apiFetch(
        `/api/memory-maps/memories/${id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      setMemories((prev) => prev.filter((m) => m.id !== id))
      setSelectedMemory(null)
    } catch (err) {
      console.error("Delete memory failed:", err)
    }
  }

  /* ===================================================
   LOAD INITIAL MEMORIES FROM BACKEND
=================================================== */
  const initializedRef = useRef(false)

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-search-container]')) {
        setShowSearchResults(false)
      }
    }

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showSearchResults])

  useEffect(() => {
    if (!mapData?.memories) return
    if (initializedRef.current) return

    const formatted: Memory[] = mapData.memories.map((m: any) => {
      const badgeObj =
        BADGES.find((b) => b.label === m.badge) || BADGES[0]

      return {
        id: m.id,
        user_id: m.user_id, // 🔥 ADD THIS
        user: m.user,
        title: m.title,
        badge: badgeObj,
        message: m.message ?? "",
        imageUrl: m.photo_url
          ? m.photo_url.startsWith('http')
            ? m.photo_url  // Already absolute (proxy URL from backend)
            : `${process.env.NEXT_PUBLIC_API_URL}/${m.photo_url}`  // Legacy relative path
          : undefined,
        lat: Number(m.latitude),
        lng: Number(m.longitude),
        date: m.memory_date ?? undefined,
        createdAt: new Date(m.created_at).getTime(),
      }
    })

    setMemories(formatted)
    initializedRef.current = true
  }, [mapData])



  /* ===================================================
     LOCATION SEARCH
  ==================================================== */

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      // Use Nominatim API (OpenStreetMap) - free and no API key required
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      //   {
      //     headers: {
      //       'User-Agent': 'Tohfaah Memory Map App', // Required by Nominatim
      //     },
      //   }
      // )

      const response = await fetch(
        `/api/location-search?q=${encodeURIComponent(query)}`
      )

      const data = await response.json()
      setSearchResults(data)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Location search error:", error)
      toast.error("Failed to search location")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(value)
      }, 500)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng })
      mapRef.current.setZoom(12)
      toast.success(`Flying to ${result.display_name}`)
    }

    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  /* ===================================================
     CURRENT LOCATION
  ==================================================== */

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    const toastId = toast.loading("Fetching location...")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (mapRef.current) {
          mapRef.current.panTo({ lat: latitude, lng: longitude })
          mapRef.current.setZoom(14)
        }
        toast.dismiss(toastId)
      },
      (error) => {
        toast.dismiss(toastId)
        console.error("Geolocation error:", error)
        toast.error("Unable to retrieve your location. Please check permissions.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  /* ===================================================
     JOURNEY REPLAY
  ==================================================== */

  const handleJourneyReplay = async () => {
    if (!mapRef.current || isReplaying || memories.length === 0) return

    setIsReplaying(true)
    const map = mapRef.current
    const sorted = [...memories].sort((a, b) => a.createdAt - b.createdAt)

    for (let i = 0; i < sorted.length; i++) {
      const memory = sorted[i]

      await new Promise<void>((resolve) => {
        map.panTo({ lat: memory.lat, lng: memory.lng })
        map.setZoom(6)
        setSelectedMemory(memory)
        setTimeout(resolve, 2500)
      })
    }

    setIsReplaying(false)
  }

  // 🎨 Contributor color palette (max 5 users)
  const contributorColors = [
    "#9333ea",
    "#2563eb",
    "#ec4899",
    "#f97316",
    "#10b981",
  ]

  // Map user_id → color
  const userColorMap = useMemo(() => {
    const uniqueUsers = Array.from(
      new Set(memories.map((m) => m.user_id))
    )

    const map: Record<string, string> = {}

    uniqueUsers.slice(0, 5).forEach((userId, index) => {
      map[userId] = contributorColors[index % contributorColors.length]
    })

    return map
  }, [memories])

  // 📅 Sort memories chronologically
  const sortedMemories = useMemo(() => {
    return [...memories].sort(
      (a, b) => a.createdAt - b.createdAt
    )
  }, [memories])

  // 🌀 Create smooth curved connection
  function createCurvedPath(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    curvature = 0.25
  ) {
    const points = []

    const latDiff = end.lat - start.lat
    const lngDiff = end.lng - start.lng

    const midLat = (start.lat + end.lat) / 2
    const midLng = (start.lng + end.lng) / 2

    const offsetLat = -lngDiff * curvature
    const offsetLng = latDiff * curvature

    const controlPoint = {
      lat: midLat + offsetLat,
      lng: midLng + offsetLng,
    }

    const steps = 40

    for (let i = 0; i <= steps; i++) {
      const t = i / steps

      const lat =
        (1 - t) * (1 - t) * start.lat +
        2 * (1 - t) * t * controlPoint.lat +
        t * t * end.lat

      const lng =
        (1 - t) * (1 - t) * start.lng +
        2 * (1 - t) * t * controlPoint.lng +
        t * t * end.lng

      points.push({ lat, lng })
    }

    return points
  }
  /* ===================================================
     RENDER
  ==================================================== */

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">

      <ExperienceNav />

      {!isUnlocked && isPublished && (
        <PasswordGate
          hint={mapData?.password_hint}
          onUnlock={handleUnlock}
        />
      )}

      <div className="h-full w-full relative" style={{ minHeight: "100vh" }}>
        {/* <div className="flex-1 relative pt-20"> */}
        {loadError ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading Google Maps</p>
              <p className="text-sm text-muted-foreground">
                Please check your API key configuration
              </p>
            </div>
          </div>
        ) : !isLoaded ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onMapLoad}
            onClick={onMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            {memories.map((memory) => {
              if (memory.lat == null || memory.lng == null) return null

              return (
                <Marker
                  key={memory.id}
                  position={{
                    lat: Number(memory.lat),
                    lng: Number(memory.lng),
                  }}
                  icon={{
                    url: createBadgeIconUrl(
                      memory.badge?.emoji ?? "📍",
                      memory.badge?.bgColor ?? "#6366f1"
                    ),
                    scaledSize: new window.google.maps.Size(44, 44),
                    anchor: new window.google.maps.Point(22, 22),
                  }}
                  title={memory.title}
                  onClick={() => setSelectedMemory(memory)}
                />
              )
            })}

            {/* 🌀 Curved Journey Connections */}
            {sortedMemories.length > 1 &&
              sortedMemories.slice(0, -1).map((memory, index) => {
                const nextMemory = sortedMemories[index + 1]

                const curvedPath = createCurvedPath(
                  { lat: memory.lat, lng: memory.lng },
                  { lat: nextMemory.lat, lng: nextMemory.lng }
                )

                const segmentColor =
                  userColorMap[nextMemory.user_id] || "#9333ea"

                return (
                  <Polyline
                    key={`connection-${memory.id}`}
                    path={curvedPath}
                    options={{
                      strokeColor: segmentColor,
                      strokeOpacity: 0.95,
                      strokeWeight: 5,
                      geodesic: true,
                    }}
                  />
                )
              })}
          </GoogleMap>
        )}
      </div>
      {isDraft && (
        <div className="absolute inset-0 pointer-events-none z-[300] flex items-center justify-center">
          <span className="text-6xl font-bold text-gray-400/20 rotate-[-20deg] select-none">
            DRAFT PREVIEW
          </span>
        </div>
      )}

      {/* Location Search */}
      {/* Location Search - Desktop */}
      <div className="hidden sm:block fixed top-6 left-6 w-80 z-[450]" data-search-container>
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-muted-foreground z-10" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search location (e.g., Delhi, New York, Boston)..."
              className="w-full pl-10 pr-10 py-3 rounded-xl glass-strong border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-base transition-all shadow-lg"
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true)
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults([])
                  setShowSearchResults(false)
                }}
                className="absolute right-3 p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                <XIcon size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-xl border border-border/50 overflow-hidden z-[500] max-h-[300px] overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0 flex items-start gap-3"
                >
                  <MapPinIcon size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {result.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {result.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Action Bar - Desktop */}
      <div className="hidden sm:flex fixed top-6 right-6 z-[400] flex-wrap gap-2 justify-end">
        <button
          onClick={() => setShowStats(!showStats)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all"
        >
          <BarChart3 size={20} />
        </button>

        <button
          onClick={() => setShowTimeline(true)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all"
        >
          <Clock size={20} />
        </button>

        <button
          onClick={() => setShowGallery(true)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all"
        >
          <ImageIcon size={20} />
        </button>

        <button
          onClick={handleJourneyReplay}
          disabled={isReplaying}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all disabled:opacity-50"
        >
          <Play size={20} />
        </button>

        {isOwner && isDraft && isPaid && (
          <button
            onClick={handlePublish}
            className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            Publish
          </button>
        )}
      </div>

      {/* Top Action Bar - Mobile Floating */}
      <div className="sm:hidden fixed top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={() => setShowMobileSearch(true)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all shadow-lg"
        >
          <Search size={18} />
        </button>

        <button
          onClick={() => setShowStats(!showStats)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all shadow-lg"
        >
          <BarChart3 size={18} />
        </button>

        <button
          onClick={() => setShowTimeline(true)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all shadow-lg"
        >
          <Clock size={18} />
        </button>

        <button
          onClick={() => setShowGallery(true)}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all shadow-lg"
        >
          <ImageIcon size={18} />
        </button>

        <button
          onClick={handleJourneyReplay}
          disabled={isReplaying}
          className="p-2.5 rounded-xl glass-strong hover:shadow-md transition-all disabled:opacity-50 shadow-lg"
        >
          <Play size={18} />
        </button>

        {isOwner && isDraft && isPaid && (
          <button
            onClick={handlePublish}
            className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg text-xs"
          >
            Pub
          </button>
        )}
      </div>
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          className="sm:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[800] flex items-start justify-center pt-20 px-4"
          data-search-container
        >
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={18} />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-10 py-3 rounded-xl glass-strong border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-base shadow-lg"
              />
              <button
                onClick={() => {
                  setShowMobileSearch(false)
                  setSearchQuery("")
                  setSearchResults([])
                  setShowSearchResults(false)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XIcon size={18} />
              </button>
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-2 glass-strong rounded-xl shadow-xl border border-border/50 overflow-hidden max-h-[300px] overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const lat = parseFloat(result.lat)
                      const lng = parseFloat(result.lon)

                      setShowMobileSearch(false)

                      setTimeout(() => {
                        if (mapRef.current) {
                          mapRef.current.panTo({ lat, lng })
                          mapRef.current.setZoom(12)
                          toast.success(`Flying to ${result.display_name}`)
                        }
                      }, 150)

                      setSearchQuery("")
                      setSearchResults([])
                      setShowSearchResults(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0 flex items-start gap-3"
                  >
                    <MapPinIcon size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {result.display_name.split(",")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {result.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Panel */}
      {showPaymentPanel && isDraft && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[800]">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Unlock Your Memory Map</h3>

            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border"
            />

            <button
              onClick={handleApplyCoupon}
              disabled={isProcessing}
              className="w-full py-2 rounded-xl bg-primary text-white"
            >
              Apply Coupon
            </button>

            <div className="text-center text-sm text-muted-foreground">
              or
            </div>

            <button
              onClick={async () => {
                // ✅ Update payment state
                setLocalPaymentStatus("paid")

                setShowPaymentPanel(false)

                // ✅ Show success toast
                toast.success("Payment successful!", {
                  description: "Your map is being published...",
                })

                // ✅ Auto-publish and redirect to published map
                await handlePublish()
              }}
              className="w-full py-2 rounded-xl bg-accent text-white"
            >
              Pay ₹199
            </button>
          </div>
        </div>
      )}

      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocation}
        title="Go to current location"
        className="fixed bottom-24 right-5 sm:bottom-28 sm:right-8 z-[500] w-12 h-12 bg-background/90 backdrop-blur-sm border border-border text-foreground hover:bg-muted rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <LocateFixed size={20} />
      </button>

      {/* Floating Circular Buttons */}
      <div className="fixed bottom-6 left-6 z-[500] flex flex-col gap-3 items-start">
        {/* Memories Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label={`Memories (${memories.length})`}
        >
          <List size={24} className="sm:w-7 sm:h-7" />
          {memories.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent text-accent-foreground text-xs sm:text-sm font-bold flex items-center justify-center border-2 border-background">
              {memories.length > 99 ? '99+' : memories.length}
            </span>
          )}
        </button>

        {/* Add Memory Button */}
        <button
          onClick={() => {
            if (mustPayToAdd) {
              setShowPaymentPanel(true)
              return
            }

            if (!canAddMemory) return

            setClickedCoords(null)
            setShowAddModal(true)
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent/90 hover:bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Add Memory"
        >
          <Plus size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>



      {selectedMemory && !editingMemory && (
        <MemoryDetailCard
          memory={selectedMemory}
          allMemories={memories}
          onClose={() => setSelectedMemory(null)}
          onDelete={
            isOwner ||
              selectedMemory.user_id === currentUserId
              ? handleDeleteMemory
              : undefined
          }
          onEdit={
            isOwner ||
              selectedMemory.user_id === currentUserId
              ? setEditingMemory
              : undefined
          }
          onConnect={() => { }}
        />
      )}


      {editingMemory && (
        <EditMemoryModal
          memory={editingMemory}
          onClose={() => setEditingMemory(null)}
          onSave={handleEditMemory}
        />
      )}

      {showSidebar && (
        <MemorySidebar
          memories={memories}
          onSelect={(memory) => {
            setSelectedMemory(memory)
            if (mapRef.current) {
              mapRef.current.panTo({ lat: memory.lat, lng: memory.lng })
              mapRef.current.setZoom(6)
            }
          }}
          onClose={() => setShowSidebar(false)}
        />
      )}

      {showTimeline && (
        <MemoryTimeline
          memories={memories}
          onClose={() => setShowTimeline(false)}
          onSelectMemory={(memory) => {
            setSelectedMemory(memory)
            if (mapRef.current) {
              mapRef.current.panTo({ lat: memory.lat, lng: memory.lng })
              mapRef.current.setZoom(6)
            }
          }}
        />
      )}

      {showGallery && (
        <PhotoGallery
          memories={memories}
          onClose={() => setShowGallery(false)}
        />
      )}

      {showAddModal && canAddMemory && (
        <AddMemoryModal
          initialCoords={clickedCoords}
          onSave={handleAddMemory}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* ✅ SHARE MODAL GOES HERE */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[900]">
          <div className="bg-card rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">

            <h3 className="text-xl font-bold text-center">
              🎉 Your Memory Map is Live
            </h3>

            <div className="bg-muted p-3 rounded-xl text-xs break-all">
              {`${process.env.NEXT_PUBLIC_APP_URL}/premium-gifts/map-memory/${publishedToken || mapData.share_token}`}
            </div>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => {
                  const mapUrl = `/premium-gifts/map-memory/${publishedToken || mapData.share_token}`
                  // If still in draft mode, reload first then navigate
                  if (mode === "draft" || localStatus === "draft") {
                    window.location.href = mapUrl
                  } else {
                    router.push(mapUrl)
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
              >
                🗺️ Open Map
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL}/premium-gifts/map-memory/${publishedToken || mapData.share_token}`
                  )
                  toast.success("Link copied to clipboard!")
                }}
                className="w-full py-2 rounded-xl bg-primary text-white"
              >
                Copy Link
              </button>

              <button
                onClick={() => {
                  navigator.share?.({
                    title: mapData.title,
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/premium-gifts/map-memory/${publishedToken || mapData.share_token}`,
                  })
                }}
                className="w-full py-2 rounded-xl bg-blue-600 text-white"
              >
                Share Map
              </button>

              <button
                onClick={() =>
                  window.location.href = `/premium-gifts/map-memory/manage/${mapData.id}`
                }
                className="w-full py-2 rounded-xl bg-accent text-white"
              >
                Manage Map
              </button>

            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full text-sm text-muted-foreground pt-2"
            >
              Close
            </button>

          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

