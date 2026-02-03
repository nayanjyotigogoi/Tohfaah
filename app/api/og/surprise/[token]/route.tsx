import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tohfaah.online";

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

    // ✅ Validate gift type ONLY
    if (gift.gift_type !== "surprise") {
      throw new Error("Invalid surprise gift");
    }

    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    // ✅ Safe title fallback
    const title =
      gift.gift_data?.title?.slice(0, 60) ??
      "A Special Surprise 💖";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg,#fff1f2,#fdf2f8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "ui-sans-serif, system-ui",
          }}
        >
          {/* SURPRISE CARD */}
          <div
            style={{
              background: "#ffffff",
              width: 720,
              padding: 56,
              paddingBottom: 96,
              borderRadius: 28,
              boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            {/* EMOJI / VISUAL ANCHOR */}
            <div
              style={{
                fontSize: 96,
                marginBottom: 24,
              }}
            >
              🎁
            </div>

            {/* TITLE */}
            <div
              style={{
                fontSize: 44,
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* RECIPIENT */}
            <div
              style={{
                marginTop: 20,
                fontSize: 26,
                color: "#6b7280",
              }}
            >
              A surprise for {recipient}
            </div>

            {/* SENDER */}
            <div
              style={{
                marginTop: 28,
                fontSize: 22,
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              — {sender}
            </div>
          </div>

          {/* WATERMARK */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              fontSize: 22,
              color: "#9ca3af",
            }}
          >
            Made with{" "}
            <span style={{ color: "#ec4899", fontWeight: 600 }}>
              Tohfaah
            </span>{" "}
            💖
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350, // ✅ TRUE PORTRAIT
      }
    );
  } catch {
    // ✅ OG must NEVER crash
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
          Surprise 💖
        </div>
      ),
      { width: 1080, height: 1350 }
    );
  }
}
