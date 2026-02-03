import { Metadata } from "next";
import PublicSurpriseClient from "./public-surprise-client";

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

    if (!gift?.gift_data?.title) throw new Error();

    return {
      title: `${gift.gift_data.title} 💖`,
      description: `A surprise for ${gift.recipient_name}`,
      openGraph: {
        title: `${gift.gift_data.title} 💖`,
        description: `From ${gift.sender_name}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og/surprise/${token}`,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${gift.gift_data.title} 💖`,
        description: `From ${gift.sender_name}`,
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og/surprise/${token}`,
        ],
      },
    };
  } catch {
    return {
      title: "A Special Surprise 💖",
      description: "A moment created with love",
    };
  }
}

export default async function Page(props: PageProps) {
  const { token } = await props.params;
  return <PublicSurpriseClient token={token} />;
}
