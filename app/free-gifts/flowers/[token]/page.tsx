import { Metadata } from "next";
import PublicFlowersClient from "./public-flowers-client";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    const { token } = await props.params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error();

    const gift = await res.json();

    if (gift.gift_type !== "flowers") throw new Error();

    return {
      title: `Flowers for ${gift.recipient_name} 🌸`,
      description: `A flower bouquet from ${gift.sender_name}`,
      openGraph: {
        title: `Flowers for ${gift.recipient_name} 🌸`,
        description: `From ${gift.sender_name}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/flowers/${token}`,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Flowers for ${gift.recipient_name} 🌸`,
        description: `From ${gift.sender_name}`,
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og/flowers/${token}`,
        ],
      },
    };
  } catch {
    return {
      title: "Flowers for you 🌸",
      description: "A flower bouquet made with love",
    };
  }
}

export default async function Page(props: PageProps) {
  const { token } = await props.params;
  return <PublicFlowersClient token={token} />;
}
