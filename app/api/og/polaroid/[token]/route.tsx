import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tohfaah.online";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    const res = await fetch(
      `${API_BASE_URL}/api/free-gifts/${token}`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) throw new Error("Gift not found");

    const gift = await res.json();

    if (gift.gift_type !== "polaroid") {
      throw new Error("Invalid polaroid gift");
    }

    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    const message =
      gift.gift_data?.message?.slice(0, 120) ??
      "A memory made with love.";

    const imageUrl =
      gift.gift_data?.image_url ??
      "https://tohfaah.online/placeholder-polaroid.jpg";

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
          <div
            style={{
              background: "#ffffff",
              width: 720,
              padding: 32,
              paddingBottom: 72,
              borderRadius: 22,
              boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            <img
              src={imageUrl}
              width={620}
              height={620}
              style={{
                objectFit: "cover",
                borderRadius: 10,
                display: "block",
                margin: "0 auto",
              }}
            />

            <div
              style={{
                marginTop: 28,
                fontSize: 34,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              A Polaroid for {recipient} 🤍
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                color: "#6b7280",
              }}
            >
              From {sender}
            </div>

            <div
              style={{
                marginTop: 20,
                fontSize: 20,
                color: "#374151",
                padding: "0 12px",
              }}
            >
              {message}
            </div>
          </div>

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
            🤍
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
      }
    );
  } catch {
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
          Polaroid Memory 🤍
        </div>
      ),
      { width: 1080, height: 1350 }
    );
  }
}
