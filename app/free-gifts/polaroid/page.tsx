"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Heart,
  Share2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type Step = "create" | "preview" | "share";

export default function PolaroidGiftPage() {
  const [step, setStep] = useState<Step>("create");

  // image preview (base64 OR backend path)
  const [image, setImage] = useState<string | null>(null);

  // actual file sent to backend
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  const [isFlipped, setIsFlipped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * FINAL image source resolver
   * - base64 → preview immediately
   * - backend path → correct absolute URL
   */
  const imageSrc =
    image?.startsWith("data:")
      ? image
      : image
      ? `${process.env.NEXT_PUBLIC_API_URL}/${image}`
      : null;

  /* ============================
     IMAGE UPLOAD (UNCHANGED UI)
  ============================ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ============================
     CREATE → BACKEND
  ============================ */
  const handleCreate = async () => {
    if (!imageFile || !recipientName) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("gift_type", "polaroid");
      formData.append("recipient_name", recipientName);
      formData.append("sender_name", senderName);
      formData.append("message", message);
      formData.append("image", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Gift creation failed");

      const data = await res.json();

      // IMPORTANT: switch to backend image after create
      setImage(data.image_path);
      setShareToken(data.token);

      setStep("preview");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     INTERACTIONS
  ============================ */
  const handleFlip = () => setIsFlipped((v) => !v);

  const handleShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleShare = () => setStep("share");

  const handleReset = () => {
    setStep("create");
    setImage(null);
    setImageFile(null);
    setRecipientName("");
    setSenderName("");
    setMessage("");
    setIsFlipped(false);
    setShareToken(null);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ================= CREATE ================= */}
            {step === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
                    Polaroid <span className="italic text-primary">Memory</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Create a shaking polaroid with a hidden message
                  </p>
                </div>

                {/* Image Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-secondary/30"
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <Camera className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click to upload a photo
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's name"
                    className="text-lg"
                  />
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hidden message"
                    rows={3}
                    className="text-lg"
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!imageFile || !recipientName || loading}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Create Polaroid
                </Button>
              </motion.div>
            )}

            {/* ================= PREVIEW ================= */}
            {step === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                    For{" "}
                    <span className="italic text-primary">
                      {recipientName}
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    Shake or tap the polaroid to reveal your message
                  </p>
                </div>

                {/* Polaroid */}
                <div className="flex justify-center perspective-1000">
                  <motion.div
                    className={`relative cursor-pointer ${
                      isShaking ? "animate-shake" : ""
                    }`}
                    animate={{
                      rotateY: isFlipped ? 180 : 0,
                      rotate: isShaking ? [0, -3, 3, -3, 3, 0] : 0,
                    }}
                    transition={{
                      rotateY: { duration: 0.6, ease: "easeInOut" },
                      rotate: { duration: 0.4 },
                    }}
                    onClick={handleFlip}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* FRONT */}
                    <div
                      className="relative bg-white p-4 pb-16 shadow-xl rounded-sm"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="w-64 h-64 md:w-80 md:h-80 overflow-hidden">
                        {imageSrc && (
                          <img
                            src={imageSrc}
                            alt="Memory"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm">
                        Tap to flip
                      </p>
                    </div>

                    {/* BACK */}
                    <div
                      className="absolute inset-0 bg-white p-6 shadow-xl rounded-sm flex flex-col items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center text-center">
                        <Heart className="w-8 h-8 text-primary fill-primary mb-4" />
                        <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                          {message || "You are loved."}
                        </p>
                        <p className="mt-6 text-muted-foreground text-sm italic">
                          With love, always.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleShake}
                    className="text-primary hover:text-primary/80 text-sm flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Shake the polaroid
                  </button>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 text-lg py-6"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ================= SHARE ================= */}
            {step === "share" && (
              <motion.div
                key="share"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                    Polaroid <span className="italic text-primary">Created!</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Your polaroid memory is ready to share
                  </p>
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">
                    Share this link:
                  </p>
                  <p className="text-foreground font-mono text-sm break-all bg-background p-3 rounded-lg">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/polaroid/${shareToken}`}
                  </p>
                </div>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="text-lg px-8 py-6"
                >
                  Create Another
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
