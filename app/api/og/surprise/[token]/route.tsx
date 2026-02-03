import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${params.token}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Gift not found");

    const gift = await res.json();

    // ✅ ONLY validate gift type
    if (gift.gift_type !== "surprise") {
      throw new Error("Invalid surprise gift");
    }

    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    // ✅ Safe title fallback (OG must not depend on gift_data)
    const title =
      gift.gift_data?.title?.slice(0, 60) ??
      "A Special Surprise 💖";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg,#ffe4e6,#fbcfe8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "ui-sans-serif",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 48,
              borderRadius: 32,
              width: 900,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {title}
            </div>
            <div style={{ fontSize: 22, color: "#6b7280" }}>
              A surprise for {recipient}
            </div>
            <div style={{ marginTop: 24, fontSize: 18 }}>
              — {sender}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    // ✅ OG should NEVER hard-fail
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        Surprise 💖
      </div>,
      { width: 1200, height: 630 }
    );
  }
}
