"use client"

import { useJsApiLoader } from "@react-google-maps/api"

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"]

export function useGoogleMaps() {
  return useJsApiLoader({
    id: "google-map-script", // 🔥 MUST stay identical everywhere
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })
}