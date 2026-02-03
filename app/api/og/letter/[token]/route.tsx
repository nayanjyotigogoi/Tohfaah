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
    if (gift.gift_type !== "letter") {
      throw new Error("Invalid letter gift");
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg,#fdf2f8,#fce7f3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 48,
              borderRadius: 24,
              width: 900,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40 }}>A Letter for</div>
            <div style={{ fontSize: 48, marginTop: 12 }}>
              {gift.recipient_name}
            </div>
            <div style={{ marginTop: 24, fontSize: 20 }}>
              — {gift.sender_name}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
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
        This letter doesn’t exist 💔
      </div>,
      { width: 1200, height: 630 }
    );
  }
}
