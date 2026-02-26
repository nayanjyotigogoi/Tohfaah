import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")
  const lat = req.nextUrl.searchParams.get("lat")
  const lng = req.nextUrl.searchParams.get("lng")

  if (!query) {
    return NextResponse.json([], { status: 200 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    )
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

    // Bias results based on location if provided
    if (lat && lng) {
      url += `&location=${lat},${lng}&radius=50000` // 50km radius bias
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data)
      throw new Error(data.error_message || "Places API error")
    }

    // Map Google's response to the format expected by the frontend ({ display_name, lat, lon })
    const results = (data.results || []).map((place: any) => ({
      display_name: place.name + (place.formatted_address ? `, ${place.formatted_address}` : ""),
      lat: place.geometry.location.lat,
      lon: place.geometry.location.lng,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("Location search failed:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}