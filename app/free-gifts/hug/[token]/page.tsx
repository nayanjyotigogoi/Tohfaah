import { Metadata } from "next";
import HugClient from "./HugClient";

export const runtime = "nodejs";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000";

const APP_BASE_URL =
  process.env.APP_BASE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params?: { token?: string };
}) {
  try {
    if (!params?.token) {
      return {
        title: "Virtual Hug 🤍",
        description: "A virtual hug made with love",
      };
    }

    const url = `${API_BASE_URL}/api/free-gifts/${params.token}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return {
        title: "Virtual Hug 🤍",
        description: "A virtual hug made with love",
      };
    }

    const text = await res.text();

    // 🔐 Extra safety: ensure JSON
    let gift;
    try {
      gift = JSON.parse(text);
    } catch {
      return {
        title: "Virtual Hug 🤍",
        description: "A virtual hug made with love",
      };
    }

    return {
      title: `A hug for ${gift.recipient_name} 🤍`,
      description: `Sent with love by ${gift.sender_name ?? "someone special"}`,
      openGraph: {
        images: [
          {
            url: `${APP_BASE_URL}/api/og/hug/${params.token}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Virtual Hug 🤍",
      description: "A virtual hug made with love",
    };
  }
}


export default function Page() {
  return <HugClient />;
}
