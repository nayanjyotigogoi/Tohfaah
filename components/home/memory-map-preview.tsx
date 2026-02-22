"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
import { useGoogleMaps } from "@/lib/use-google-maps"
import { MapPin, ArrowRight } from "lucide-react"

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"]

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
}

const centerIndia = { lat: 20.5937, lng: 78.9629 }

type DemoMemory = {
  id: string
  title: string
  message: string
  emoji: string
  bgColor: string
  lat: number
  lng: number
}

function createBadgeIconUrl(emoji: string, bgColor: string): string {
  const svg = `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="20"
        fill="${bgColor}"
        stroke="rgba(255,255,255,0.95)"
        stroke-width="3"/>
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="22">
        ${emoji}
      </text>
    </svg>
  `

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22")

  return `data:image/svg+xml;charset=UTF-8,${encoded}`
}

export function MemoryMapPreview() {
  const router = useRouter()
  const [selected, setSelected] = useState<DemoMemory | null>(null)

  const demoMemories: DemoMemory[] = useMemo(
    () => [
      {
        id: "demo-mumbai",
        title: "Mumbai Sunset",
        message: "Marine Drive, first date vibes.",
        emoji: "❤️",
        bgColor: "#fde2e9",
        lat: 18.9388,
        lng: 72.8354,
      },
      {
        id: "demo-delhi",
        title: "Delhi Adventure",
        message: "Red Fort — history + you.",
        emoji: "✨",
        bgColor: "#ede2fe",
        lat: 28.6562,
        lng: 77.241,
      },
      {
        id: "demo-goa",
        title: "Goa Beach",
        message: "Sunset, waves, calm.",
        emoji: "🌊",
        bgColor: "#dbeafe",
        lat: 15.5517,
        lng: 73.7554,
      },
      {
        id: "demo-kolkata",
        title: "Kolkata Food Walk",
        message: "Park Street — best bites.",
        emoji: "☕",
        bgColor: "#fef3c7",
        lat: 22.5448,
        lng: 88.3426,
      },
    ],
    []
  )
const { isLoaded, loadError } = useGoogleMaps()
  // const { isLoaded, loadError } = useJsApiLoader({
  //   id: "google-map-home-preview",
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  //   libraries,
  // })

  const openDemo = () => router.push("/premium-gifts/map-memory/create")

  const markerIcons = useMemo(() => {
    if (!isLoaded || !window.google) return {}

    const icons: Record<string, google.maps.Icon> = {}

    demoMemories.forEach((m) => {
      icons[m.id] = {
        url: createBadgeIconUrl(m.emoji, m.bgColor),
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22),
      }
    })

    return icons
  }, [demoMemories, isLoaded])

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 50 / 50 Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16">

         

          {/* RIGHT SIDE — MAP (50%) */}
          <div
            onClick={openDemo}
            className="w-full lg:w-1/2 h-[440px] rounded-3xl overflow-hidden border border-border/60 shadow-2xl cursor-pointer group relative"
          >
            {loadError ? (
              <div className="h-full flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <p className="text-destructive font-medium">Map failed to load</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check Google Maps API key / restrictions.
                  </p>
                </div>
              </div>
            ) : !isLoaded ? (
              <div className="h-full flex items-center justify-center bg-muted/30">
                <p className="text-muted-foreground">Loading map preview...</p>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={centerIndia}
                zoom={5}
                options={{
                  disableDefaultUI: true,
                  clickableIcons: false,
                  gestureHandling: "cooperative",
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {demoMemories.map((m) => (
                  <Marker
                    key={m.id}
                    position={{ lat: m.lat, lng: m.lng }}
                    icon={markerIcons[m.id]}
                    onClick={(e) => {
                      if (e && typeof (e as any).domEvent?.stopPropagation === "function") {
                        ;(e as any).domEvent.stopPropagation()
                      }
                      setSelected(m)
                    }}
                  />
                ))}

                {selected && (
                  <InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                  >
                    <div style={{ maxWidth: 220 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {selected.title}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>
                        {selected.message}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>

           {/* LEFT SIDE — TEXT (50%) */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-primary/80 text-sm font-semibold tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Memory Map
            </p>

            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight">
              Pin Your Memories to the <span className="italic text-primary">Map</span>
            </h2>

            <p className="text-muted-foreground text-lg">
              Create a personalized map filled with your most cherished moments.
              Perfect for anniversaries, weddings, or just because.
            </p>

            <button
              onClick={openDemo}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-3 font-semibold shadow-lg hover:brightness-105 transition"
            >
              Create Memory <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}