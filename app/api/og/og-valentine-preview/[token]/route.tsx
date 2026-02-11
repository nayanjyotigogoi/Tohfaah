import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#e6e1cd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Top Heading */}
        <div
          style={{
            position: "absolute",
            top: 60,
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            fontSize: 40,
            letterSpacing: 4,
            color: "#b71c1c",
          }}
        >
          <div>HAPPY</div>
          <div>VALENTINE’S</div>
          <div>DAY</div>
        </div>

        {/* Soft Heart Background (layered for blur effect) */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 520,
            backgroundColor: "rgba(229,115,115,0.35)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 420,
            backgroundColor: "rgba(229,115,115,0.45)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 340,
            backgroundColor: "rgba(229,115,115,0.6)",
            borderRadius: "50%",
          }}
        />

        {/* Main Text */}
        <div
          style={{
            fontSize: 140,
            color: "#b71c1c",
            fontStyle: "italic",
            marginBottom: -20,
          }}
        >
          Love
        </div>

        <div
          style={{
            fontSize: 70,
            color: "#b71c1c",
            fontStyle: "italic",
          }}
        >
          is in the Air
        </div>

        {/* Bottom Text */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontSize: 38,
            color: "#b71c1c",
          }}
        >
          Gift ideas from Amazon.
        </div>

        {/* Floating Hearts */}
        <div style={{ position: "absolute", top: 200, left: 120, fontSize: 50, color: "#e57373" }}>❤</div>
        <div style={{ position: "absolute", top: 230, right: 140, fontSize: 50, color: "#e57373" }}>❤</div>
        <div style={{ position: "absolute", bottom: 160, left: 200, fontSize: 50, color: "#e57373" }}>❤</div>
        <div style={{ position: "absolute", bottom: 130, right: 220, fontSize: 50, color: "#e57373" }}>❤</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
