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
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Gift not found");

    const gift = await res.json();

    if (gift.gift_type !== "letter") {
      throw new Error("Invalid letter gift");
    }

    const recipient = gift.recipient_name ?? "Someone special";
    const sender = gift.sender_name ?? "Someone who cares";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg,#fdf2f8,#fce7f3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: 720,
              padding: 64,
              paddingBottom: 96,
              borderRadius: 28,
              boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 34,
                color: "#6b7280",
                marginBottom: 16,
              }}
            >
              A Letter for
            </div>

            <div
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              {recipient}
            </div>

            <div
              style={{
                width: 80,
                height: 2,
                background: "#f9a8d4",
                margin: "32px auto",
              }}
            />

            <div
              style={{
                fontSize: 26,
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              — {sender}
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
            Written with{" "}
            <span style={{ color: "#ec4899", fontWeight: 600 }}>
              Tohfaah
            </span>{" "}
            💌
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
          This letter doesn’t exist 💔
        </div>
      ),
      { width: 1080, height: 1350 }
    );
  }
}
