import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")

  if (!query) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Tohfaah Memory Map App",
        },
      }
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Location search failed:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}