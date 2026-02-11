import ClientPreviewPage from "./ClientPreviewPage"
import type { Metadata } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {

  const { token } = await params

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const res = await fetch(
      `${baseUrl}/api/premium-gifts/preview/${token}`,
      { cache: "no-store" }
    )

    const data = await res.json()

    if (!res.ok || !data?.gift) {
      return {
        title: "Preview | Tohfaah 💖",
        description: "A special surprise is waiting..."
      }
    }

    const gift = data.gift
    const sender = gift.config?.senderName || "Someone"
    const occasion = gift.config?.occasion || "Valentine"

    const title = `${sender} created a ${occasion} surprise 💖`
    const description = "Preview this beautiful digital experience."

    const ogImage = `${baseUrl}/api/og-valentine-preview/${token}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage]
      }
    }

  } catch {
    return {
      title: "Preview | Tohfaah 💖",
      description: "A special surprise is waiting..."
    }
  }
}

export default function Page() {
  return <ClientPreviewPage />
}

