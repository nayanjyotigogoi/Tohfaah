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

    if (gift.gift_type !== "kisses") {
      throw new Error("Invalid kiss gift");
    }

    const kisses = Array.isArray(gift.gift_data?.kisses)
      ? gift.gift_data.kisses.slice(0, 6)
      : [];

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
            fontFamily: "ui-sans-serif, system-ui",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 32,
              borderRadius: 24,
              width: 900,
              boxShadow: "0 30px 60px rgba(0,0,0,.18)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {kisses.length > 0
                ? kisses.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fde2e4",
                        aspectRatio: "1 / 1",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                      }}
                    >
                      💋
                    </div>
                  ))
                : Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fde2e4",
                        aspectRatio: "1 / 1",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                      }}
                    >
                      💋
                    </div>
                  ))}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <div style={{ fontSize: 34 }}>
                Kisses for {gift.recipient_name}
              </div>
              <div style={{ fontSize: 20, color: "#6b7280" }}>
                From {gift.sender_name}
              </div>
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
        These kisses don’t exist 💔
      </div>,
      { width: 1200, height: 630 }
    );
  }
}
