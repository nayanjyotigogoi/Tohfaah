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
  Copy,
  Check,
} from "lucide-react";

type Step = "create" | "preview" | "share";

type Errors = {
  image?: string;
  recipientName?: string;
  senderName?: string;
};

export default function PolaroidGiftPage() {
  const [step, setStep] = useState<Step>("create");

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * FINAL image resolver
   * - base64 → preview
   * - public path → /images/polaroid/xxx.jfif
   */
  const imageSrc =
  image?.startsWith("data:")
    ? image
    : image?.startsWith("http")
    ? image
    : image
    ? `${process.env.NEXT_PUBLIC_API_URL}/${image.replace(/^public\//, "")}`
    : null;


  const handleCopy = async () => {
    if (!shareToken) return;

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/polaroid/${shareToken}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  /* ============================
     IMAGE UPLOAD
  ============================ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: undefined }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ============================
     VALIDATION
  ============================ */
  const validate = () => {
    const newErrors: Errors = {};

    if (!imageFile) {
      newErrors.image = "Please add a photo to create your polaroid.";
    }
    if (!recipientName.trim()) {
      newErrors.recipientName = "Who is this memory for?";
    }
    if (!senderName.trim()) {
      newErrors.senderName = "Let them know who this is from 🤍";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ============================
     CREATE → BACKEND
     ✅ ONLY CHANGE IS HERE
  ============================ */
  const handleCreate = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      const formData = new FormData();
      formData.append("gift_type", "polaroid");
      formData.append("recipient_name", recipientName.trim());
      formData.append("sender_name", senderName.trim());
      formData.append("message", message);
      formData.append("image", imageFile!);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/free-gifts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

    const data = await res.json();

    /* ===============================
      🔥 WARM OG ROUTE (ADD THIS)
    ================================ */
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/og/polaroid/${data.token}`
    ).catch(() => {});

    /* ===============================
      EXISTING LOGIC
    ================================ */
    setImage(data.image_url);
    setShareToken(data.token);
    setStep("preview");

    } catch {
      setErrors({
        image: "Something went wrong while creating your polaroid.",
      });
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

  const handleReset = () => {
    setStep("create");
    setImage(null);
    setImageFile(null);
    setRecipientName("");
    setSenderName("");
    setMessage("");
    setErrors({});
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
                  <Camera className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h1 className="text-3xl md:text-4xl font-light">
                    Polaroid <span className="italic text-primary">Memory</span>
                  </h1>
                  <p className="text-muted-foreground">
                    A photo, a message, a feeling
                  </p>
                </div>

                {/* Image Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square max-w-sm mx-auto rounded-2xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer overflow-hidden"
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Camera className="w-10 h-10" />
                      <p>Click to upload a photo</p>
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

                {errors.image && (
                  <p className="text-sm text-red-500 text-center">
                    {errors.image}
                  </p>
                )}

                {/* Form */}
                <div className="space-y-3">
                  <div>
                    <Input
                      value={recipientName}
                      onChange={(e) => {
                        setRecipientName(e.target.value);
                        setErrors((p) => ({ ...p, recipientName: undefined }));
                      }}
                      placeholder="Recipient's name"
                      className="text-lg"
                    />
                    {errors.recipientName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      value={senderName}
                      onChange={(e) => {
                        setSenderName(e.target.value);
                        setErrors((p) => ({ ...p, senderName: undefined }));
                      }}
                      placeholder="Sender's name"
                      className="text-lg"
                    />
                    {errors.senderName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.senderName}
                      </p>
                    )}
                  </div>

                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hidden message (optional)"
                    rows={3}
                    className="text-lg"
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={loading}
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
                  <h2 className="text-2xl md:text-3xl font-light mb-2">
                    For{" "}
                    <span className="italic text-primary">
                      {recipientName}
                    </span>
                  </h2>
                </div>

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
                      <div className="w-64 h-64 md:w-80 md:h-80 text-center">
                        <Heart className="w-8 h-8 text-primary fill-primary mb-4 mx-auto" />
                        <p className="text-lg whitespace-pre-wrap">
                          {message || "You are loved."}
                        </p>
                        <p className="mt-6 text-muted-foreground text-sm italic">
                          — {senderName}
                        </p>
                      </div>
                    </div>
                  </motion.div>
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
                    onClick={() => setStep("share")}
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
                <Sparkles className="w-10 h-10 text-primary mx-auto" />

                <h2 className="text-2xl md:text-3xl font-light">
                  Polaroid Created!
                </h2>

                <div className="p-6 bg-secondary/50 rounded-xl space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Share this link:
                  </p>

                  <div className="flex items-center gap-2 justify-center">
                    <p className="font-mono text-sm break-all bg-background px-4 py-3 rounded-lg">
                      {`${process.env.NEXT_PUBLIC_APP_URL}/free-gifts/polaroid/${shareToken}`}
                    </p>

                    {/* COPY BUTTON */}
                    <button
                      onClick={handleCopy}
                      aria-label="Copy link"
                      className="p-3 rounded-full border bg-background hover:bg-muted transition"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {copied && (
                    <p className="text-xs text-green-600">
                      Link copied 💖
                    </p>
                  )}
                </div>

                <Button onClick={handleReset} variant="outline">
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
