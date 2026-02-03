import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/free-gifts/${params.token}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) throw new Error("Gift not found");

    const gift = await res.json();

    // ✅ ONLY validate gift type (never gift_data)
    if (gift.gift_type !== "polaroid") {
      throw new Error("Invalid polaroid gift");
    }

    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    const message =
      gift.gift_data?.message?.slice(0, 120) ??
      "A memory made with love.";

    // ✅ Safe image fallback
    const imagePath = gift.gift_data?.image_path;
    const imageUrl = imagePath
      ? `${API_BASE_URL}/${imagePath}`
      : `${API_BASE_URL}/placeholder-polaroid.jpg`;

    // Repeat image to create intentional grid
    const images = [imageUrl, imageUrl, imageUrl];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #fff1f2, #fdf2f8)",
            padding: 60,
            display: "flex",
            flexDirection: "column",
            fontFamily: "ui-sans-serif, system-ui",
            boxSizing: "border-box",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                fontSize: 42,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              A Polaroid for {recipient} 🤍
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 24,
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
                  paddingBottom: 40,
                  borderRadius: 10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                  transform:
                    index === 0
                      ? "rotate(-4deg)"
                      : index === 1
                      ? "rotate(3deg)"
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

                {/* CAPTION */}
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    fontSize: 18,
                    color: "#374151",
                    padding: "0 6px",
                  }}
                >
                  {message}
                </div>
              </div>
            ))}
          </div>

          {/* WATERMARK */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              right: 40,
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            Made with{" "}
            <span style={{ color: "#ec4899" }}>Tohfaah</span> 🤍
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    // ✅ NEVER crash OG
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            background: "#fff",
          }}
        >
          Polaroid Memory 🤍
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
