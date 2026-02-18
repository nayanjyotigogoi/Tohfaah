"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  CreditCard,
  Gift,
  Link2,
  Eye,
  X,
} from "lucide-react"

import { apiFetch } from "@/lib/api"
import { loadRazorpay } from "@/lib/razorpay"

import { PRICING } from "@/lib/config"

interface GiftType {
  id: string
  status: string
  payment_status: string
  share_token: string | null
}

interface Props {
  gift: GiftType
  onApplyCoupon: (code: string) => Promise<{ message?: string }>
  onPublish: () => Promise<void>
  onCopy: () => void
  onView: () => void
}

export function PreviewActionBar({
  gift,
  onApplyCoupon,
  onPublish,
  onCopy,
  onView,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)

  const isPublished = gift.status === "published"
  const isPaid =
    gift.payment_status === "paid" ||
    gift.payment_status === "coupon_redeemed"

  const handleCouponSubmit = async () => {
    try {
      setLoading("coupon")
      setCouponError(null)
      setCouponSuccess(null)

      if (!couponCode.trim()) {
        throw new Error("Please enter a coupon code.")
      }

      const data = await onApplyCoupon(couponCode)

      setCouponSuccess(data.message || "Coupon applied successfully! 🎉")
      setCouponCode("")

      setTimeout(() => {
        setShowCouponModal(false)
        setCouponSuccess(null)
      }, 1500)

    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon.")
    } finally {
      setLoading(null)
    }
  }


  /* ==============================
     PAYMENT HANDLER
  ============================== */
  const handlePayment = async () => {
    try {
      setLoading("payment")

      // 1. Load Razorpay Script
      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load.")
      }

      // 2. Create Order
      const orderRes = await apiFetch(`/api/premium-gifts/${gift.id}/create-order`, {
        method: "POST",
      })
      const orderData = await orderRes.json()

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create order.")
      }

      // 3. Open Razorpay Modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Tohfaah Premium",
        description: "Valentine Experience",
        order_id: orderData.order_id,
        prefill: {
          email: orderData.contact,
        },
        theme: {
          color: "#e11d48", // Rose-600
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await apiFetch(`/api/premium-gifts/${gift.id}/verify-payment`, {
              method: "POST",
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              alert("Payment verification failed. Please contact support.")
              return
            }

            // Reload to update state
            window.location.reload()

          } catch (err) {
            alert("Verification error. Please contact support.")
          }
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()

    } catch (err: any) {
      alert(err.message || "Something went wrong.")
    } finally {
      setLoading(null)
    }
  }

  const handlePublish = async () => {
    try {
      setLoading("publish")
      await onPublish()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-8 relative">

            <button
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Gift className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-display">
                Apply Coupon Code 🎁
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Got a special code? Enter it below.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="h-12 text-center text-lg"
              />

              {couponError && (
                <p className="text-sm text-red-500 text-center">
                  {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-sm text-green-600 text-center">
                  {couponSuccess}
                </p>
              )}


              <Button
                className="w-full"
                disabled={loading === "coupon"}
                onClick={handleCouponSubmit}
              >
                {loading === "coupon"
                  ? "Applying..."
                  : "Apply Coupon"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md shadow-2xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-sm text-muted-foreground">
            {isPublished
              ? "Your gift is published."
              : isPaid
                ? "Ready to publish."
                : "Payment required to publish."}
          </div>

          <div className="flex gap-3 flex-wrap justify-center">

            {!isPublished && !isPaid && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCouponModal(true)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Apply Coupon
                </Button>

                <Button
                  onClick={handlePayment}
                  disabled={loading === "payment"}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading === "payment" ? "Loading..." : `Pay ${PRICING.valentine_premium.symbol}${PRICING.valentine_premium.amount}`}
                </Button>
              </>
            )}

            {!isPublished && isPaid && (
              <Button
                disabled={loading === "publish"}
                onClick={handlePublish}
              >
                {loading === "publish"
                  ? "Publishing..."
                  : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Publish Gift
                    </>
                  )}
              </Button>
            )}

            {isPublished && (
              <>
                <Button variant="outline" onClick={onCopy}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>

                <Button onClick={onView}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Public
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
