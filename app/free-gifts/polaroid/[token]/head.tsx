import { Metadata } from "next";

type Props = {
  params: { token: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts/${params.token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Polaroid Memory",
      description: "A special polaroid memory",
    };
  }

  const gift = await res.json();
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${gift.gift_data.image_path}`;

  return {
    title: `A Polaroid Memory for ${gift.recipient_name}`,
    description:
      gift.gift_data.message || "A special memory made with love",
    openGraph: {
      title: `A Polaroid Memory for ${gift.recipient_name}`,
      description:
        gift.gift_data.message || "A special memory made with love",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Polaroid Memory",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}
