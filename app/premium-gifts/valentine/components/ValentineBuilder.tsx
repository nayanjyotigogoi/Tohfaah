"use client"
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Calendar,
  Car,
  Puzzle,
  ImageIcon,
  Sparkles,
  MessageCircleHeart,
  Ticket,
  Truck,
  ChevronRight,
  ChevronLeft,
  HeartHandshake,
} from "lucide-react"


const stepLabels = [
  "Date",
  "Love Meter",
  "Puzzle",
  "Photos",
  "Car",
  "Message",
  "Coupons",
  "Truck",
  "Ask Out",
  "Lock",
  "Forever",
]

const stepIcons = [
  Calendar,
  Heart,
  Puzzle,
  ImageIcon,
  Car,
  MessageCircleHeart,
  Ticket,
  Truck,
  HeartHandshake,
  HeartHandshake,
  Heart,
]

import type { ValentineConfig } from "@/lib/valentine-types"
import { DEFAULT_CONFIG } from "@/lib/valentine-types"

export function ValentineBuilder() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<ValentineConfig>({ ...DEFAULT_CONFIG })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 11

  const [photo1File, setPhoto1File] = useState<File | null>(null)
  const [photo2File, setPhoto2File] = useState<File | null>(null)

  /* =============================
     🔐 LOGIN PROTECTION
  ============================= */

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.replace("/login")
    }
  }, [router])

  /* =============================
     PHOTO UPLOAD
  ============================= */

  const handlePhotoUpload =
    (photoNumber: 1 | 2) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (photoNumber === 1) setPhoto1File(file)
      else setPhoto2File(file)

      const previewUrl = URL.createObjectURL(file)

      setConfig((prev) => ({
        ...prev,
        visuals: {
          ...prev.visuals,
          [`photo${photoNumber}`]: previewUrl,
        },
      }))
    }

    const [tornCoupons, setTornCoupons] = useState<number[]>([])

  const updateCoupon = (
    index: number,
    field: "title" | "subtitle",
    value: string
  ) => {
    setConfig((prev) => {
      const updated = [...prev.message.coupons]
      updated[index] = { ...updated[index], [field]: value }

      return {
        ...prev,
        message: {
          ...prev.message,
          coupons: updated,
        },
      }
    })
  }

  const tearCoupon = (index: number) => {
    setTornCoupons((prev) => [...prev, index])

    // Remove after animation
    setTimeout(() => {
      setConfig((prev) => ({
        ...prev,
        message: {
          ...prev.message,
          coupons: prev.message.coupons.filter((_, i) => i !== index),
        },
      }))
      setTornCoupons([])
    }, 600)
  }

  /* =============================
     🚀 CREATE DRAFT (NOT SHARE)
  ============================= */

  const handleCreate = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.replace("/login")
        return
      }

      if (!config.lock.question || !config.lock.answer) {
        throw new Error("Lock question and answer are required.")
      }

      /* ==============================
        1️⃣ CREATE DRAFT
      ============================== */

      const formData = new FormData()
      formData.append("template_type", "premium_valentine")
      formData.append("recipient_name", config.identity.recipientName)
      formData.append("sender_name", config.identity.senderName)
      formData.append("config", JSON.stringify(config))

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/draft`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create draft.")
      }

      const giftId = data.gift_id

      /* ==============================
        2️⃣ UPLOAD IMAGES
      ============================== */

      if (photo1File || photo2File) {
        const imageData = new FormData()

        if (photo1File) imageData.append("photo1", photo1File)
        if (photo2File) imageData.append("photo2", photo2File)

        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/${giftId}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageData,
          }
        )

        if (!imageResponse.ok) {
          throw new Error("Image upload failed.")
        }
      }

      /* ==============================
        3️⃣ SAVE LOCK  ✅ FIXED ROUTE
      ============================== */

      const lockResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/premium-gifts/draft/${giftId}`, // ✅ CORRECT
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lock_question: config.lock.question,
            lock_answer: config.lock.answer,
            lock_hint: config.lock.hint || null,
          }),
        }
      )

      const lockData = await lockResponse.json()

      if (!lockResponse.ok || !lockData.success) {
        throw new Error(lockData.message || "Failed to save lock.")
      }

      /* ==============================
        4️⃣ REDIRECT
      ============================== */

      router.push(`/premium-gifts/valentine/preview/${giftId}`)

    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (
          !config.identity.senderName.trim() ||
          !config.identity.recipientName.trim() ||
          !config.identity.selectedDate
        ) {
          setError("Please fill names and select a date 💌")
          return false
        }
        break

      case 2:
        if (config.visuals.loveLevel <= 0) {
          setError("Set your love level ❤️")
          return false
        }
        break

      case 3:
        if (
          !config.puzzle.secretWord.trim() ||
          !config.puzzle.hint.trim()
        ) {
          setError("Secret word and hint are required 🧩")
          return false
        }
        break

      case 4:
        if (!photo1File || !photo2File) {
          setError("Upload both photos 📸")
          return false
        }
        break

      case 5:
        if (!config.visuals.carDesign) {
          setError("Select a delivery car 🚗")
          return false
        }
        break

      case 6:
        if (!config.message.heartToHeartMessage.trim()) {
          setError("Write your heart message 💕")
          return false
        }
        break

      case 7:
        if (
          config.message.coupons.length === 0 ||
          config.message.coupons.some(
            (c) => !c.title.trim() || !c.subtitle.trim()
          )
        ) {
          setError("All coupons must have title & subtitle 🎟️")
          return false
        }
        break

      case 9:
        if (
          !config.interaction.dateQuestion.trim() ||
          !config.interaction.dateActivity.trim()
        ) {
          setError("Complete your date question 💖")
          return false
        }
        break

      case 10:
        if (
          !config.lock.question.trim() ||
          !config.lock.answer.trim()
        ) {
          setError("Lock question and answer required 🔐")
          return false
        }
        break

      case 11:
        if (!config.closing.foreverMessage.trim()) {
          setError("Add your forever message 💍")
          return false
        }
        break
    }

    setError(null)
    return true
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--champagne))] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
      <Navigation />
       
       {/* Progress Bar */}
        <div className="mb-8">

          {/* Steps */}
          <div className="relative">
            <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide pb-1">

              {stepLabels.map((label, i) => {
                const Icon = stepIcons[i]
                const isActive = i + 1 <= step
                const isCurrent = i + 1 === step

                return (
                  <button
                    key={label}
                    onClick={() => i + 1 <= step && setStep(i + 1)}
                    className={`flex flex-col items-center gap-1 min-w-[60px] flex-shrink-0 transition ${
                      isActive ? "text-primary" : "text-muted-foreground/40"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                        isCurrent
                          ? "bg-primary text-primary-foreground scale-110"
                          : isActive
                          ? "bg-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] hidden md:block whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Progress Line */}
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          </div>
        </div>


        <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border/50">

          {/* Step 1: Names & Date */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Calendar className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  Set Your Valentine Date
                </h2>
                <p className="text-muted-foreground text-lg">When is your special day?</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sender" className="text-lg font-display">Your Name</Label>
                    <Input id="sender" value={config.identity.senderName} onChange={(e) => setConfig(prev => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        senderName: e.target.value
                      }
                    }))} placeholder="Your name" className="mt-2 text-lg h-12" />
                  </div>
                  <div>
                    <Label htmlFor="recipient" className="text-lg font-display">Their Name</Label>
                    <Input id="recipient" value={config.identity.recipientName} onChange={(e) => setConfig(prev => ({
                      ...prev,
                      identity: {
                        ...prev.identity,
                        recipientName: e.target.value
                      }
                    }))} placeholder="Valentine's name" className="mt-2 text-lg h-12" />
                  </div>
                </div>
                <div>
                  <Label className="text-lg font-display">Select Date (February)</Label>
                  <div className="flex gap-3 mt-4 justify-center">
                    {[12, 13, 14, 15, 16].map((date) => (
                      <button key={date} onClick={() => setConfig((prev) => ({ ...prev, identity: { ...prev.identity, selectedDate: date } }))} className={`relative w-14 h-14 rounded-xl border-2 transition-all duration-300 font-display text-xl ${config.identity.selectedDate === date ? "border-primary bg-primary/10 scale-110" : "border-border hover:border-primary/50"}`}>
                        {date}
                        {config.identity.selectedDate === date && <Heart className="absolute -top-2 -right-2 w-6 h-6 text-primary fill-primary animate-pulse-heart" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Love Meter */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Heart className="w-14 h-14 mx-auto text-primary mb-4 animate-pulse-heart" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">How Much Do You Love?</h2>
                <p className="text-muted-foreground text-lg">Drag to set the love meter</p>
              </div>
              <div className="space-y-8">
                <div className="text-center">
                  <span className="font-display text-8xl text-primary">{config.visuals.loveLevel}%</span>
                </div>
                <Slider value={[config.visuals.loveLevel]} onValueChange={(value) => setConfig((prev) => ({
                  ...prev,
                  visuals: {
                    ...prev.visuals,
                    loveLevel: value[0],
                  },
                }))
                } max={100} step={1} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground font-display">
                  <span>A little</span><span>To the moon</span><span>Infinite</span>
                </div>
              </div>
            </div>
          )}

        
          {/* Step 3: Word Puzzle */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Puzzle className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  Create Word Puzzle
                </h2>
                <p className="text-muted-foreground text-lg">
                  Hide a secret word for your valentine to find
                </p>
              </div>

              <div className="space-y-6">
                {/* SECRET WORD */}
                <div>
                  <Label htmlFor="word" className="text-lg font-display">
                    Secret Word
                  </Label>

                  <Input
                    id="word"
                    value={config.puzzle.secretWord}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        puzzle: {
                          ...prev.puzzle,
                          secretWord: e.target.value
                            .toUpperCase()
                            .slice(0, 8),
                        },
                      }))
                    }
                    placeholder="e.g., LOVE, HEART"
                    maxLength={8}
                    className="mt-2 text-lg h-12 uppercase"
                  />

                  <p className="text-sm text-muted-foreground mt-1">
                    Max 6 characters
                  </p>
                </div>

                {/* HINT */}
                <div>
                  <Label htmlFor="hint" className="text-lg font-display">
                    Hint for your Valentine
                  </Label>

                  <Input
                    id="hint"
                    value={config.puzzle.hint}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        puzzle: {
                          ...prev.puzzle,
                          hint: e.target.value,
                        },
                      }))
                    }
                    placeholder="A clue to help find the word"
                    className="mt-2 text-lg h-12"
                  />
                </div>
              </div>
            </div>
          )}


          {/* Step 4: Photo Upload */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <ImageIcon className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">Upload Your Polaroids</h2>
                <p className="text-muted-foreground text-lg">Two photos that will appear as polaroid snapshots</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2].map((num) => {
                  const photoKey = `photo${num}` as "photo1" | "photo2"
                  return (
                    <div key={num} className="space-y-3">
                      <Label className="text-lg font-display">Photo {num}</Label>
                      <label className="block cursor-pointer">
                        <div className={`bg-card p-2 pb-8 shadow-xl transition-all duration-300 hover:shadow-2xl ${num === 1 ? "rotate-[-3deg]" : "rotate-[2deg]"}`}>
                          <div className={`aspect-[3/4] rounded-sm border-2 border-dashed overflow-hidden ${config.visuals[photoKey] ? "border-transparent" : "border-border hover:border-primary/50"}`}>
                            {config.visuals[photoKey] ? (
                              <img src={config.visuals[photoKey] as string || "/placeholder.svg"} alt={`Photo ${num}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                                <ImageIcon className="w-10 h-10 mb-2" /><span className="text-sm">Click to upload</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload(num as 1 | 2)} className="hidden" />
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 5: Car Design */}
          {step === 5 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Car className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">Choose Love Delivery Car</h2>
                <p className="text-muted-foreground text-lg">A car will drive across delivering your love</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "pink", label: "Pink VW Bus", color: "bg-pink-200", iconColor: "text-pink-500" },
                  { id: "red", label: "Red Classic", color: "bg-red-100", iconColor: "text-red-500" },
                  { id: "classic", label: "Vintage Gold", color: "bg-amber-50", iconColor: "text-amber-600" },
                ].map((car) => (
                  <button key={car.id} onClick={() => 
                  setConfig((prev) => ({
                    ...prev,
                    visuals: {
                      ...prev.visuals,
                      carDesign: car.id as ValentineConfig["visuals"]["carDesign"],
                    },
                  }))} disabled={loading}
                     className={`p-5 rounded-2xl border-2 transition-all duration-300 ${config.visuals.carDesign === car.id ? "border-primary bg-primary/10 scale-105 shadow-lg" : "border-border hover:border-primary/50"}`}>
                    <div className={`w-full aspect-video rounded-lg mb-3 flex items-center justify-center ${car.color}`}>
                      <Car className={`w-10 h-10 ${car.iconColor}`} />
                    </div>
                    <span className="font-display text-sm">{car.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Heart to Heart Message */}
          {step === 6 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <MessageCircleHeart className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">Heart to Heart</h2>
                <p className="text-muted-foreground text-lg">Write a message from your heart to theirs</p>
              </div>
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="relative">
                  <Heart className="w-16 h-16 text-primary/60" fill="currentColor" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-primary-foreground font-display">You</span>
                </div>
                <div className="h-0.5 w-20 bg-primary/30 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">to</div>
                </div>
                <div className="relative">
                  <Heart className="w-16 h-16 text-red-400" fill="currentColor" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-primary-foreground font-display">Them</span>
                </div>
              </div>
              <div>
                <Label className="text-lg font-display">Your Message</Label>
                <Textarea value={config.message.heartToHeartMessage} onChange={(e) => 
                  setConfig((prev) => ({ ...prev,
                    message: {
                      ...prev.message,
                      heartToHeartMessage: e.target.value,
                    }
                    }))} 
                  placeholder="Write something heartfelt..." className="mt-2 text-lg min-h-[120px] resize-none" maxLength={200} />
                <p className="text-sm text-muted-foreground mt-1 text-right">{config.message.heartToHeartMessage.length}/200</p>
              </div>
            </div>
          )}

        
          {/* Step 7: Love Coupons */}
          {step === 7 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Ticket className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  Love Coupons
                </h2>
                <p className="text-muted-foreground text-lg">
                  Create redeemable love coupons
                </p>
              </div>

              <div className="space-y-5">
                {config.message.coupons.map((coupon, i) => {
                  const isTorn = tornCoupons.includes(i)

                  return (
                    <div
                      key={`coupon-editor-${i}`}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-500 overflow-hidden
                        ${i % 2 === 0
                          ? "bg-muted border-border"
                          : "bg-pink-50 border-pink-200"}
                        ${isTorn ? "animate-tear opacity-0 scale-90" : ""}
                      `}
                    >
                      {/* Zigzag tear edge */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-[radial-gradient(circle,_white_2px,_transparent_3px)] bg-[length:10px_10px]" />

                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-primary mt-2 flex-shrink-0" />

                        <div className="flex-1 space-y-2">
                          <Input
                            value={coupon.title}
                            onChange={(e) =>
                              updateCoupon(i, "title", e.target.value)
                            }
                            placeholder="e.g., Free kisses"
                            className="font-display text-lg border-none bg-transparent px-0 h-auto focus-visible:ring-0"
                          />

                          <Input
                            value={coupon.subtitle}
                            onChange={(e) =>
                              updateCoupon(i, "subtitle", e.target.value)
                            }
                            placeholder="e.g., Unlimited uses"
                            className="text-sm text-muted-foreground border-none bg-transparent px-0 h-auto focus-visible:ring-0"
                          />
                        </div>

                        <button
                          onClick={() => tearCoupon(i)}
                          className="text-xs text-red-400 hover:text-red-600 transition"
                        >
                          Tear ✂
                        </button>
                      </div>

                      <span className="absolute right-3 bottom-2 text-xs text-muted-foreground font-mono">
                        #{String(961004 + i).padStart(6, "0")}
                      </span>
                    </div>
                  )
                })}

                {/* Add Coupon */}
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      message: {
                        ...prev.message,
                        coupons: [
                          ...prev.message.coupons,
                          { title: "", subtitle: "" },
                        ],
                      },
                    }))
                  }
                >
                  + Add Coupon
                </Button>
              </div>

              {/* Animation Styles */}
              <style jsx>{`
                @keyframes tearEffect {
                  0% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                  }
                  40% {
                    transform: scale(1.05) rotate(-2deg);
                  }
                  100% {
                    transform: scale(0.8) rotate(6deg);
                    opacity: 0;
                  }
                }

                .animate-tear {
                  animation: tearEffect 0.6s ease forwards;
                }
              `}</style>
            </div>
          )}


          {/* Step 8: Truck Hearts */}
          {step === 8 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Truck className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">Truckload of Love</h2>
                <p className="text-muted-foreground text-lg">A truck will arrive and dump all your love hearts</p>
              </div>
              <div className="flex justify-center">
                <img src="/heart-truck.PNG" alt="Heart truck preview" className="w-84 h-auto rounded-2xl shadow-lg" />
              </div>
              <p className="text-center text-muted-foreground">
                This animated scene will show a red truck arriving and dumping a pile of hearts for {config.identity.recipientName || "your valentine"}.
              </p>
            </div>
          )}

          {/* Step 9: Ask Out */}
          {step === 9 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <HeartHandshake className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  Pop the Question
                </h2>
                <p className="text-muted-foreground text-lg">
                  Ask your valentine out - they literally cannot say no
                </p>
              </div>

              {/* Preview */}
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
                  </div>
                  <span className="text-sm text-muted-foreground font-display">
                    Preview of the interactive section
                  </span>
                </div>

                <p className="font-display text-xl text-foreground text-center italic mb-3">
                  {config.interaction.dateQuestion ||
                    "Will you go on a date with me? "}
                </p>

                <div className="flex justify-center gap-4">
                  <div className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-display">
                    Yes!
                  </div>
                  <div className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-xs font-display">
                    No
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Question Input */}
                <div>
                  <Label className="text-lg font-display">Your Question</Label>
                  <Input
                    value={config.interaction.dateQuestion}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        interaction: {
                          ...prev.interaction,
                          dateQuestion: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Will you go on a date with me?"
                    className="mt-2 text-lg h-12"
                  />
                </div>

              
                {/* Activity Selection */}
                <div>
                  <Label className="text-lg font-display">
                    What kind of date are you planning?
                  </Label>

                  <Input
                    value={config.interaction.dateActivity}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        interaction: {
                          ...prev.interaction,
                          dateActivity: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Candlelight Dinner, Goa trip, Movie night..."
                    className="mt-2 text-lg h-12"
                  />

                  <p className="text-sm text-muted-foreground mt-2">
                    Be creative — this is what they'll see after saying yes.
                  </p>
                </div>


              </div>
            </div>
          )}

         {/* STEP 10 LOCK (ALWAYS REQUIRED) */}
          {step === 10 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center">
                <HeartHandshake className="w-14 h-14 mx-auto text-primary mb-4" />
                <h2 className="text-3xl font-display">
                  Protect Your Valentine 💌
                </h2>
                <p className="text-muted-foreground">
                  Add a secret question they must answer to unlock it.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Lock Question (e.g. Where did we first meet?)"
                  value={config.lock.question}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      lock: {
                        ...prev.lock,
                        enabled: true, // always true
                        question: e.target.value,
                      },
                    }))
                  }
                />

                <Input
                  placeholder="Correct Answer"
                  value={config.lock.answer}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      lock: {
                        ...prev.lock,
                        enabled: true, // always true
                        answer: e.target.value,
                      },
                    }))
                  }
                />

                <Input
                  placeholder="Hint (e.g. Our first date)" 
                  value={config.lock.hint}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      lock: {
                        ...prev.lock,
                        enabled: true,
                        hint: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          )}


          {/* STEP 11 FOREVER */}
          {step === 11 && (
            <div className="space-y-6 text-center">
              <Heart className="w-14 h-14 mx-auto text-primary" />
              <h2 className="text-3xl font-display">Forever Yours</h2>

              <Input
                value={config.closing.foreverMessage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    closing: { ...prev.closing, foreverMessage: e.target.value },
                  }))
                }
                placeholder="Our love is forever (add your own romantic message here)"
                className="text-center"
              />
            </div>
          )}


          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => {
                  if (validateStep()) {
                    setStep((s) => s + 1)
                  }
                }}
                disabled={loading}
              >

                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create Valentine"}
              </Button>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        {/* lsat div */}
      </div>
      
    </div>
    
  )
    
}