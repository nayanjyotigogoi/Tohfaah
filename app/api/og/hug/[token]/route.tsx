import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000";

const APP_BASE_URL =
  process.env.APP_BASE_URL ?? "http://localhost:3000";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/free-gifts/${params.token}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Gift not found");

    const gift = await res.json();

    const hugStyle = gift.gift_data?.hug_style ?? 1;
    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    // Polaroid image sources (reusing hug styles for grid feel)
    const images = [
      `${APP_BASE_URL}/hug-${hugStyle}.gif`,
      `${APP_BASE_URL}/hug-${((hugStyle % 3) || 1)}.gif`,
      `${APP_BASE_URL}/hug-${((hugStyle % 2) || 1)}.gif`,
    ];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #fff1f2, #fdf2f8)",
            display: "flex",
            flexDirection: "column",
            padding: 60,
            boxSizing: "border-box",
            fontFamily: "ui-sans-serif, system-ui",
          }}
        >
          {/* TITLE */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontSize: 44,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              A hug for {recipient} 🤍
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 26,
                color: "#6b7280",
              }}
            >
              From {sender}
            </div>
          </div>

          {/* POLAROID GRID */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
            }}
          >
            {images.map((src, index) => (
              <div
                key={index}
                style={{
                  background: "#ffffff",
                  padding: 18,
                  paddingBottom: 36,
                  borderRadius: 10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                  transform:
                    index === 0
                      ? "rotate(-4deg)"
                      : index === 1
                      ? "rotate(2deg)"
                      : "rotate(-1deg)",
                }}
              >
                <img
                  src={src}
                  width={260}
                  height={260}
                  style={{
                    objectFit: "cover",
                    borderRadius: 6,
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>

          {/* BRAND WATERMARK */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              right: 40,
              fontSize: 20,
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Made with <span style={{ color: "#ec4899" }}>Tohfaah</span> 🤍
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            background: "#fff",
          }}
        >
          Virtual Hug 🤍
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
