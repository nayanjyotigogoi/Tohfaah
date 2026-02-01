"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { FloatingElements } from "@/components/floating-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Heart,
  Lock,
  MessageSquare,
  ImageIcon,
  MapPin,
  Ticket,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* =========================================================
   API HELPERS
========================================================= */
async function sanctumInit() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

async function api(
  url: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any
) {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", res.status, text);
    throw new Error(text || "API Error");
  }

  return res.json();
}

async function uploadGiftPhoto(giftId: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${API_BASE}/api/premium-gifts/${giftId}/images`,
    {
      method: "POST",
      credentials: "include", // REQUIRED (sanctum)
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Photo upload failed");
  }

  return res.json(); // { id, url }
}


/* =========================================================
   TYPES
========================================================= */
type BuilderStep =
  | "intro"
  | "security"
  | "message"
  | "letters"
  | "conversation"
  | "photos"
  | "map"
  | "proposal"
  | "preview";

interface GiftData {
  recipientName: string;
  senderName: string;
  secretQuestion: string;
  secretAnswer: string;
  mainMessage: string;
  loveLetters: string[];
  conversationMessages: string[];
  photos: string[];
  mapLocations: { from: string; to: string };
  proposalQuestion: string;
  proposalDate: string;
}

/* =========================================================
   STEPS
========================================================= */
const steps: BuilderStep[] = [
  "intro",
  "security",
  "message",
  "letters",
  "conversation",
  "photos",
  "map",
  "proposal",
  "preview",
];

/* =========================================================
   PAGE
========================================================= */
export default function CreateGiftPage() {
  const [currentStep, setCurrentStep] = useState<BuilderStep>("intro");
  const [giftId, setGiftId] = useState<string | null>(null);
  const savingRef = useRef(false);
/* =========================================================
     COUPON
  ========================================================= */
const [couponCode, setCouponCode] = useState("");
const [unlocking, setUnlocking] = useState(false);
const [couponError, setCouponError] = useState<string | null>(null);


  const [giftData, setGiftData] = useState<GiftData>({
    recipientName: "",
    senderName: "",
    secretQuestion: "",
    secretAnswer: "",
    mainMessage: "",
    loveLetters: [""],
    conversationMessages: ["", "", ""],
    photos: [],
    mapLocations: { from: "", to: "" },
    proposalQuestion: "",
    proposalDate: "",
  });

  /* =========================================================
     RESUME DRAFT (FROM DASHBOARD)
  ========================================================= */
  useEffect(() => {
    const draftId = localStorage.getItem("resume_premium_draft_id");
    if (draftId) {
      setGiftId(draftId);
      localStorage.removeItem("resume_premium_draft_id");
    }
  }, []);

  /* =========================================================
     LOAD EXISTING DRAFT DATA  ✅ FIX
  ========================================================= */
  useEffect(() => {
    if (!giftId) return;

    const loadDraft = async () => {
      try {
        const draft = await api(`/api/premium-gifts/${giftId}`, "GET");

        setGiftData({
          recipientName: draft.recipient_name ?? "",
          senderName: draft.sender_name ?? "",
          secretQuestion: draft.secret_question ?? "",
          secretAnswer: "",
          mainMessage: draft.message_body ?? "",
          loveLetters: draft.love_letter_content ?? [""],
          conversationMessages: draft.memories ?? ["", "", ""],
          photos: draft.photos ?? [],
          mapLocations: {
            from: draft.sender_location ?? "",
            to: draft.recipient_location ?? "",
          },
          proposalQuestion: draft.proposal_question ?? "",
          proposalDate: draft.proposed_datetime ?? "",
        });
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    };

    loadDraft();
  }, [giftId]);

  /* =========================================================
     SANCTUM BOOTSTRAP
  ========================================================= */
  useEffect(() => {
    sanctumInit().catch(() => {});
  }, []);

  const currentStepIndex = steps.indexOf(currentStep);

  /* =========================================================
     CREATE / SAVE
  ========================================================= */
  async function createDraftIfNeeded() {
    if (giftId) return;

    const res = await api("/api/premium-gifts", "POST", {
      template_type: "valentine",
      recipient_name: giftData.recipientName,
      sender_name: giftData.senderName,
    });

    setGiftId(res.id);
  }

  async function saveDraft() {
    if (!giftId || savingRef.current) return;
    savingRef.current = true;

    try {
      await api(`/api/premium-gifts/${giftId}`, "PUT", {
        has_secret_question: !!giftData.secretQuestion,
        secret_question: giftData.secretQuestion,
        ...(giftData.secretAnswer && {
          secret_answer: giftData.secretAnswer,
        }),

        message_body: giftData.mainMessage,

        has_love_letter: giftData.loveLetters.some(Boolean),
        love_letter_content: giftData.loveLetters,

        has_memories: giftData.conversationMessages.some(Boolean),
        conversation_messages: giftData.conversationMessages,

        has_map:
          !!giftData.mapLocations.from && !!giftData.mapLocations.to,
        sender_location: giftData.mapLocations.from,
        recipient_location: giftData.mapLocations.to,

        has_proposal: !!giftData.proposalQuestion,
        proposal_question: giftData.proposalQuestion,

        proposed_datetime: giftData.proposalDate || null,

      });
    } finally {
      savingRef.current = false;
    }
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const goToNext = async () => {
    if (currentStep === "intro") await createDraftIfNeeded();
    await saveDraft();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const goToPrev = async () => {
    await saveDraft();
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const updateGiftData = (updates: Partial<GiftData>) => {
    setGiftData((prev) => ({ ...prev, ...updates }));
  };

  async function unlockWithCoupon() {
  if (!giftId || !couponCode.trim()) return;

  setUnlocking(true);
  setCouponError(null);

  try {
    const res = await api(
      `/api/premium-gifts/${giftId}/apply-coupon`,
      "POST",
      { code: couponCode.trim() }
    );

    // Redirect to final public gift
    window.location.href = res.share_url;
  } catch (err: any) {
    setCouponError(
      err?.message || "Invalid or expired coupon code"
    );
  } finally {
    setUnlocking(false);
  }
}


  /* =========================================================
     UI (UNCHANGED)
  ========================================================= */
  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-24 pb-20">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : (
                  // icon rendering logic unchanged
                  <Sparkles className="w-5 h-5" />
                )}
              </motion.div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-8 md:w-16 mx-1 transition-colors ${
                    index < currentStepIndex ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Intro Step */}
            {currentStep === "intro" && (
              <StepWrapper key="intro">
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-light text-foreground">
                    Create a <span className="italic text-primary">Memory Experience</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Build an interactive love story with butterflies, 
                    photo galleries, map connections, and a heartfelt proposal.
                  </p>
                </div>

                <div className="space-y-4 mt-8">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Who is this experience for?
                    </label>
                    <Input
                      value={giftData.recipientName}
                      onChange={(e) =>
                        updateGiftData({ recipientName: e.target.value })
                      }
                      placeholder="Their name..."
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your name
                    </label>
                    <Input
                      value={giftData.senderName}
                      onChange={(e) =>
                        updateGiftData({ senderName: e.target.value })
                      }
                      placeholder="Your name..."
                      className="text-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={goToNext}
                  disabled={!giftData.recipientName || !giftData.senderName}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground mt-8"
                >
                  Begin Creating
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </StepWrapper>
            )}

            {/* Security Step */}
            {currentStep === "security" && (
              <StepWrapper key="security">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    Set a <span className="italic text-primary">Secret Question</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Only the two of you know this answer
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your secret question
                    </label>
                    <Input
                      value={giftData.secretQuestion}
                      onChange={(e) =>
                        updateGiftData({ secretQuestion: e.target.value })
                      }
                      placeholder="e.g., Where did we first meet?"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      The answer
                    </label>
                    <Input
                      value={giftData.secretAnswer}
                      onChange={(e) =>
                        updateGiftData({ secretAnswer: e.target.value })
                      }
                      placeholder="The answer only they would know..."
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    disabled={!giftData.secretQuestion || !giftData.secretAnswer}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

            {/* Message Step */}
            {currentStep === "message" && (
              <StepWrapper key="message">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    Your <span className="italic text-primary">Main Message</span>
                  </h2>
                  <p className="text-muted-foreground">
                    This message will reveal line-by-line with dramatic animation
                  </p>
                </div>

                <Textarea
                  value={giftData.mainMessage}
                  onChange={(e) => updateGiftData({ mainMessage: e.target.value })}
                  placeholder="Write your heartfelt message here. Each line will appear one at a time..."
                  rows={8}
                  className="text-lg"
                />

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    disabled={!giftData.mainMessage}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

            {/* Letters Step */}
            {currentStep === "letters" && (
              <StepWrapper key="letters">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    <span className="italic text-primary">Love Letters</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Add short notes displayed as beautiful floating cards
                  </p>
                </div>

                <div className="space-y-4">
                  {giftData.loveLetters.map((letter, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Note {index + 1}
                      </label>
                      <Textarea
                        value={letter}
                        onChange={(e) => {
                          const newLetters = [...giftData.loveLetters];
                          newLetters[index] = e.target.value;
                          updateGiftData({ loveLetters: newLetters });
                        }}
                        placeholder="A short note or thought..."
                        rows={3}
                      />
                    </div>
                  ))}
                  {giftData.loveLetters.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateGiftData({
                          loveLetters: [...giftData.loveLetters, ""],
                        })
                      }
                      className="w-full"
                    >
                      Add Another Note
                    </Button>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

            {/* Conversation Step */}
            {currentStep === "conversation" && (
              <StepWrapper key="conversation">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    <span className="italic text-primary">Conversation Memory</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Recreate a memorable chat between you two
                  </p>
                </div>

                <div className="space-y-3">
                  {giftData.conversationMessages.map((msg, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="text-xs text-muted-foreground mt-3 w-8">
                        {index % 2 === 0 ? "You" : "Them"}
                      </span>
                      <Input
                        value={msg}
                        onChange={(e) => {
                          const newMsgs = [...giftData.conversationMessages];
                          newMsgs[index] = e.target.value;
                          updateGiftData({ conversationMessages: newMsgs });
                        }}
                        placeholder={`Message ${index + 1}...`}
                        className={index % 2 === 0 ? "bg-primary/5" : ""}
                      />
                    </div>
                  ))}
                  {giftData.conversationMessages.length < 10 && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateGiftData({
                          conversationMessages: [
                            ...giftData.conversationMessages,
                            "",
                          ],
                        })
                      }
                      className="w-full"
                    >
                      Add Message
                    </Button>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

          {/* Photos Step */}
          {currentStep === "photos" && (
            <StepWrapper key="photos">
              <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-foreground">
                  <span className="italic text-primary">Photo Gallery</span>
                </h2>
                <p className="text-muted-foreground">
                  Add moments that deserve to be remembered
                </p>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload"
                onChange={async (e) => {
  if (!e.target.files || !giftId) return;

  const files = Array.from(e.target.files).slice(0, 6 - giftData.photos.length);

  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const res = await uploadGiftPhoto(giftId, file);
      uploadedUrls.push(res.url); // 👈 real backend URL
    }

    updateGiftData({
      photos: [...giftData.photos, ...uploadedUrls],
    });
  } catch (err) {
    console.error("Photo upload failed", err);
    alert("Failed to upload photo");
  } finally {
    e.target.value = ""; // allow reselect same file
  }
}}

              />

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => {
                  const photo = giftData.photos[index];

                  return (
                    <label
                      key={index}
                      htmlFor="photo-upload"
                      className="cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary/30 flex items-center justify-center"
                      >
                        {photo ? (
                          <>
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const updated = [...giftData.photos];
                                updated.splice(index, 1);
                                updateGiftData({ photos: updated });
                              }}
                              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </motion.div>
                    </label>
                  );
                })}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                You can add up to 6 photos
              </p>

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                <Button
                  onClick={goToPrev}
                  variant="outline"
                  className="flex-1 py-6 bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={goToNext}
                  className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
                </StepWrapper>
              )}


            {/* Map Step */}
            {currentStep === "map" && (
              <StepWrapper key="map">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    <span className="italic text-primary">Map Connection</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Show the distance between your hearts
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your location
                    </label>
                    <Input
                      value={giftData.mapLocations.from}
                      onChange={(e) =>
                        updateGiftData({
                          mapLocations: {
                            ...giftData.mapLocations,
                            from: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., New York City"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Heart className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Their location
                    </label>
                    <Input
                      value={giftData.mapLocations.to}
                      onChange={(e) =>
                        updateGiftData({
                          mapLocations: {
                            ...giftData.mapLocations,
                            to: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Los Angeles"
                    />
                  </div>
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl mt-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    A beautiful animated map will show a heart traveling between your locations
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

            {/* Proposal Step */}
            {currentStep === "proposal" && (
              <StepWrapper key="proposal">
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Ticket className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    <span className="italic text-primary">The Big Question</span>
                  </h2>
                  <p className="text-muted-foreground">
                    End with a special proposal or date invitation
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your question
                    </label>
                    <Textarea
                      value={giftData.proposalQuestion}
                      onChange={(e) =>
                        updateGiftData({ proposalQuestion: e.target.value })
                      }
                      placeholder="e.g., Will you go on a date with me?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Proposed date/time (optional)
                    </label>
                    <Input
                      value={giftData.proposalDate}
                      onChange={(e) =>
                        updateGiftData({ proposalDate: e.target.value })
                      }
                      placeholder="e.g., This Saturday at 7pm"
                    />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl mt-6">
                  <p className="text-foreground text-center">
                    They&apos;ll see: &ldquo;{giftData.proposalQuestion || "Your question here"}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm text-center mt-2">
                    With YES / MAYBE LATER buttons
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={goToPrev} variant="outline" className="flex-1 py-6 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={goToNext}
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Preview
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </StepWrapper>
            )}

           
            {/* Preview Step */}
{/* Preview Step */}
{currentStep === "preview" && giftId && (
  <StepWrapper key="preview">
    <div className="text-center space-y-4 mb-6">
      <motion.div
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-10 h-10 text-primary" />
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-light text-foreground">
        Live <span className="italic text-primary">Preview</span>
      </h2>

      <p className="text-muted-foreground">
        This is exactly how {giftData.recipientName} will experience it
      </p>
    </div>

    {/* REAL PREVIEW */}
    <div className="rounded-2xl overflow-hidden border border-border bg-background">
      <iframe
        src={`/gift/valentine/${giftId}?preview=1`}
        className="w-full h-[80vh]"
        allow="autoplay"
      />
    </div>

    {/* Go back */}
    <Button
      onClick={goToPrev}
      variant="outline"
      className="w-full mt-6 py-6 bg-transparent"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back & Edit
    </Button>

    {/* 🔐 UNLOCK SECTION */}
    <div className="mt-8 p-6 rounded-2xl border border-border bg-secondary/30 space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <Lock className="w-5 h-5" />
        <h3 className="text-lg font-medium">Unlock & Share</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Once unlocked, this gift can no longer be edited.
      </p>

      <Input
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        disabled={unlocking}
      />

      {couponError && (
        <p className="text-sm text-red-500">{couponError}</p>
      )}

      <Button
        onClick={unlockWithCoupon}
        disabled={!couponCode || unlocking}
        className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {unlocking ? "Unlocking..." : "Unlock & Generate Share Link"}
      </Button>

      {/* Future payment placeholder */}
      <Button
        variant="outline"
        disabled
        className="w-full py-6 bg-transparent"
      >
        Proceed to Payment (Coming Soon)
      </Button>
    </div>
  </StepWrapper>
)}


          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}
