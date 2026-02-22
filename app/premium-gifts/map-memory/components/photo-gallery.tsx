"use client"

import { Memory } from "@/lib/memory-types"
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { downloadShareCard, shareMemory } from "@/lib/generate-share-card"

interface PhotoGalleryProps {
  memories: Memory[]
  initialIndex?: number
  onClose: () => void
}

export function PhotoGallery({ memories, initialIndex = 0, onClose }: PhotoGalleryProps) {
  const memoriesWithPhotos = memories.filter((m) => m.imageUrl)
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 && initialIndex < memoriesWithPhotos.length ? initialIndex : 0
  )

  const currentMemory = memoriesWithPhotos[currentIndex]

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memoriesWithPhotos.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memoriesWithPhotos.length) % memoriesWithPhotos.length)
  }

  const handleExport = () => {
    shareMemory(currentMemory)
  }

  const handleDownload = () => {
    downloadShareCard(currentMemory)
  }

  if (!currentMemory) return null

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex-1 min-w-0 mr-4">
          <h2 className="text-white font-semibold text-lg truncate">
            {currentMemory.title}
          </h2>
          <p className="text-white/70 text-sm">
            {currentIndex + 1} of {memoriesWithPhotos.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Download Card"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleExport}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Share Memory"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="h-full flex items-center justify-center p-4 md:p-20">
        <div className="relative w-full max-w-5xl">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/50 shadow-2xl">
            {currentMemory.imageUrl && (
              <Image
                src={currentMemory.imageUrl}
                alt={currentMemory.title}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Navigation */}
          {memoriesWithPhotos.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: currentMemory.badge.bgColor,
                color: currentMemory.badge.color,
              }}
            >
              {currentMemory.badge.emoji} {currentMemory.badge.label}
            </span>
            {currentMemory.date && (
              <span className="text-white/70 text-sm">
                {new Date(currentMemory.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          <p className="text-white/90 text-pretty">
            {currentMemory.message}
          </p>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-28 left-0 right-0 z-10">
        <div className="flex gap-2 overflow-x-auto px-6 pb-2 scrollbar-hide">
          {memoriesWithPhotos.map((memory, index) => (
            <button
              key={memory.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-white scale-110"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              {memory.imageUrl && (
                <Image
                  src={memory.imageUrl}
                  alt={memory.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
