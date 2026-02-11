"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ValentineDisplay } from "../../components/ValentineDisplay"
import { PreviewActionBar } from "../../components/sections/PreviewActionBar"
import type { ValentineConfig } from "@/lib/valentine-types"
import { Heart, Copy, Eye, X, Share2 } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface Gift {
  id: string
  status: string
  payment_status: string
  share_token: string | null
  config: ValentineConfig
}

interface GiftResponse {
  gift: Gift
}

export default function PreviewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.token as string

  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  /* ================================
     FETCH DRAFT
  ================================= */
  useEffect(() => {
    if (!id) return

    const fetchDraft = async () => {
      try {
        const response = await apiFetch(
          `/api/premium-gifts/preview/${id}`,
          { method: "GET" }
        )

        const data: GiftResponse = await response.json()

        if (!response.ok) {
          throw new Error("Draft not found or unauthorized.")
        }

        setGift(data.gift)
      } catch (err: any) {
        setError(err.message || "Failed to load preview.")
      } finally {
        setLoading(false)
      }
    }

    fetchDraft()
  }, [id])

  /* ================================
     APPLY COUPON
  ================================= */
  const handleApplyCoupon = async (code: string) => {
    if (!gift) return

    const response = await apiFetch(
      `/api/premium-gifts/${gift.id}/apply-coupon`,
      {
        method: "POST",
        body: JSON.stringify({ coupon_code: code }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Invalid coupon")
    }

    setGift(data.gift)
    return data
  }

  /* ================================
     PUBLISH → SHOW MODAL
  ================================= */
  const handlePublish = async () => {
    if (!gift) return

    try {
      if (gift.config.lock?.enabled) {
        const updateResponse = await apiFetch(
          `/api/premium-gifts/draft/${gift.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lock_question: gift.config.lock.question,
              lock_answer: gift.config.lock.answer,
              lock_hint: gift.config.lock.hint,
            }),
          }
        )

        const updateData = await updateResponse.json()

        if (!updateResponse.ok || !updateData.success) {
          throw new Error("Failed to save lock.")
        }
      }

      const publishResponse = await apiFetch(
        `/api/premium-gifts/${gift.id}/publish`,
        { method: "POST" }
      )

      const publishData = await publishResponse.json()

      if (!publishResponse.ok || !publishData.success) {
        throw new Error(publishData.message || "Publish failed.")
      }

      setGift(publishData.gift)
      setShowShareModal(true)

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Something went wrong.")
    }
  }

/* ================================
   SHARE HANDLERS
================================= */
const shareUrl =
  typeof window !== "undefined" && gift?.share_token
    ? `${window.location.origin}/premium-gifts/valentine/${gift.share_token}`
    : ""

const senderName = gift?.config?.identity?.senderName ||"Someone"
const recipientName = gift?.config?.identity?.recipientName || "You"

const handleShare = async () => {
  if (!shareUrl) return

  const shareText = `${senderName} created something special for ${recipientName} 💖`

  // Native Web Share (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${senderName} ❤️ ${recipientName}`,
        text: shareText,
        url: shareUrl,
      })
    } catch (err) {
      console.error("Share cancelled or failed")
    }
  } else {
    // Desktop fallback → copy
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
}

const handleCopyDirect = async () => {
  if (!shareUrl) return
  await navigator.clipboard.writeText(shareUrl)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

  const handleViewPublic = () => {
    if (!gift?.share_token) return
    router.push(`/gift/${gift.share_token}`)
  }

  /* ================================
     STATES
  ================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(350,70%,92%)]">
        <Heart
          className="w-16 h-16 text-primary animate-pulse-heart"
          fill="currentColor"
        />
      </div>
    )
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error || "Something went wrong"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div className="rotate-[-30deg] text-[120px] md:text-[160px] font-bold tracking-widest text-black/5 select-none">
            PREVIEW
          </div>
        </div>

        <ValentineDisplay
          config={gift.config}
          onReset={() =>
            router.push("/premium-gifts/valentine/create")
          }
        />
      </div>

      <PreviewActionBar
        gift={gift}
        onApplyCoupon={handleApplyCoupon}
        onPublish={handlePublish}
        onCopy={() => {}}
        onView={() => {}}
      />

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-fade-in-up">

            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <Share2 className="w-12 h-12 mx-auto text-primary" />

              <h2 className="text-2xl font-display">
                Your Gift is Live 💖
              </h2>

              <p className="text-sm text-muted-foreground">
                Share this special moment with someone you love.
              </p>

              <div className="bg-muted p-3 rounded-lg text-xs break-all">
                {shareUrl}
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-center gap-3">
                    
                    {/* Main Share Button */}
                    <button
                    onClick={handleShare}
                    className="px-8 py-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center gap-2"
                    >
                    <Share2 className="w-4 h-4" />
                    Share Gift
                    </button>

                    {/* Small Copy Icon */}
                    <button
                    onClick={handleCopyDirect}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition"
                    title="Copy link"
                    >
                    <Copy className="w-4 h-4" />
                    </button>

                </div>


                <button
                  onClick={handleViewPublic}
                  className="px-4 py-2 rounded-full border border-border flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Gift
                </button>
              </div>

              {copied && (
                <p className="text-xs text-muted-foreground mt-2">
                  Link copied — paste it anywhere 💌
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
