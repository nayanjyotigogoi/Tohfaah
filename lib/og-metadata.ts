import type { Metadata } from "next";

type Props = {
  token: string;
  giftType: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tohfaah.online";

const APP_BASE =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://tohfaah.online";

/**
 * Gift title map
 */
const giftTitles: Record<string, string> = {
  polaroid: "A Polaroid for",
  letter: "A Love Letter for",
  hug: "A Hug for",
  kisses: "Kisses for",
  flowers: "Flowers for",
  balloons: "Balloons for",
  chocolates: "Chocolates for",
  moment: "A Surprise for",
};

export async function generateGiftMetadata({
  token,
  giftType,
}: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${API_BASE}/api/free-gifts/${token}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error();

    const gift = await res.json();

    const recipient =
      gift.recipient_name ?? "Someone special";

    const sender =
      gift.sender_name ?? "Someone who cares";

    const prefix =
      giftTitles[giftType] ?? "A Gift for";

    const title = `${prefix} ${recipient} 🤍`;

    const description = `A special ${giftType} from ${sender}. Tap to open your surprise.`;

    const pageUrl = `${APP_BASE}/free-gifts/${giftType}/${token}`;

    const ogImage = `${APP_BASE}/api/og/${giftType}/${token}`;

    return {
      title,
      description,

      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "Tohfaah",
        images: [
          {
            url: ogImage,
            width: 1080,
            height: 1350,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    const ogImage = `${APP_BASE}/api/og/${giftType}/${token}`;

    return {
      title: "You received a surprise gift 🤍",
      description: "Tap to open your gift.",
      openGraph: {
        title: "You received a surprise gift 🤍",
        description: "Tap to open your gift.",
        images: [ogImage],
      },
    };
  }
}
