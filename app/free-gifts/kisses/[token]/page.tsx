import { Metadata } from "next";
import PublicKissesClient from "./public-kisses-client";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    // ✅ MUST AWAIT PARAMS
    const { token } = await props.params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${token}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error();

    const gift = await res.json();

    if (gift.gift_type !== "kisses") throw new Error();

    return {
      title: `Kisses for ${gift.recipient_name} 💋`,
      description: `Sent with love by ${gift.sender_name}`,
      openGraph: {
        title: `Kisses for ${gift.recipient_name} 💋`,
        description: `Sent with love by ${gift.sender_name}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/kiss/${token}`,
            width: 1200,
            height: 630,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `Kisses for ${gift.recipient_name} 💋`,
        description: `Sent with love by ${gift.sender_name}`,
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og/kiss/${token}`,
        ],
      },
    };
  } catch {
    return {
      title: "Virtual Kisses 💋",
      description: "A kiss sent with love",
    };
  }
}

export default async function Page(props: PageProps) {
  // ✅ MUST AWAIT PARAMS HERE TOO
  const { token } = await props.params;

  return <PublicKissesClient token={token} />;
}
