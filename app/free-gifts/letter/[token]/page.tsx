import { Metadata } from "next";
import PublicLetterClient from "./public-letter-client";

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
    if (!gift?.gift_data?.content) throw new Error();

    return {
      title: `A Letter for ${gift.recipient_name} 💌`,
      description: `From ${gift.sender_name}`,
      openGraph: {
        title: `A Letter for ${gift.recipient_name} 💌`,
        description: `From ${gift.sender_name}`,
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og/letter/${token}`,
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `A Letter for ${gift.recipient_name} 💌`,
        description: `From ${gift.sender_name}`,
        images: [
          `${process.env.NEXT_PUBLIC_APP_URL}/api/og/letter/${token}`,
        ],
      },
    };
  } catch {
    return {
      title: "A Love Letter 💌",
      description: "A letter written with love",
    };
  }
}

export default async function Page(props: PageProps) {
  const { token } = await props.params;
  return <PublicLetterClient token={token} />;
}
