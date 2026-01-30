"use client";

import React from "react";

import { useState } from "react";
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

const steps: { id: BuilderStep; label: string; icon: React.ElementType }[] = [
  { id: "intro", label: "Start", icon: Heart },
  { id: "security", label: "Secret Question", icon: Lock },
  { id: "message", label: "Main Message", icon: MessageSquare },
  { id: "letters", label: "Love Letters", icon: MessageSquare },
  { id: "conversation", label: "Conversation", icon: MessageSquare },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "map", label: "Map", icon: MapPin },
  { id: "proposal", label: "Proposal", icon: Ticket },
  { id: "preview", label: "Preview", icon: Sparkles },
];

export default function CreateGiftPage() {
  const [currentStep, setCurrentStep] = useState<BuilderStep>("intro");
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

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goToNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const updateGiftData = (updates: Partial<GiftData>) => {
    setGiftData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <main className="relative min-h-screen bg-background">
      <FloatingElements density="low" />
      <Navigation />

      <div className="pt-24 pb-20">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
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
                    <step.icon className="w-5 h-5" />
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
                    Add your favorite photos together
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center bg-secondary/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Photo upload will be available after payment
                </p>

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
            {currentStep === "preview" && (
              <StepWrapper key="preview">
                <div className="text-center space-y-4 mb-8">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-light text-foreground">
                    Your <span className="italic text-primary">Experience</span> is Ready!
                  </h2>
                  <p className="text-muted-foreground">
                    Review your creation for {giftData.recipientName}
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">Secret Question</p>
                    <p className="text-foreground">{giftData.secretQuestion}</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">Main Message</p>
                    <p className="text-foreground line-clamp-2">{giftData.mainMessage}</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">Love Letters</p>
                    <p className="text-foreground">{giftData.loveLetters.filter(Boolean).length} notes</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">Conversation</p>
                    <p className="text-foreground">{giftData.conversationMessages.filter(Boolean).length} messages</p>
                  </div>
                  {giftData.mapLocations.from && giftData.mapLocations.to && (
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <p className="text-sm text-muted-foreground">Map Connection</p>
                      <p className="text-foreground">{giftData.mapLocations.from} to {giftData.mapLocations.to}</p>
                    </div>
                  )}
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">Proposal</p>
                    <p className="text-foreground">{giftData.proposalQuestion || "No proposal set"}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-6 bg-gradient-to-br from-rose-950 to-pink-950 rounded-2xl mt-8 text-center">
                  <p className="text-rose-100 text-sm mb-2">One-time payment</p>
                  <p className="text-4xl font-light text-white mb-4">$9.99</p>
                  <p className="text-rose-200 text-sm mb-6">
                    Unlimited shares. Forever yours.
                  </p>
                  <Button
                    className="w-full text-lg py-6 bg-white hover:bg-rose-50 text-rose-950"
                    onClick={() => alert("Payment integration coming soon!")}
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Unlock & Create Link
                  </Button>
                </div>

                <Button
                  onClick={goToPrev}
                  variant="outline"
                  className="w-full mt-4 py-6 bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back & Edit
                </Button>
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
